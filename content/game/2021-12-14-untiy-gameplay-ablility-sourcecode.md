---
title : "unity gameplay ability源代码解析"
---

github仓库 : <https://github.com/sjai013/unity-gameplay-ability-system>

这是一个开源系统主要包含了以下内容

- Attribute System  属性系统.

- Gameplay Tags  tag用来判断技能是否能够释放,以及检查effect是否能够添加

- Gameplay Effects  技能特效

- Ability 技能

## 特效

GameplayEffectSpec 是特效的runtime

- 包含了特效的双方和target

- 包含了其他数据等级,持续时间等

创建方法

- `AbilitySystemCharacter.MakeOutgoingSpec`

- `GameplayEffectSpec.CreateNew`

### 添加特效到角色

```csharp
public bool ApplyGameplayEffectSpecToSelf(GameplayEffectSpec geSpec)
{
        if (geSpec == null) return true;
        //检查特效是否能被应用到角色身上,比如如果是无敌状态则不能添加
        bool tagRequirementsOK = CheckTagRequirementsMet(geSpec);

        if (tagRequirementsOK == false) return false;


        switch (geSpec.GameplayEffect.gameplayEffect.DurationPolicy)
        {
            case EDurationPolicy.HasDuration:
            case EDurationPolicy.Infinite:
                    //周期性的特效
                    ApplyDurationalGameplayEffect(geSpec);
                    break;
            case EDurationPolicy.Instant:
                    //可以立即应用的特效
                    ApplyInstantGameplayEffect(geSpec);
                    return true;
        }

        return true;
}
```

检查特效tag是否能够添加到角色身上

```csharp
//建立当前角色的所有特效的GrantedTags
var appliedTags = new List<GameplayTagScriptableObject>();
for (var i = 0; i < AppliedGameplayEffects.Count; i++)
{
    appliedTags.AddRange(AppliedGameplayEffects[i].spec.GameplayEffect.gameplayEffectTags.GrantedTags);
}

//检查特效上的ApplicationTagRequirements的RequireTags字段
for (var i = 0; i < geSpec.GameplayEffect.gameplayEffectTags.ApplicationTagRequirements.RequireTags.Length; i++)
{
    if (!appliedTags.Contains(geSpec.GameplayEffect.gameplayEffectTags.ApplicationTagRequirements.RequireTags[i]))
    {
            return false;
    }
}

//检查特效上的ApplicationTagRequirements的IgnoreTags字段
for (var i = 0; i < geSpec.GameplayEffect.gameplayEffectTags.ApplicationTagRequirements.IgnoreTags.Length; i++)
{
    if (appliedTags.Contains(geSpec.GameplayEffect.gameplayEffectTags.ApplicationTagRequirements.IgnoreTags[i]))
    {
            return false;
    }
}

return true;
```

### 特效`GameplayEffectScriptableObject`本身

- GameplayEffectDefinitionContainer  定义了特效的使用效果与条件

  - DurationPolicy和DurationModifier和DurationMultiplier构成了该特效的持续时间,以及是否立即使用`DurationModifier.CalculateMagnitude(this).GetValueOrDefault() *.DurationMultiplier`

  - Modifiers 该特效对属性的修改

  - ConditionalGameplayEffects  暂时没看到使用的地方??

```csharp
   public struct GameplayEffectDefinitionContainer
    {
        /// <summary>
        /// 持续方案,,是立即,还是持续
        /// </summary>
        public EDurationPolicy DurationPolicy;
	//修改策略
        public ModifierMagnitudeScriptableObject DurationModifier;

        /// <summary>
        /// 该特效的持续时间，如果特效有一个有限的持续时间的话
        /// </summary>
        public float DurationMultiplier;


        /// <summary>
        /// 该特效对属性的修改
        /// </summary>
        public GameplayEffectModifier[] Modifiers;

        /// <summary>
        /// Other GE to apply to the source ability system, based on presence of tags on source
        /// </summary>
        public ConditionalGameplayEffectContainer[] ConditionalGameplayEffects;
    }
```

- GameplayEffectTags   定义处理特效之间的关系

