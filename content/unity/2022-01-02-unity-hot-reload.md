---
title : 关于unity的热重载的研究
---

## Roslyn C# - Runtime Compiler

### 通过FileSystemWatcher监控目录检查改变的文件

unity的FileSystemWatcher有点问题,子目录下文件返回的路径是错的.所以需要先存储下cs文件进行索引

```csharp
public RealtimeScriptWatcher(ScriptDomain domain, string folderPath)
{
    this.domain = domain;
    Files = new Dictionary<string, string>();
    string[] fileEntries = Directory.GetFiles(folderPath,"*.cs", SearchOption.AllDirectories);
    foreach (var item in fileEntries)
    {
        var key = Path.GetFileName(item);
        if (Files.TryGetValue(key,out var f) == false)
        {
            Files.Add(key, item);
        }
        else
        {
            Debug.LogError($"{f}和{item}的文件名相同");
        }
    }
```

### 编译修改的文件并重新加载

```csharp
  // Recompile the script
    ScriptAssembly asm = domain.CompileAndLoadFile(path, securityMode);
    
    // Check for success
    if(asm == null)
    {
        domain.LogCompilerOutputToConsole();
        return;
    }
    
    // Find the type for the changed source file
    Type mainMonoType = GetMainMonoTypeForSourceFile(path);
    
    // Find type with matching full name
    ScriptType reloadType = asm.FindType(mainMonoType);
```

### 替换场景中的monobehavior

```csharp
public static bool ReplaceScriptsForScene(Scene targetScene, ScriptType scriptType, out ModScriptReplacerReport report, ScriptReplacerOptions options = ScriptReplacerOptions.Default)
{
    bool failed = false;
    report = new ModScriptReplacerReport();

    bool includeInactive = (options & ScriptReplacerOptions.ReplaceDisabledScripts) != 0;

    foreach (GameObject gameObject in targetScene.GetRootGameObjects())
    {
        foreach (MonoBehaviour behaviour in gameObject.GetComponentsInChildren<MonoBehaviour>(includeInactive))
        {
            if (ReplaceScriptBehaviourImpl(behaviour, scriptType, ref report, options) == false)
                failed = true;
        }
    }
    return failed == false;
}
```

通过以上可以看到明显的缺点只支持monobehavior

若想支持非monobehavior可能需要自己进行处理

## ET的热重载

- 分离项目到不同的dll中

- 通过代码加载dll`System.Reflection.Assembly.Load(assBytes, pdbBytes)`

- 首先进行编译dll

- 按R热加载后,通过反射,对现有的对象进行销毁,然后重新创建

关键代码:

