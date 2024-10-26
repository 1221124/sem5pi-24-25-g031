# UC010 - As an Admin, I want to delete a patient profile 


## 1. Requirements Engineering

### 1.1. Use Case Description

> As an Admin, I want to delete a patient profile, so that I can remove patients who are no longer under care

---

### 1.2. Customer Specifications and Clarifications

**From the client clarifications:**

> **Question:** What happens to patient data after the profile is deleted?
> 
> **Answer:** Patient data must be retained for a legally mandated period before being anonymized or deleted.

> **Question:** They can be searched by name, email, date of birth, or medical record number, but everyone has the same role, no specialization, and so on. Can you be a bit more detailed on the filters you're looking to be applied in the patients listings?
>  
> **Answer:** Users should be able to search students by: name, AND/OR email, AND/OR phone number, AND/OR medical record number, AND/OR date of birth, AND/OR gender,  listing of users should have the same filters available

---

### 1.3. Acceptance Criteria

-**AC 1:** Admins can search for a patient profile and mark it for deletion.

-**AC 2:** Before deletion, the system prompts the admin to confirm the action.

-**AC 3:** Once deleted, all patient data is permanently removed from the system within a predefined time frame.

-**AC 4:** The system logs the deletion for audit and GDPR compliance purposes.

---

### 1.4. Found out Dependencies

* This Use Case is relative to US 1010, which is related to the backoffice job opening management functionality.
* It relates to the following Use Cases as well:
  - [UC011](../../UC011/README.md) - As an Admin, I want to delete a patient profile, so that I can remove patients who are no longer under care

### 1.5 Input and Output Data

**Input Data:**

- OPTIONAL:
  - name
  - email
  - phone number
  - medical record number
  - date of birth
  - gender  

**Output Data:**
- Prompt box for admin to confirm the action

### 1.6. System Sequence Diagram (SSD)

![System Sequence Diagram](svg/uc010-system-sequence-diagram.png)

