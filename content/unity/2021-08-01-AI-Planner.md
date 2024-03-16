---
title : "AI-PLANNER使用"
---

## 定义实体和组件

- SemanticObject  为gameobject添加各种component

- Traits : 相当于component.可以定义各种属性

## 定义处理系统

- Problem  依托 DecisionController运行计划

- StateTermination  为Problem  提供中止条件

- SemanticQuery   根据query为 DecisionController提供实体

- Action : 相当于一个特殊的system的基类.他定义了参数,和处理条件.以及effects和reward,但是没有实现具体的方法(executionInfo),executionInfo是需要手动定义的

  ```
      public abstract class PlannerActionSystem : SystemBase
      {
  
          List<ParameterDefinition> m_Parameters = new List<ParameterDefinition>();
  
  
          List<Operation> m_Preconditions = new List<Operation>();
  
  
  
          List<ParameterDefinition> m_CreatedObjects = new List<ParameterDefinition>();
  
  
          List<string> m_RemovedObjects = new List<string>();
  
  
          List<Operation> m_ObjectModifiers = new List<Operation>();
  
  
          float m_Reward;
  
          List<CustomRewardData> m_CustomRewards;
  
  
          Unity.AI.Planner.Controller.ActionExecutionInfo executionInfo;
  
  
          protected override void OnUpdate()
          {
              //检查条件
  
              //将参数传给executionInfo
  
  			//然后执行方法
  			
  			
  			//处理effect.对object进行修改,创建,删除
  			
  			//然后处理reward
  			
          }
  
      }
  ```

***

## actions

- motives  相当于 preconditions   ..需要一些设定才会执行这个

- Requirements   也可以使用preconditions代替   ,

## domain

维护了一个entities列表,当entity触发了OnTriggerEnter事件会增加到这个列表中.

aiplanner倒是不需要这个..他们是通过entity和component进行目标查找的