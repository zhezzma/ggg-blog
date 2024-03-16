---
title : "c#在重写object中的Equal方法时需要对GetHashCode进行重写（Dictionary引用）"
---

先看一个不负责任的写法

```
//先看一个不负责任的写法
using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
 
 
namespace nothing
{
    class MyMethod
    {
        //用a值代替Hash值
        public int a { get; set; }
         public override int GetHashCode()
        {
            return a;
        }
        public override bool Equals(object obj)
        {
            return true;
        }
 
    }
    class Program
    {
            
        static void Sum<T>() where T : MyMethod, new()
        {
            T t1 = new T();
            T t2 = new T();
             
            t1.a = 3; t2.a = 4;//不会报错           
             //t1.a=3;t2.a=3;报错，字典中已经存在相同键
             Dictionary<MyMethod, int> d = new Dictionary<MyMethod, int>();
            d.Add(t1, 1);
            d.Add(t2, 2);
            
            
        }
        static void Main(string[] args)
        {
            
            Sum<MyMethod>();
            Console.Read();
 
        }
       
    }
 
}
 
```

再说Dictionary的Add的具体实现,ILSpy反编译中C#Dictionary的Add方法源码：

```
public void Add(TKey key, TValue value)
{
    this.Insert(key, value, true);
}
 
 
private void Insert(TKey key, TValue value, bool add)
{
    if (key == null)
    {
        ThrowHelper.ThrowArgumentNullException(ExceptionArgument.key);
    }
    if (this.buckets == null)
    {
        this.Initialize(0);
    }
    
    int num = this.comparer.GetHashCode(key) & 2147483647;
    int num2 = num % this.buckets.Length;
    int num3 = 0;
    for (int i = this.buckets[num2]; i >= 0; i = this.entries[i].next)
    {
        //如果hash值和字典中某个值的hash值相等 且 两个值的Equals返回值为True Trow 异常：已添加了具有相同键的项。
        if (this.entries[i].hashCode == num && this.comparer.Equals(this.entries[i].key, key))
        {
            if (add)
            {
                ThrowHelper.ThrowArgumentException(ExceptionResource.Argument_AddingDuplicate);
            }
            this.entries[i].value = value;
            this.version++;
            return;
        }
        num3++;
    }
    int num4;
    if (this.freeCount > 0)
    {
        num4 = this.freeList;
        this.freeList = this.entries[num4].next;
        this.freeCount--;
    }
    else
    {
        if (this.count == this.entries.Length)
        {
            this.Resize();
            num2 = num % this.buckets.Length;
        }
        num4 = this.count;
        this.count++;
    }
    this.entries[num4].hashCode = num;
    this.entries[num4].next = this.buckets[num2];
    this.entries[num4].key = key;
    this.entries[num4].value = value;
    this.buckets[num2] = num4;
    this.version++;
    if (num3 > 100 && HashHelpers.IsWellKnownEqualityComparer(this.comparer))
    {
        this.comparer = (IEqualityComparer<TKey>)HashHelpers.GetRandomizedEqualityComparer(this.comparer);
        this.Resize(this.entries.Length, true);
    }
}
```

当每次调用Dictionary的Add方法时，参数都将与Dictionary中的值进行Equals，大家都知道DIctionary是用Hash值进行存储的，而hash值的计算方法是通过Object.GetHashCode实现的，如果这2个方法不一致，那么很容易就出现问题，特别是Dictionary中的Add方法这种情况。

个人理解Dictionary的Add方法的实现：

Add()->GetHashCode(),Equals()->判断2个hashcode是否相等 和Equals返回值是否为True->若同时成立，抛异常。

GetHashCode的目的不是为一个对象生成唯一的标识符，而是为了实现基于哈希表的数据结构，如Dictionary<K, V>或HashSet。 哈希函数需要确保如果x == ==y，那么x.GetHashCode()==  y.GetHashCode()，但反过来就不对了：两个不同的对象可以有相同的哈希代码。这种情况被称为哈希碰撞。 如果存在碰撞，哈希表结构仍然可以工作，但它们的运行速度较慢，因为你的程序必须花时间来分辨你要搜索的是哪个碰撞对象。因此，一个好的散列函数将努力使碰撞最小化。(注意，如果一个类有232个以上的可能值，要完全避免碰撞在数学上是不可能的，因为有鸽子笼原则）。

那么，你如何为你的类写一个好的GetHashCode实现呢？

做一些复杂的数学运算，将你的类的每一个字段转换为int，然后通过剖析来确定其中的系数的最佳值？

根据Troelsen的说法，不需要。

只要在你的 "最独特 "的字符串字段上调用GetHashCode()就可以了。

写System.String.GetHashCode的开发者知道他们在做什么，所以只要使用它，你就会自动利用他们的 "坚实的哈希码算法"。