```csharp
   public struct GameplayEffectTags
   {
        /// <summary>
        /// 授予角色拥有的特殊tag,比如:无敌,隐身,诅咒
        /// 
        /// 比如a技能,给敌人添加了一个诅咒(tagA)
        /// 第二个技能依据是否有这个诅咒这个前置特效,有的话才能应用技能特效,则设置ApplicationTagRequirements.RequireTags中添加taga
        /// 
        /// 
        /// 比如配置怪物免疫火系魔法
        /// 则添加一个免疫火系魔法的tagb
        /// 火系技能则在ApplicationTagRequirements中的IgnoreTags添加一个tagb
        /// 
        /// 
        /// </summary>
       [SerializeField] public GameplayTagScriptableObject[] GrantedTags;


        /// <summary>
        /// effect添加到人身上前,需要检查的条件
        /// </summary>
       [SerializeField] public GameplayTagRequireIgnoreContainer ApplicationTagRequirements;

   }
```

## 技能

AbstractAbilitySpec是技能的runtime,包含了

- ability的scriptobject

- ability的其他数据例如等级,词条等

- 角色字段

### 技能释放流程

```csharp
public virtual IEnumerator TryActivateAbility()
{
   //检查该能力是否能被激活
   //1. 检查gameplaytags
   //2. 检查cost
   //3. 检查cooldown
   if (!CanActivateAbility()) yield break;

   isActive = true;
   //激活能力前处理
   yield return PreActivate();
   //激活这个能力
   yield return ActivateAbility();
   //能力结束
   EndAbility();

}
```

ability的cost和cooldown都使用了GameplayEffectScriptableObject,这也是这个系统比较蛋疼的地方,就是每个ability都需要建立cost和cooldown的object.

### 检查cost

- 检查cost特效身上的Modifiers字段,并计算最终值

- 然后和角色属性进行对比

- Modifiers可以有多条,且有计算公式

```csharp
public virtual bool CheckCost()
{
        if (this.Ability.Cost == null) return true;
        var geSpec = this.Owner.MakeOutgoingSpec(this.Ability.Cost, this.Level);
        // If this isn't an instant cost, then assume it passes cooldown check
        if (geSpec.GameplayEffect.gameplayEffect.DurationPolicy != EDurationPolicy.Instant) return true;
	
	//Modifiers可以包含多条,可以是属性会根据特效本身的等级做改变
        for (var i = 0; i < geSpec.GameplayEffect.gameplayEffect.Modifiers.Length; i++)
        {
            var modifier = geSpec.GameplayEffect.gameplayEffect.Modifiers[i];
    
            // Only worry about additive.  Anything else passes.
            if (modifier.ModifierOperator != EAttributeModifier.Add) continue;
            var costValue = (modifier.ModifierMagnitude.CalculateMagnitude(geSpec) * modifier.Multiplier).GetValueOrDefault();
    		
	    //获取角色身上该属性的值
            this.Owner.AttributeSystem.GetAttributeValue(modifier.Attribute, out var attributeValue);
    		
            // 如果属性值+消耗的值小于0则代表技能失败
            if (attributeValue.CurrentValue + costValue < 0) return false;

        }
        return true;
}
```

### 检查cooldow

- 冷却时间特效最终会被添加到人物的身上

- 该函数,主要是比对并找到人身上同tag的特效.然后检查该特效的TotalDuration

```csharp
public virtual AbilityCooldownTime CheckCooldown()
{
        float maxDuration = 0;
        if (this.Ability.Cooldown == null) return new AbilityCooldownTime();
        var cooldownTags = this.Ability.Cooldown.gameplayEffectTags.GrantedTags;

        float longestCooldown = 0f;

        // Check if the cooldown tag is granted to the player, and if so, capture the remaining duration for that tag
        for (var i = 0; i < this.Owner.AppliedGameplayEffects.Count; i++)
        {
            var grantedTags = this.Owner.AppliedGameplayEffects[i].spec.GameplayEffect.gameplayEffectTags.GrantedTags;
            for (var iTag = 0; iTag < grantedTags.Length; iTag++)
            {
                    for (var iCooldownTag = 0; iCooldownTag < cooldownTags.Length; iCooldownTag++)
                    {
                        if (grantedTags[iTag] == cooldownTags[iCooldownTag])
                        {
                                // 如果有一个策略是无限的..则返回一个float.maxvalue
                                if (this.Owner.AppliedGameplayEffects[i].spec.GameplayEffect.gameplayEffect.DurationPolicy == EDurationPolicy.Infinite) return new AbilityCooldownTime()
                                {
                                    TimeRemaining = float.MaxValue,
                                    TotalDuration = 0
                                };
        
                                var durationRemaining = this.Owner.AppliedGameplayEffects[i].spec.DurationRemaining;
        
                                if (durationRemaining > longestCooldown)
                                {
                                    longestCooldown = durationRemaining;
                                    maxDuration = this.Owner.AppliedGameplayEffects[i].spec.TotalDuration;
                                }
                        }
    
                    }
            }
        }

        return new AbilityCooldownTime()
        {
            TimeRemaining = longestCooldown,
            TotalDuration = maxDuration
        };
}
```

