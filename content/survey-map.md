# 与综述框架的对应

[返回首页](README.md) · [已有 Roadmap](../Survey-Wiki-Prototype-Roadmap-v0.1.md)

## 五项职责与实现机制

网站采用当前 survey 第三章的五项职责及各自三个要点，解释治理系统需要承担什么工作。五项职责在任务运行中持续相互作用，不是固定的先后阶段。模型、工具和执行框架等机制可以共同落实一项职责；每项职责需要的信息、资源与决定权限应明确约定。

Roadmap 保留为早期规划记录；当前章节顺序和职责术语以主稿为准。各[职责页](README.md#按职责阅读)仍围绕一个企业工作任务解释三个要点。案例规则与系统行为是教学设定，不作为现有方法失效的文献证据。

## 当前主稿逐章对应

章节顺序以 [main.tex](../6a6348c0d67adc779bc8bc02/main.tex) 的实际输入为准。当前共六章，源文件名保留了历史编号，因此不能从文件名推断章号。

| 当前章节与本地来源 | 与网站的关系 |
|---|---|
| [第一章 引言](../6a6348c0d67adc779bc8bc02/sections/ch01_introduction.tex) | 提供治理动机、研究范围与相关工作的总体背景 |
| [第二章 治理基础](../6a6348c0d67adc779bc8bc02/sections/ch02_foundations_v2.tex) | 解释系统运行、约束与风险，以及五项职责的总体关系 |
| [第三章 治理生命周期](../6a6348c0d67adc779bc8bc02/sections/ch04_lifecycle.tex) | 直接定义本网站五项职责及其十五项要点，讨论各职责的问题、方法与条件 |
| [第四章 治理机制](../6a6348c0d67adc779bc8bc02/sections/ch03_mechanisms.tex) | 讨论职责如何通过具体控制位置和技术机制实现 |
| [第五章 实践与评估](../6a6348c0d67adc779bc8bc02/sections/ch05_evaluation_benchmark.tex) | 连接应用领域、评价方法与基准；网站另给出面向案例的检查维度 |
| [第六章 开放问题](../6a6348c0d67adc779bc8bc02/sections/ch07_frontiers.tex) | 讨论跨变化、委托与证据边界仍需研究的问题 |

## 第三章的五项职责与十五项要点

以下节名对应[第三章正文](../6a6348c0d67adc779bc8bc02/sections/ch04_lifecycle.tex)。三个要点是职责内部的工作划分，网站沿用一个案例贯穿，不为每个要点另设例子。

| 章节与职责 | 三个要点 | 网站引入所强调的判断 |
|---|---|---|
| 3.1 [任务约定对齐（Mandate Alignment）](goals/01-mandate.md) | 交互协商（Interactive Negotiation）；承诺落实（Commitment Operationalization）；持续维护（Continuous Maintenance） | 确认交付条件与执行边界，将承诺连接到检查、控制和复核责任，并在变化后保持有效 |
| 3.2 [执行监督（Execution Oversight）](goals/02-oversight.md) | 风险监测（Risk Monitoring）；监督干预（Supervisory Intervention）；结果核验（Outcome Verification） | 发现风险与未知，决定放行、限制、暂停或升级，并核验行动、干预和修复的实际效果 |
| 3.3 [故障处置（Fault Resolution）](goals/03-troubleshooting.md) | 失败归因（Failure Attribution）；运行修正（Operational Remediation）；状态修复（State Restoration） | 解释失败的促成条件，修正运行方法，修复已受影响的状态并暴露未解决后果 |
| 3.4 [多智能体协调（Multi-Agent Coordination）](goals/04-coordination.md) | 子任务分配（Sub-Task Allocation）；依赖管理（Dependency Management）；一致性维护（Consistency Maintenance） | 持续明确谁跟进、何时可推进，以及各方使用的状态和产出能否共同成立 |
| 3.5 [可审计性保障（Auditability Assurance）](goals/05-accountability.md) | 执行重建（Execution Reconstruction）；责任归属（Responsibility Attribution）；合规评估（Compliance Assessment） | 依据记录重建经过、追溯行动背后的授权与职责，并对照适用要求形成可复查的结论 |

第三章 3.6 Lifecycle Synthesis 汇总职责间的反馈，不是第六项职责。例如，修复可能改变先前核验的依据，监督发现也可能促使有权主体修订任务约定。

## 稿件论述与网站教学设定

五项职责和十五项要点来自主稿。网站说明、企业任务情境、金额、工具安排和建议指标用于引导理解，不等同于论文中的实验结果。一个例子可以说明某项判断为何必要，不能单独证明固定程序、模型或现有研究都无法完成它。

已经明确的阈值、依赖、权限与日志关系，可以由现有工程机制处理。案例应说明仍需识别的语义关系、适用条件或证据缺口，并交代判断如何落实到实际控制与复核。研究结论还需回到对应文献，核对实现条件与评价范围。

## 原始文献核查入口

正式将网站解释作为文献结论使用前，应沿第三章相应小节检查其引用与论证。下表是核查问题，不是已独立验证的保证清单。

| 核查入口 | 需要核对的问题 |
|---|---|
| 3.1 Commitment Operationalization | 从自然语言约定到约束与控制时，是否保留了原要求，哪些条件仍需明确复核？ |
| 3.2 Supervisory Intervention / Outcome Verification | 控制点是否可达、干预是否及时，核验支持的是局部结果还是整体完成？ |
| 3.3 Failure Attribution / State Restoration | 归因能排除哪些其他解释，修复覆盖哪些状态和外部效果，哪些影响仍未解决？ |
| 3.4 Dependency Management / Consistency Maintenance | 依赖是否充分识别，参与者实际采用了什么版本，消息送达是否足以证明更新生效？ |
| 3.5 Responsibility Attribution / Compliance Assessment | 行动与委托、审批和规则版本是否关联，缺失证据如何限制责任与合规结论？ |

引用元数据位于 [references.bib](../6a6348c0d67adc779bc8bc02/references.bib) 与 [new_refs.bib](../6a6348c0d67adc779bc8bc02/new_refs.bib)。核查需要原文定位、成立条件和结果范围，不能只根据稿件中的方法名称作结论。

## 后续编辑与验证

后续可按[读者问题](review.md)检查解释，再按选定职责补充原始文献和真实案例。若实现演示，应另存场景规格、方法可见记录、独立评价与结果；教学故事本身不替代实验。
