---
title : "unity商店下载资源迁移"
---

## 包缓存太大

每次运行Unity都会发现自己的C盘空间在急剧缩小，查了一下发现是C:\\Users\\Username\\AppData\\Local\\Unity\\cache这个文件夹特别大，它主要是存储一些Unity常用的packages，默认都是存在C盘下。
为了拯救C盘空间，可以通过设置环境变量的方式解决，具体请参考[Global Cache](https://docs.unity3d.com/Manual/upm-cache.html?_ga=2.102441737.940588655.1611571898-92384475.1591107641)，或[Configure Unity Package Manager global cache location](https://forum.unity.com/threads/configure-unity-package-manager-global-cache-location.650245/)。

添加环境变量

```
[environment]::setEnvironmentVariable('UPM_CACHE_ROOT','D:\Users\zhepama\AppData\Unity\Caches','User')
```

## 商店资源太大

使用cmd,注意powershell是不支持mklink的

```
 mklink /J "C:\Users\zhepama\AppData\Roaming\Unity\Asset Store-5.x" "E:\Asset\Asset Store-5.x"
```

<https://forum.unity.com/threads/asset-store-download-folder.83620/page-2>

[Customizing the shared cache locations - Unity 手册](https://docs.unity.cn/cn/2021.3/Manual/upm-config-cache.html)