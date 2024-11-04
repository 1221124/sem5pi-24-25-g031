# UC015 - As an Admin, I want to list/search staff profiles, so that I can see the details, edit, and remove staff profiles

## 1. Requirements Engineering

### 1.1. Use Case Description

> This use case allows administrators to search, view, edit, and deactivate staff profiles within the hospital system. The purpose is to facilitate the management of healthcare staff details, ensuring that their information is up-to-date.

---

### 1.2. Customer Specifications and Clarifications

**From the specifications document:**

- Historical data should be maintained even when a staff profile is deactivated.

**From the client clarifications:**

> **Question:**
>
> **Answer:**

---

### 1.3. Acceptance Criteria

> AC015.1: Admins can search staff profiles by attributes such as name, email, or specialization.
> AC015.2: The system displays search results in a list view with key staff information (name, email, specialization).
> AC015.3: Admins can select a profile from the list to view, edit, or deactivate.
> AC015.4: The search results are paginated, and filters are available for refining the search results.

---

### 1.4. Found out Dependencies

- This Use Case is relative to US 1010, which is related to the backoffice job opening management functionality.
- It relates to the following Use Cases as well:
  - [UC013](../../UC013/README.md) - As an Admin, I want to edit a staff’s profile, so that I can update their information
  - [UC014](../../UC014/README.md) - As an Admin, I want to deactivate a staff profile, so that I can remove them from the hospital’s active roster without losing their historical data

### 1.5 Input and Output Data

**Input Data:**

- Select data:
  - Staff information
    - Name
    - Email
    - Specialization

**Output Data:**

- Displays search results in a list view with key staff information

### 1.6. System Sequence Diagram (SSD)

![System Sequence Diagram](svg/uc015-system-sequence-diagram.svg)

### 1.7 Other Relevant Remarks

n/a