### 检查abilitytags

#### abilitytags

定义了一些tag用来释放前进行检查是否能释放该技能

- 例如检查自身是否能够匹配`OwnerTags`

- 如果是指定目标则检查目标身上是否能够匹配`TargetTags`

- SourceTags?暂时没有好的理解

```csharp
[Serializable]
public struct AbilityTags
{
    /// <summary>
    /// This tag describes the Gameplay Ability
    /// </summary>
    [SerializeField] public GameplayTagScriptableObject AssetTag;

    /// <summary>
    /// This ability can only be activated if the owner character has all of the Required tags
    /// and none of the Ignore tags.  Usually, the owner is the source as well.
    /// </summary>
    [SerializeField] public GameplayTagRequireIgnoreContainer OwnerTags;

    /// <summary>
    /// This ability can only be activated if the source character has all of the Required tags
    /// and none of the Ignore tags
    /// </summary>
    [SerializeField] public GameplayTagRequireIgnoreContainer SourceTags;

    /// <summary>
    /// This ability can only be activated if the target character has all of the Required tags
    /// and none of the Ignore tags
    /// </summary>
    [SerializeField] public GameplayTagRequireIgnoreContainer TargetTags;

}
```

#### CheckGameplayTags()被定义在每个ability下然后对其重写

- AscHasAllTags  用来检查`RequireTags` ,检查人身上特效的tags是否包含这些,如果没有包含则检查失败

- AscHasNoneTags 用来检查`IgnoreTags` ,检查人身上特效的tags是否包含这些,如果包含则检查失败

```csharp
public override bool CheckGameplayTags()
{
        return AscHasAllTags(Owner, this.Ability.AbilityTags.OwnerTags.RequireTags)
                && AscHasNoneTags(Owner, this.Ability.AbilityTags.OwnerTags.IgnoreTags)
                && AscHasAllTags(Owner, this.Ability.AbilityTags.SourceTags.RequireTags)
                && AscHasNoneTags(Owner, this.Ability.AbilityTags.SourceTags.IgnoreTags)
                && AscHasAllTags(Target, this.Ability.AbilityTags.TargetTags.RequireTags)
                && AscHasNoneTags(Target, this.Ability.AbilityTags.TargetTags.IgnoreTags);
}

protected virtual bool AscHasAllTags(AbilitySystemCharacter asc, GameplayTagScriptableObject[] tags)
{
    // If the input ASC is not valid, assume check passed
    if (!asc) return true;

    for (var iAbilityTag = 0; iAbilityTag < tags.Length; iAbilityTag++)
    {
        var abilityTag = tags[iAbilityTag];

        bool requirementPassed = false;
        for (var iAsc = 0; iAsc < asc.AppliedGameplayEffects.Count; iAsc++)
        {
            GameplayTagScriptableObject[] ascGrantedTags = asc.AppliedGameplayEffects[iAsc].spec.GameplayEffect.gameplayEffectTags.GrantedTags;
            for (var iAscTag = 0; iAscTag < ascGrantedTags.Length; iAscTag++)
            {
                if (ascGrantedTags[iAscTag] == abilityTag)
                {
                    requirementPassed = true;
                }
            }
        }
        // If any ability tag wasn't found, requirements failed
        if (!requirementPassed) return false;
    }
    return true;
}

protected virtual bool AscHasNoneTags(AbilitySystemCharacter asc, GameplayTagScriptableObject[] tags)
{
    // If the input ASC is not valid, assume check passed
    if (!asc) return true;

    for (var iAbilityTag = 0; iAbilityTag < tags.Length; iAbilityTag++)
    {
        var abilityTag = tags[iAbilityTag];

        bool requirementPassed = true;
        for (var iAsc = 0; iAsc < asc.AppliedGameplayEffects.Count; iAsc++)
        {
            GameplayTagScriptableObject[] ascGrantedTags = asc.AppliedGameplayEffects[iAsc].spec.GameplayEffect.gameplayEffectTags.GrantedTags;
            for (var iAscTag = 0; iAscTag < ascGrantedTags.Length; iAscTag++)
            {
                if (ascGrantedTags[iAscTag] == abilityTag)
                {
                    requirementPassed = false;
                }
            }
        }
        // If any ability tag wasn't found, requirements failed
        if (!requirementPassed) return false;
    }
    return true;
}
```