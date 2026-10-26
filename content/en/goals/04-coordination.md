# Multi-Agent Coordination

[Back to home](../README.md)

**Multi-Agent Coordination organizes interdependent work among agents and human participants under the valid mandate, keeping assignments, conditions for progress, and shared outputs compatible.** Sub-task allocation establishes who executes and who follows up; dependency management determines which work is ready to proceed; consistency maintenance checks whether the evidence, states, and artifacts used by participants can work together. Individual task completion does not mean the system is ready to deliver.

Continuing the quarterly sales report example: an analysis agent calculates changes in sales from authorized data sources, and a writing agent uses the results to produce the summary and body. The mandate already requires the report to use the latest data confirmed as valid at delivery, with written conclusions supported by the analysis. The agents can exchange artifacts and version information; the governance agent may inspect coordination status, arrange updates, and hold delivery when its conditions are unmet.

## Sub-Task Allocation

Assignments need to include handoffs and subsequent follow-up. The analysis agent supplies the data version, calculations, and necessary explanations, and updates its analysis when applicable data corrections are found. The writing agent incorporates the results into the draft and checks references. The governance agent maintains these responsibilities and delivery conditions so that someone remains responsible for updates after the analysis is sent.

The analysis agent initially reports that “sales increased from the previous quarter,” and the writing agent completes the relevant passages on that basis. Before delivery, the data source publishes a correction. The analysis agent confirms that it applies to this report, recalculates, and revises the conclusion to “sales decreased.” This does not change the task objective or authorization scope: the analysis agent supplies the grounds for the correction, the writing agent revises content that depends on the old result, and the governance agent tracks the handoff and unfinished work.

Specifying “who notifies whom” is not enough. It must be clear who confirms that the new result is usable, who revises affected content, and what evidence establishes that the handoff is complete. If work must be reassigned, outstanding requests and pending feedback also need an owner; they must not be left unattended when the original executor leaves.

## Dependency Management

The corrected analysis is available, but the draft still depends on the old conclusion. The governance agent should mark the affected writing work as requiring an update and hold final delivery. Background information that does not depend on the change can be retained and developed further.

The key judgment is which content actually depends on the old analysis. In addition to directly quoted growth figures, a statement such as “demand is expanding” may have been inferred from the growth conclusion without a sentence-level dependency being recorded. Replacing figures or searching for “growth” may miss those inferences; equally, not all sales-related content should be treated as invalid. The revision scope and still-valid content must be determined from the passages' evidence, the analysis process, and the differences between the old and new results.

Version control and dependency graphs can automatically flag registered downstream artifacts, and messaging systems can convey updates. The governance agent must ensure that the semantic dependencies involved in this change are also covered and assign revisions to the appropriate executor. Receipt of an update by the writing agent establishes only that the input arrived, not that the conditions for delivery have been met again.

## Consistency Maintenance

After the writing agent revises the text using the new analysis, the summary, body, and cited figures must be checked for compatible evidence. Changing “increase” to “decrease” while retaining an explanation based on growth does not support delivery. Nor does every participant claiming to use the latest version prove that the correction has reached the text.

Consistency follows from the relationships required by the task; it does not require both agents to express identical views. If the analysis supports a decline in sales, the writing may offer a supported explanation or retain uncertainty, but it cannot continue to present unsupported inferences about growth as facts. Checks must cover both versions and figures, and the relationship between conclusions and evidence.

Once the relevant content has been updated and verified, the delivery restriction imposed for this coordination adjustment can be lifted; other valid completion evidence need not be collected again. Fixed workflows can control waiting and version changes, while models can help interpret textual dependencies. Both need reliable source links, explicit follow-up responsibilities, and checks of the actual artifacts to establish that the change has been correctly incorporated into the shared delivery.
