# Mapping to the Survey

[Back to home](README.md) · [Existing Roadmap](../../Survey-Wiki-Prototype-Roadmap-v0.1.md)

## Five responsibilities and their implementation

The website adopts the five responsibilities and their three aspects from Chapter 3 of the current survey to explain the work a governance system must undertake. The responsibilities interact throughout task execution rather than forming fixed successive stages. Mechanisms in models, tools, and harnesses can jointly implement a responsibility; the information, resources, and decision rights it requires must be specified.

The Roadmap is retained as an early planning record. The main draft determines the current chapter order and responsibility terminology. Each [responsibility page](README.md#read-by-responsibility) still explains its three aspects through one enterprise task. Case rules and system behaviors are teaching assumptions, not literature evidence that existing methods fail.

## Mapping to the current chapters

Chapter order follows the actual inputs in [main.tex](../../6a6348c0d67adc779bc8bc02/main.tex). There are currently six chapters. Source filenames retain historical numbering and therefore do not indicate the current chapter number.

| Current chapter and local source | Relationship to the website |
|---|---|
| [Chapter 1: Introduction](../../6a6348c0d67adc779bc8bc02/sections/ch01_introduction.tex) | Provides the overall background for governance motivation, research scope, and related work |
| [Chapter 2: Governance Foundations](../../6a6348c0d67adc779bc8bc02/sections/ch02_foundations_v2.tex) | Explains system execution, constraints and risks, and the overall relationship among the five responsibilities |
| [Chapter 3: The Governance Lifecycle](../../6a6348c0d67adc779bc8bc02/sections/ch04_lifecycle.tex) | Directly defines the website's five responsibilities and their fifteen aspects, discussing each responsibility's problems, methods, and conditions |
| [Chapter 4: Governance Mechanisms](../../6a6348c0d67adc779bc8bc02/sections/ch03_mechanisms.tex) | Discusses how responsibilities are implemented through specific control points and technical mechanisms |
| [Chapter 5: Practice and Evaluation](../../6a6348c0d67adc779bc8bc02/sections/ch05_evaluation_benchmark.tex) | Connects application domains, evaluation methods, and benchmarks; the website separately suggests checks grounded in its cases |
| [Chapter 6: Open Problems](../../6a6348c0d67adc779bc8bc02/sections/ch07_frontiers.tex) | Discusses questions that remain open across changes, delegation, and evidence boundaries |

## Chapter 3: five responsibilities and fifteen aspects

The section names below correspond to the [Chapter 3 text](../../6a6348c0d67adc779bc8bc02/sections/ch04_lifecycle.tex). The three aspects divide the work within a responsibility. The website uses one continuing case rather than a separate example for each aspect.

| Section and responsibility | Three aspects | Judgments emphasized in the website introduction |
|---|---|---|
| 3.1 [Mandate Alignment](goals/01-mandate.md) | Interactive Negotiation; Commitment Operationalization; Continuous Maintenance | Confirm delivery conditions and execution boundaries, connect commitments to checks, controls, and review duties, and preserve validity through change |
| 3.2 [Execution Oversight](goals/02-oversight.md) | Risk Monitoring; Supervisory Intervention; Outcome Verification | Identify risks and unknowns, decide whether to allow, restrict, pause, or escalate activity, and verify the actual effects of actions, interventions, and repairs |
| 3.3 [Fault Resolution](goals/03-troubleshooting.md) | Failure Attribution; Operational Remediation; State Restoration | Explain contributing conditions, correct execution methods, restore affected state, and expose unresolved consequences |
| 3.4 [Multi-Agent Coordination](goals/04-coordination.md) | Sub-Task Allocation; Dependency Management; Consistency Maintenance | Maintain clarity about who follows up, when work may proceed, and whether the states and outputs used by participants can hold together |
| 3.5 [Auditability Assurance](goals/05-accountability.md) | Execution Reconstruction; Responsibility Attribution; Compliance Assessment | Reconstruct events from records, trace the authority and duties behind actions, and form reviewable conclusions against applicable requirements |

Section 3.6, Lifecycle Synthesis, brings together feedback among the responsibilities; it is not a sixth responsibility. For example, a repair may change the basis of an earlier verification, while an oversight finding may prompt an authorized party to revise the mandate.

## Survey arguments and teaching assumptions

The five responsibilities and fifteen aspects come from the main draft. The website's explanations, enterprise scenarios, amounts, tool arrangements, and suggested metrics support understanding; they are not experimental results from papers. A case can explain why a judgment is necessary, but it cannot alone show that fixed programs, models, or existing research cannot perform it.

Existing engineering mechanisms can handle specified thresholds, dependencies, permissions, and log relationships. Cases should identify the semantic relationships, applicability conditions, or evidence gaps that still need to be resolved, and explain how judgments lead to actual controls and review. Research conclusions still require consulting the corresponding literature to check implementation conditions and evaluation scope.

## Entry points for checking original sources

Before formally using an explanation from the website as a literature-backed conclusion, inspect the references and arguments in the relevant Chapter 3 subsection. The table gives questions to investigate, not a list of independently verified guarantees.

| Entry point | Questions to check |
|---|---|
| 3.1 Commitment Operationalization | Are the original requirements preserved when a natural-language mandate becomes constraints and controls? Which conditions still require explicit review? |
| 3.2 Supervisory Intervention / Outcome Verification | Are control points reachable and interventions timely? Does verification support a local result or overall completion? |
| 3.3 Failure Attribution / State Restoration | Which alternative explanations does attribution rule out? Which states and external effects are restored, and which effects remain unresolved? |
| 3.4 Dependency Management / Consistency Maintenance | Have dependencies been identified sufficiently? Which versions did participants actually use? Does message delivery establish that an update took effect? |
| 3.5 Responsibility Attribution / Compliance Assessment | Are actions linked to delegation, approval, and rule versions? How does missing evidence limit conclusions about responsibility and compliance? |

Reference metadata is stored in [references.bib](../../6a6348c0d67adc779bc8bc02/references.bib) and [new_refs.bib](../../6a6348c0d67adc779bc8bc02/new_refs.bib). Verification requires locating the original passages and checking conditions and result scope; method names in the draft alone are not enough to establish a conclusion.

## Further editing and validation

Future work can use the [reader questions](../review.md) to check the explanations, then add original literature and real cases for selected responsibilities. Any demonstration should separately retain its scenario specification, records visible to each method, independent evaluation, and results. A teaching story does not replace an experiment.
