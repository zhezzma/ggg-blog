---
title : Editor Iteration Profiler的使用
---

## 一些记录

- 关闭netcode的代码生成`Multiplayer->Code Generation Windown `

- 关闭burst的编译,命令行添加参数`--burst-disable-compilation` ,[查看](https://docs.unity3d.com/Packages/com.unity.burst@1.6/manual/docs/QuickStart.html)

- `Plugins\TranslucentImage\Script\Editor\ScenceGizmoAutoDisable.cs` 删除特性`UnityEditor.Callbacks.DidReloadScripts`

- Unity 重新生成 [TypeCache](https://docs.unity3d.com/ScriptReference/TypeCache.html)。这大约需要 4000毫秒，具体取决于程序集中的类型数量。所以避免使用过多无用的插件.减少类型数量

## 参考链接

- [Fast Domain Reloads in Unity — John Austin](https://johnaustin.io/articles/2020/domain-reloads-in-unity)

- [Unity - Improving iteration time on C# script changes - Unity Forum](https://forum.unity.com/threads/improving-iteration-time-on-c-script-changes.1184446/)