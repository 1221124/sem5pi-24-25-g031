# UC013 - As an Admin, I want to edit a staff’s profile, so that I can update their information

## 1. Requirements Engineering

### 1.1. Use Case Description

> As an Admin, I want the ability to edit a staff member's profile in the system to ensure that their information, such as contact details, availability slots, and specialization, is always up to date.

---

### 1.2. Customer Specifications and Clarifications

**From the specifications document:**

- The system must allow the admin to search and edit staff profiles efficiently.
- The system must validate changes, especially for sensitive fields like contact information.
- Any change to a staff member’s contact information must trigger an email notification to confirm the update.

**From the client clarifications:**

> **Question:**
>
> **Answer:**

---

### 1.3. Acceptance Criteria

> AC013.1: Admins can search for and select a staff profile to edit.
> AC013.2: Editable fields include contact information, availability slots, and specialization.
> AC013.3: The system logs all profile changes, and any changes to contact information trigger a confirmation email to the staff member.
> AC013.4: The edited data is updated in real-time across the system.

---

### 1.4. Found out Dependencies

- This Use Case is relative to US 5.1.13, which is related to the edit staff profile made by Admin.
- It relates to the following Use Cases as well:
  - [UC012](../../UC012/README.md) - As an Admin, I want to create a new staff profile, so that I can add them to the hospital’s roster.

### 1.5 Input and Output Data

**Input Data:**

- Automatic data:
  - Contact Information
  - Availability slots
  - Specialization

- Selected data:
  - Staff profile

**Output Data:**

- Updated staff profile
- Confirmation email sent to the staff member

### 1.6. System Sequence Diagram (SSD)

![System Sequence Diagram](svg/uc013-system-sequence-diagram.svg)

### 1.7 Other Relevant Remarks

n/a
