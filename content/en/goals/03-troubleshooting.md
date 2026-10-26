# Fault Resolution

[Back to home](../README.md)

**Fault Resolution investigates failed or nonconforming execution, corrects the execution methods and operating conditions that caused the problem, and repairs the state already affected.** It covers both tasks that cannot progress and tools that report success while leaving faulty artifacts. Failure attribution, operational remediation, and state restoration can work together repeatedly; resolution need not wait until retries are exhausted.

Consider a document conversion task. Suppose the user asks for a quarterly report to be converted to PDF and then summarized. The content must be complete, and comparisons must respect the source's reporting basis. The working agent is authorized to use the conversion service, save files, and write the summary; the governance agent may inspect the conversion process, hold delivery, and arrange authorized corrections.

## Failure Attribution

The conversion service reports success, the PDF opens, and the table's figures match the source. However, a delivery check finds that the source's note stating “the reporting basis has changed; the two quarters cannot be compared directly” is missing from the PDF, while the summary has already inferred growth from the table. The task is now to identify where the note was lost and which subsequent content depends on the incomplete artifact.

The governance agent retrieves the same version of the source document, the intermediate file sent to the conversion service, and the output. It finds that the note was in a text box and was already absent from the intermediate file produced by preprocessing. In an isolated trial using input that preserves the text box, the note is retained. This supports locating the problem in preprocessing. Missing text in the final PDF alone cannot distinguish a source-version problem from a preprocessing or conversion-service fault.

Attribution must also trace the effects: the summary used the PDF without the reporting note, so its growth conclusion needs review. Matching figures and a successful tool response do not rule out content loss. Naming a tool that participated does not explain how the fault arose or propagated. Conversion steps not covered by the available evidence should remain open for investigation.

## Operational Remediation

In this example, resubmitting the same intermediate file would still omit the note. The governance agent arranges for the working agent to correct preprocessing so that text boxes relevant to the body are preserved, then repeat conversion with complete input. The change stays within the authorized document-processing scope: first check the affected content, then confirm that other paragraphs, tables, and layout have not been damaged.

A correction must correspond to the identified problem and its verification conditions. Here, the reporting note must be preserved in full and readable alongside the relevant table; producing a new PDF establishes only that a file was generated. If the available tools cannot meet the requirements, another processing method should be selected within the assigned authority, or the task should be terminated with the unfinished content explained. “Complete content” must not quietly become “correct main figures.”

Fixed checks for supported formats can block known defects, and a model can help identify the semantic relationship between the note and the table. The challenge is to use the current materials and conversion records to locate the loss, choose an effective change, and verify the judgment against the result. Asking a model to generate the output again, or applying the same retry policy to every failure, cannot by itself do this work.

## State Restoration

Once the conversion method is fixed, the old PDF in the delivery folder and the existing summary are still affected. The governance agent should use artifact versions and usage records to determine the repair scope: replace the pending delivery with the verified PDF, arrange a review of the summary's comparisons, and retain content that still has independent support.

Here, the summary should explain that the quarters use different reporting bases and that the available figures do not directly establish growth. Business background that does not depend on that comparison can remain. Valid edits made since the fault was discovered should also be preserved; rolling back the entire folder could overwrite subsequent work. File rollback and dependency records can support restoration, but identifying which passages actually depend on faulty evidence still requires examining their content.

Restoration is supported when the artifacts awaiting delivery use valid versions, affected conclusions have been addressed, and no faulty copies remain in use. If the status of external copies cannot be confirmed, that uncertainty should be stated. A successful local replacement does not prove that every consequence has been removed.