```csharp

public class CodeLoader: IDisposable
{
	public static CodeLoader Instance = new CodeLoader();

	public Action Update;
	public Action LateUpdate;
	public Action OnApplicationQuit;

	private Assembly assembly;

	private ILRuntime.Runtime.Enviorment.AppDomain appDomain;
	
	private Type[] allTypes;
	
	public CodeMode CodeMode { get; set; }

	private CodeLoader()
	{
	}

	public void Dispose()
	{
		this.appDomain?.Dispose();
	}
	
	public void Start()
	{
		switch (this.CodeMode)
		{
			case CodeMode.Mono:
			{
				Dictionary<string, UnityEngine.Object> dictionary = AssetsBundleHelper.LoadBundle("code.unity3d");
				byte[] assBytes = ((TextAsset)dictionary["Code.dll"]).bytes;
				byte[] pdbBytes = ((TextAsset)dictionary["Code.pdb"]).bytes;
				
				assembly = Assembly.Load(assBytes, pdbBytes);
				this.allTypes = assembly.GetTypes();
				IStaticMethod start = new MonoStaticMethod(assembly, "ET.Entry", "Start");
				start.Run();
				break;
			}
			case CodeMode.ILRuntime:
			{
				Dictionary<string, UnityEngine.Object> dictionary = AssetsBundleHelper.LoadBundle("code.unity3d");
				byte[] assBytes = ((TextAsset)dictionary["Code.dll"]).bytes;
				byte[] pdbBytes = ((TextAsset)dictionary["Code.pdb"]).bytes;
				
				//byte[] assBytes = File.ReadAllBytes(Path.Combine("../Unity/", Define.BuildOutputDir, "Code.dll"));
				//byte[] pdbBytes = File.ReadAllBytes(Path.Combine("../Unity/", Define.BuildOutputDir, "Code.pdb"));
			
				appDomain = new ILRuntime.Runtime.Enviorment.AppDomain();
				MemoryStream assStream = new MemoryStream(assBytes);
				MemoryStream pdbStream = new MemoryStream(pdbBytes);
				appDomain.LoadAssembly(assStream, pdbStream, new ILRuntime.Mono.Cecil.Pdb.PdbReaderProvider());

				ILHelper.InitILRuntime(appDomain);

				this.allTypes = appDomain.LoadedTypes.Values.Select(x => x.ReflectionType).ToArray();
				IStaticMethod start = new ILStaticMethod(appDomain, "ET.Entry", "Start", 0);
				start.Run();
				break;
			}
			case CodeMode.Reload:
			{
				byte[] assBytes = File.ReadAllBytes(Path.Combine(Define.BuildOutputDir, "Data.dll"));
				byte[] pdbBytes = File.ReadAllBytes(Path.Combine(Define.BuildOutputDir, "Data.pdb"));
				
				assembly = Assembly.Load(assBytes, pdbBytes);
				this.LoadLogic();
				IStaticMethod start = new MonoStaticMethod(assembly, "ET.Entry", "Start");
				start.Run();
				break;
			}
		}
	}

	// 热重载调用下面三个方法
	// CodeLoader.Instance.LoadLogic();
	// Game.EventSystem.Add(CodeLoader.Instance.GetTypes());
	// Game.EventSystem.Load();
	public void LoadLogic()
	{
		if (this.CodeMode != CodeMode.Reload)
		{
			throw new Exception("CodeMode != Reload!");
		}
		
		// 傻屌Unity在这里搞了个傻逼优化，认为同一个路径的dll，返回的程序集就一样。所以这里每次编译都要随机名字
		string[] logicFiles = Directory.GetFiles(Define.BuildOutputDir, "Logic_*.dll");
		if (logicFiles.Length != 1)
		{
			throw new Exception("Logic dll count != 1");
		}

		string logicName = Path.GetFileNameWithoutExtension(logicFiles[0]);
		byte[] assBytes = File.ReadAllBytes(Path.Combine(Define.BuildOutputDir, $"{logicName}.dll"));
		byte[] pdbBytes = File.ReadAllBytes(Path.Combine(Define.BuildOutputDir, $"{logicName}.pdb"));

		Assembly hotfixAssembly = Assembly.Load(assBytes, pdbBytes);
		
		List<Type> listType = new List<Type>();
		listType.AddRange(this.assembly.GetTypes());
		listType.AddRange(hotfixAssembly.GetTypes());
		this.allTypes = listType.ToArray();
	}

	public Type[] GetTypes()
	{
		return this.allTypes;
	}
}
```

按下f8编译dll

