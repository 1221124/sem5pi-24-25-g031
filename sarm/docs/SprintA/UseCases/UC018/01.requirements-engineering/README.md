# UC018 - As a Doctor, I want to remove an operation requisition, so that the healthcare activities are provided as necessary.


## 1. Requirements Engineering

### 1.1. Use Case Description

> As a Doctor, I want to remove an operation requisition, so that the healthcare activities are provided as necessary.

---

### 1.2. Customer Specifications and Clarifications

**From the client clarifications:**

> **Question:** n/a
> 
> **Answer:** n/a

---

### 1.3. Acceptance Criteria

> AC018.1: Doctors can delete operation requests they created if the operation has not yet been scheduled.
> AC018.2: A confirmation prompt is displayed before deletion.
> AC018.3: Once deleted, the operation request is removed from the patient’s medical record and cannot be recovered.
> AC018.4:The system notifies the Planning Module and updates any schedules that were relying on this request.

---

### 1.4. Found out Dependencies

* This Use Case is relative to US 5.18, which is related to the job request management functionality.
* It relates to the following Use Cases as well:
  - [UC016](../../UC016/README.md) - As a Doctor, I want to request an operation, so that the Patient has access to the necessary healthcare.
  - [UC017](../../UC017/README.md) - As a Doctor, I want to update an operation requisition, so that the Patient has access to the necessary healthcare.
  - [UC019](../../UC019/README.md) -  As a Doctor, I want to list/search operation requisitions, so that I see the details, edit, and remove operation requisitions.


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