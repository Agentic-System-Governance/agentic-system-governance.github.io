# Auditability Assurance

[Back to home](../README.md)

**Auditability Assurance maintains the ability to reconstruct execution, trace responsibility, and assess compliance, so that authorized reviewers can check what happened, who participated under which authority, and whether the actual conduct met applicable requirements.** Record integrity, versions, retention periods, and access permissions support these functions; keeping logs alone is not enough to answer review questions.

Consider an accommodation reimbursement task. Suppose the company normally reimburses no more than CNY 600 per night, but allows an authorized manager to approve exceptions for a conference's designated hotel. An employee submits a receipt for one night at CNY 800, together with approval to “reimburse actual costs under the designated accommodation arrangements for this conference.” The reimbursement agent uses the approval and its supporting materials to determine that CNY 800 is reimbursable, then delegates payment to a payment agent. Task permissions, the exception approval process, and record requirements are already established. The review must determine whether this particular payment fell within the approval's scope.

## Execution Reconstruction

Seeing “CNY 800 paid” afterward shows only an outcome status; it does not reveal what the reimbursement agent used to determine the reimbursable amount. The governance agent should ensure that the claim, receipt, conference arrangements referenced by the approval, reimbursement rules in force at the time, and record of the assessed amount can be linked. The payment delegation, payment call, and evidence that funds arrived should then be connected to the same claim.

This example requires recovering the specific context at the time: which version of the conference arrangements the approval referred to, which hotel and dates those arrangements specified, whether the receipt matched them, and what amount and purpose the reimbursement agent passed to the payment agent. If execution conveyed only a summary saying “accommodation approved,” the review must still be able to return to the original approval and its referenced materials. The summary cannot replace the scope restrictions.

Version control and business logs can preserve these relationships, and key materials can be held through controlled references without copying all personal information. The conference arrangements opened today may have changed. A plausible explanation generated afterward cannot establish what evidence was actually used at the time. Gaps in the records should be presented alongside the reconstructed execution.

## Responsibility Attribution

Responsibility attribution connects specific actions to authorizers, delegators, executors, and those assigned review duties. In this example, the manager approves the accommodation exception, the reimbursement agent determines whether the receipt qualifies and assesses the reimbursable amount, and the payment agent transfers funds under the payment delegation. The governance agent's verification and release decisions also need their own supporting records.

A reviewer should be able to trace the transaction back to the payment delegation, then to the decision on the amount and the applicable approval. The service account shown by the payment provider cannot alone identify the task or agent instance that initiated payment, much less establish that the manager approved every detail of execution. Delegation records should retain the recipient, amount, purpose, and scope of authority, making the responsibilities at execution time inspectable.

These records show which duties participants held and which decisions they made. Initiating payment does not establish that an agent was responsible for determining the amount; approving an exception does not remove subsequent receipt-review duties. Reconstructing responsibility provides evidence for further review, not an automatic finding of fault or legal liability.

## Compliance Assessment

Applying the CNY 600 limit directly in this example would misclassify a valid exception as a violation. Looking only at “approved” could overlook restrictions on the hotel, dates, and expense purpose. Review should connect the actual payment to the rules in force at the time, the approval's content, and its referenced materials, determining whether the exception covered this accommodation expense rather than merely checking that an approval record exists.

If the retained materials establish that the receipt matches the designated hotel and conference night, the CNY 800 was for approved accommodation, the approver had the required authority, and the amount received matched the assessed amount, they support a finding that the payment was compliant within the reviewed scope. The conclusion should point to those records and rule versions, without becoming a guarantee about every part of the reimbursement process.

Fixed programs can check amounts, dates, and identities; models can help interpret the relationship between the approval and the conference arrangements. The remaining challenge is to apply the scope of a natural-language approval to the actual transaction and establish that the materials were the evidence used at the time. If only “reimbursement approved” remains and the referenced arrangements are missing, the missing scope evidence should be listed and the conclusion left unconfirmed. Models cannot invent history, and the existence of logs cannot automatically turn an unknown into compliance or noncompliance.
