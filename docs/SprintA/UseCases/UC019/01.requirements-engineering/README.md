# UC019 - As a Doctor, I want to list/search operation requisitions, so that I see the details, edit, and remove operation requisitions

## 1. Requirements Engineering

### 1.1. Use Case Description

> As a Doctor, I want to list/search operation requisitions, so that I see the details, edit, and remove operation requisitions.

---

### 1.2. Customer Specifications and Clarifications

> **Question:** n/a
> 
> **Answer:** n/a

---

### 1.3. Acceptance Criteria

> AC019.1: Doctors can search operation requests by patient name, operation type, priority, and status
> AC019.2: The system displays a list of operation requests in a searchable and filterable view.
> AC019.3: Each entry in the list includes operation request details (e.g., patient name, operation type, status).
> AC019.4: Doctors can select an operation request to view, update, or delete it.

---

### 1.4. Found out Dependencies

* This Use Case is relative to US 5.1.19, which is related to the backoffice job opening management functionality.
* It relates to the following Use Cases as well:
  - [UC016](../../UC016/README.md) - As a Doctor, I want to request an operation, so that the Patient has access to the necessary healthcare.
  - [UC017](../../UC017/README.md) - As a Doctor, I want to update an operation requisition, so that the Patient has access to the necessary healthcare.
  - [UC018](../../UC018/READEME.md) - As a Doctor, I want to remove an operation requisition, so that the healthcare activities are provided as necessary.


### 1.5 Input and Output Data

**Input Data:**

- Automatic data:
	- send email

**Output Data:**
- Send email with the result of the verification process

### 1.6. System Sequence Diagram (SSD)

![System Sequence Diagram](svg/uc001-system-sequence-diagram.svg)

### 1.7 Other Relevant Remarks

- The email notification functionality depends on the system's ability to authenticate users and manage job openings and candidate data appropriately.
- To notify by email, it is necessary to connect to the VPN.