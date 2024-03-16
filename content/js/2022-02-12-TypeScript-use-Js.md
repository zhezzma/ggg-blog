---
title : "如何在TypeScript中使用JS类库"

---

## **使用流程**



1. 首先要清楚类库是什么类型，不同的类库有不同的使用方式

2. 寻找声明文件

JS类库一般有三类：全局类库、模块类库、UMD库。例如，jQuery是一种UMD库，既可以通过全局方式来引用，也可以模块化引用。

### **声明文件**

当我们要使用一个类库时，需要ts声明文件，对外暴露API，有时候声明文件在源码中，大部分是单独提供额外安装。比如jQuery需要额外安装类型声明包。

幸运的是，大部分的类库，TS社区都有声明文件。名称为@types/类库名，需要去这个网站搜一下[http://](https://microsoft.github.io/TypeSearch/)[microsoft.github.io/TypeSearch/](http://microsoft.github.io/TypeSearch/)

如果没有，需要自己去写一个，这也是为社区贡献的好机会。<http://definitelytyped.org/guides/contributing.html>这里提供了一些写声明文件的方法。在写ts声明文件的时候，暂时用不到的API可以可以不写。>

下面我将演示，如何在ts文件中使用三种类库。首先准备三个js文件，分别表示全局类库、模块类库、UMD库。

```
// 全局类库  global-lib.js
function globalLib(options) {
   console.log(options);
}
globalLib.version = "1.0.0";
globalLib.doSomething = function () {
   console.log('globalLib do something');
};

// 模块类库  module-lib.js
const version = "1.0.0";
function doSomething() {
   console.log('moduleLib do something');
}
function moduleLib(options) {
   console.log(options);
}
moduleLib.version = version;
moduleLib.doSomething = doSomething;
module.exports = moduleLib;

// UMD库  umd-lib.js
(function (root, factory) {
   if(typeof define === "function" && define.amd)
   {
      define(factory);
   }else if(typeof module === "object" && module.exports)
   {
      module.exports = factory();
   }else
   {
      root.umdLib = factory();
   }
})(this, function () {
   return {
      version: "1.0.2",
      doSomething() {
         console.log('umdLib do something');
      }
   }
});
```

## **全局类库**

1. 在HTML文件标签中引入该库

2. 将写好的声明文件与js库放在同一文件夹下，命名相同，后缀名为.d.ts

3. 此时可以在ts文件中使用全局API

如果此时编译器未报错，而浏览器报错not defined，可能是html中引入的路径是相对路径，改成绝对路径即可（以项目目录为根目录）。

声明文件global-lib.d.ts

```
declare function globalLib(options: globalLib.Options): void;
declare namespace globalLib{
   const version: string;
   function doSomething(): void;
   interface Options {
      [key: string]: any,
   }
}
```

在ts文件中使用该库：

```
globalLib({x:1});
globalLib.doSomething();
```

## **模块类库**

1. 将声明文件放在相同的目录下

2. 在ts中引入

声明文件 module-lib.d.ts

```
declare function moduleLib(options: Options): void;
interface Options {
   [key: string]: any,
}
declare namespace moduleLib{
   const version: string;
   function doSomething(): void;
}
export = moduleLib; // 这样写兼容性更好
```

ts中使用类库

```
import moduleLib from './Libs/module-lib.js';
moduleLib.doSomething();
```

## **UMD类库**

UMD库有两种使用方式：

- 引入全局类库的方式

- 模块类库引入的方式

其中，在使用全局类库的引入方式时，编译器会提示，不建议这样做，需要在tsconfig.json中打开allUmdGlobalAccess配置项可以消除提示。

声明文件 umd-lib.d.ts

```
declare namespace umdLib {
   const version: string;
   function doSomething(): void;
}
export as namespace umdLib // 专门为umd库准备的语句，不可缺少
export = umdLib
```

ts中使用UMD库（不再演示全局使用方式）

```
import umdLib from './Libs/umd-lib'
umdLib.doSomething();
console.log(umdLib.version);
```

例：在ts中使用jQuery（不演示全局引入方式）

先安装jquery及其声明文件

```
npm install -D jquery @types/jquery
```

使用：

```
import $ from 'jquery';
$(".app").css("color","red");
```

## **为类库添加插件**

即为类库添加自定义的方法

其中UMD库和模块类库的添加插件方法一致。

```
// 为全局类库增添自定义方法
declare global {
   namespace globalLib {
      function myFunction(): void
   }
}
globalLib.myFunction = () =>{console.log("global插件")};

// 为模块类库添加自定义方法
declare module "./Libs/module-lib.js"{
   export function myFunction(): void;
} // 为module-lib类库声明myFunction方法
moduleLib.myFunction = () => {console.log("module插件")}; // 定义自定义方法

// 为UMD库添加自定义方法
declare module "./Libs/umd-lib.js"{
   export function myFunction(): void;
} // 为umd-lib类库声明myFunction方法
umdLib.myFunction = () => {console.log("umd插件")}; // 定义自定义方法

globalLib.myFunction();
moduleLib.myFunction();
umdLib.myFunction();
```

例如，为类库moment增添自定义方法（jQuery不可以，需要使用官方提供的API）

```
npm install -D moment @types/moment

import m from 'moment';
declare module 'moment'{
   export function myFunction(): void;
}
m.myFunction = () => {console.log("moment插件")};

m.myFunction();
```