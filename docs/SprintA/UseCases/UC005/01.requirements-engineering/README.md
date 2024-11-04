# UC0005 - As a Patient, I want to delete my account and all associated data, so that I can exercise my right to be forgotten as per GDPR.


## 1. Requirements Engineering

### 1.1. Use Case Description

> As a Patient, I want to delete my account and all associated data, so that I can exercise my right to be forgotten as per GDPR.

---

### 1.2. Customer Specifications and Clarifications

**From the client clarifications:**

> **Question:** What happens to patient data after the profile is deleted?
> 
> **Answer:** Patient data must be retained for a legally mandated period before being anonymized or deleted.

---

### 1.3. Acceptance Criteria

**AC 1**: Patients can request to delete their account through the profile settings.
**AC 2**: The system sends a confirmation email to the patient before proceeding with account deletion.
**AC 3**: Upon confirmation, all personal data is permanently deleted from the system within the legally required time frame (e.g., 30 days).
**AC 4**: Patients are notified once the deletion is complete, and the system logs the action for GDPR compliance.
**AC 5**: Some anonymized data may be retained for legal or research purposes, but all identifiable information is erased.

---

### 1.4. Found out Dependencies

* This Use Case is relative to US 5.1.5, which is related to the deletion of a patient account and all associeted data
* It relates to the following Use Cases as well:
  - [UC008](../../UC008/README.md) - As an Admin, I want to create a new patient profile, so that I can register their personal details and medical history.

---

### 1.5 Input and Output Data

**Output Data:**
- Send a confirmation email before proceding with the deletion.

---

### 1.6. System Sequence Diagram (SSD)

![System Sequence Diagram](svg/uc008-system-sequence-diagram.png)
