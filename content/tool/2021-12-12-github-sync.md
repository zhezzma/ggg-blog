---
title : "github 怎么合并原始分支？ "
---

## 复刻仓库

-   On GitHub.com, navigate to the [octocat/Spoon-Knife](https://github.com/octocat/Spoon-Knife) repository.

-   在页面的右上角，单击 **Fork（复刻）**。

![](../../public/images/2021-12-12-github-sync/2021-11-30-04-25-59.jpg)

```
$ git clone https://github.com/YOUR-USERNAME/Spoon-Knife
> Cloning into `Spoon-Knife`...
> remote: Counting objects: 10, done.
> remote: Compressing objects: 100% (8/8), done.
> remove: Total 10 (delta 1), reused 10 (delta 1)
> Unpacking objects: 100% (10/10), done.

```

## 增加复刻的仓库作为上游远程仓库

```
$ git remote add upstream https://github.com/octocat/Spoon-Knife.git


$ git remote -v
> origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
> origin    https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
> upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (fetch)
> upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (push)
```

后续就可以进行合并操作了

-   <https://docs.github.com/cn/get-started/quickstart/fork-a-repo>