```csharp
public static class BuildAssemblieEditor
{
        [MenuItem("Tools/BuildLogic _F8")]
        public static void BuildLogic()
        {
            string[] logicFiles = Directory.GetFiles(Define.BuildOutputDir, "Logic_*");
            foreach (string file in logicFiles)
            {
                File.Delete(file);
            }
            
            int random = RandomHelper.RandomNumber(100000000, 999999999);
            string logicFile = $"Logic_{random}";
            
            BuildAssemblieEditor.BuildMuteAssembly(logicFile, new []
            {
                "Codes/Hotfix/",
                "Codes/HotfixView/",
            }, new[]{Path.Combine(Define.BuildOutputDir, "Data.dll")}, CodeOptimization.Debug);
        }


	private static void BuildMuteAssembly(string assemblyName, string[] CodeDirectorys, string[] additionalReferences, CodeOptimization codeOptimization)
        {
            List<string> scripts = new List<string>();
            for (int i = 0; i < CodeDirectorys.Length; i++)
            {
                DirectoryInfo dti = new DirectoryInfo(CodeDirectorys[i]);
                FileInfo[] fileInfos = dti.GetFiles("*.cs", System.IO.SearchOption.AllDirectories);
                for (int j = 0; j < fileInfos.Length; j++)
                {
                    scripts.Add(fileInfos[j].FullName);
                }
            }

            string dllPath = Path.Combine(Define.BuildOutputDir, $"{assemblyName}.dll");
            string pdbPath = Path.Combine(Define.BuildOutputDir, $"{assemblyName}.pdb");
            File.Delete(dllPath);
            File.Delete(pdbPath);

            Directory.CreateDirectory(Define.BuildOutputDir);

            AssemblyBuilder assemblyBuilder = new AssemblyBuilder(dllPath, scripts.ToArray());
            
            //启用UnSafe
            //assemblyBuilder.compilerOptions.AllowUnsafeCode = true;

            BuildTargetGroup buildTargetGroup = BuildPipeline.GetBuildTargetGroup(EditorUserBuildSettings.activeBuildTarget);

            assemblyBuilder.compilerOptions.CodeOptimization = codeOptimization;
            assemblyBuilder.compilerOptions.ApiCompatibilityLevel = PlayerSettings.GetApiCompatibilityLevel(buildTargetGroup);
            // assemblyBuilder.compilerOptions.ApiCompatibilityLevel = ApiCompatibilityLevel.NET_4_6;

            assemblyBuilder.additionalReferences = additionalReferences;
            
            assemblyBuilder.flags = AssemblyBuilderFlags.None;
            //AssemblyBuilderFlags.None                 正常发布
            //AssemblyBuilderFlags.DevelopmentBuild     开发模式打包
            //AssemblyBuilderFlags.EditorAssembly       编辑器状态
            assemblyBuilder.referencesOptions = ReferencesOptions.UseEngineModules;

            assemblyBuilder.buildTarget = EditorUserBuildSettings.activeBuildTarget;

            assemblyBuilder.buildTargetGroup = buildTargetGroup;

            assemblyBuilder.buildStarted += delegate(string assemblyPath) { Debug.LogFormat("build start：" + assemblyPath); };

            assemblyBuilder.buildFinished += delegate(string assemblyPath, CompilerMessage[] compilerMessages)
            {
                int errorCount = compilerMessages.Count(m => m.type == CompilerMessageType.Error);
                int warningCount = compilerMessages.Count(m => m.type == CompilerMessageType.Warning);

                Debug.LogFormat("Warnings: {0} - Errors: {1}", warningCount, errorCount);

                if (warningCount > 0)
                {
                    Debug.LogFormat("有{0}个Warning!!!", warningCount);
                }

                if (errorCount > 0)
                {
                    for (int i = 0; i < compilerMessages.Length; i++)
                    {
                        if (compilerMessages[i].type == CompilerMessageType.Error)
                        {
                            Debug.LogError(compilerMessages[i].message);
                        }
                    }
                }
            };
            
            //开始构建
            if (!assemblyBuilder.Build())
            {
                Debug.LogErrorFormat("build fail：" + assemblyBuilder.assemblyPath);
                return;
            }
        }
```

按下R重载

```csharp
    
public static class OperaComponentSystem
{
    public static void Update()
    { 
        if (Input.GetKeyDown(KeyCode.R))
        {
            CodeLoader.Instance.LoadLogic();
            Game.EventSystem.Add(CodeLoader.Instance.GetTypes());
            Game.EventSystem.Load();
            Log.Debug("hot reload success!");
        }
    }
}
```