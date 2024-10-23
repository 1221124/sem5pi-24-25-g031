# UC016 - As a Doctor, I want to request an operation, so that the Patient has access to the necessary healthcare.

## 1. Requirements Engineering

### 1.1. Use Case Description

> As a Doctor, I want to request an operation, so that the Patient has access to the necessary healthcare.

---

### 1.2. Customer Specifications and Clarifications

**From the specifications document:**

- n/a

**From the client clarifications:**

> **Question:** How does a Doctor suggests a deadline date for an appointment? Does it have any criteria? Or do they just wing it? 
> 
> **Answer:** The doctor will decide the "best" due date based on their experience. they will enter it in the system as an indication so that the planning module eventually takes that into account alongside priority and other criteria.

> **Question:** In the project document it mentions that each operation has a priority. How is a operation's priority defined? Do they have priority levels defined? Is it a scale? Or any other system?
>
> **Answer:** Elective Surgery: A planned procedure that is not life-threatening and can be scheduled at a convenient time (e.g., joint replacement, cataract surgery).
> Urgent Surgery: Needs to be done sooner but is not an immediate emergency. Typically within days (e.g., certain types of cancer > surgeries).
> Emergency Surgery: Needs immediate intervention to save life, limb, or function. Typically performed within hours (e.g., ruptured aneurysm, trauma).

> **Question:** Can a doctor make more than one operation request for the same patient? If so, is there any limit or rules to follow? For example, doctors can make another operation request for the same patient as long as it's not the same operation type?
>
> **Answer:** it should not be possible to have more than one "open" surgery request (that is, a surgery that is requested or scheduled but not yet performed) for the same patient and operation type.

> **Questionn:**
>
> **Answer:**

---

### 1.3. Acceptance Criteria

> AC016.1: - Doctors can create an operation request by selecting the patient, operation type, priority, and suggested deadline.
> AC016.2: - The system validates that the operation type matches the doctor’s specialization.
> AC016.3: - The operation request includes: Patient ID, Doctor ID, Operation Type, Deadline and Priority
> AC016.4: - The system confirms successful submission of the operation request and logs the request in the patient’s medical history.
---

### 1.4. Found out Dependencies

* This Use Case is relative to US 5.1.16, which is related to the operation request made by a Doctor.
* It relates to the following Use Cases as well:
  - [UC017](../../UC017/README.md) - As a Doctor, I want to update an operation requisition, so that the Patient has access to the necessary healthcare.
  - [UC018](../../UC018/READEME.md) - As a Doctor, I want to remove an operation requisition, so that the healthcare activities are provided as necessary.
  - [UC019](../../UC019/README.md) -  As a Doctor, I want to list/search operation requisitions, so that I see the details, edit, and remove operation requisitions.


### 1.5 Input and Output Data

**Input Data:**

- Automatic data:
	- Doctor ID

- Selected data:
  - Patient ID
  - Operation Type
  - Deadline
  - Priority

**Output Data:**
- Confirmations message

### 1.6. System Sequence Diagram (SSD)

![System Sequence Diagram](png/uc016-system-sequence-diagram.svg)

### 1.7 Other Relevant Remarks

n/a