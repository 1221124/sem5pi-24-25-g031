# UC020 - As an Admin, I want to add new types of operations, so that I can reflect the available medical procedures in the system

## 1. Requirements Engineering

### 1.1. Use Case Description

> As Admin, I want to add new type of operations.

### 1.2. Customer Specifications and Clarifications

**From the specifications document:**

- Operation types are medical procedures that can be performed at the hospital.
- Admin must be able to add, edit, delete, and list/search operations.
- When registering a new operation, the Admin must provide several details, such as:
  - Name
  - Specialization
  - Required staff (quantity for each role)
  - Estimated duration
- An ID (unique identifier) is automatically assigned to each operation.

**From the client clarifications:**

> **Question:** In the document with the surgeries, they all have 3 phases and respective duration:
-Anesthesia/patient preparation
-Surgery
-Cleaning
Can we assume while creating a new operation type, that the surgery must always have this 3 phases?
> **Answer:** Yes.
>
> **Question:** Are the different phases of surgery relevant to the business and should they be recorded in the system?
> **Answer:** Yes; they are important due to the time it takes each phase and in the future for the planning of different teams (e.g., cleaning team)
>
> **Question:** Regarding the required Staff, what is it? A list that defines the specializations and roles of the staff involved in the appointment? Like 2 heart doctors and 5 heart nurses?
> **Answer:** Yes.
>
> **Question:** The document you provided divides surgical times into "specific phases of the surgery," whereas the main statement only mentions recording the total surgery time. Should the system, therefore, store and specify the time spent on each phase of the surgery, or is it sufficient to only record the total surgery time without detailing the time distribution across each phase?
> **Answer:** When describing an operation type, the system must record the time for each phase.
>
>**Question:** When creating a new type of operation, we have a name, 3 temporal phases of the Surgery and the required list of staff (specialties, quantity). Should this new type of operation have a specialty other than those required in the mode according to AC006.2, can a doctor only schedule Surgery in his specialty? The process is to create the new operation type and then add the list of required specialties?
>**Answer:** The type of operation is associated with a given specialty. The list of specialties is an integral part of the type of operation. Creation is carried out in a single step, not in two.
>
>**Question:** In a previous answer you stated that "The type of operation is associated with a given specialty". In another answer you said "a team of 1 doctor with specialization X and one nurse with specialization Y" (regarding the required staff for a said type of operation). From the specifications document and the additional document with the 10 most common types of operations, we have two specializations: orthopedics and cardiology. The question is: If the operation type already has a specialization associated, how can we have staff with different specializations? What do you understand by specialization? Is it cardiology/orthopedics? Or anaesthesist/circulating/...?
>**Answer:** The operation is mainly associated with one specialization, but for a specific operation it might require a team with multiple specializations. Cardiology, orthopedics, anaesthesists, ... are specializations that either doctors or nurses can have. The circulating technician is a different type of medical professional. For now the system doesn't need to support technicians.

### 1.3. Acceptance Criteria

> AC020.1: Admin can add new operation types, providing the operation name, estimated duration, and required staff (by specializations).
> AC020.2: The system validates that the operation name is unique.
> AC020.3: The system logs the creation of new operation types and makes them available for scheduling immediately.

### 1.4. Found out Dependencies

- This Use Case is relative to US5.1.20, which is related to the operation types management functionality.
- It relates to the following Use Case(s) as well:
  - [UC021 (US5.1.21)](../UC021/README.md) - As an Admin,  I want to edit existing operation types, so that I can update or correct information about the procedure.
  - [UC022 (US5.1.22)](../UC022/README.md) - As an Admin, I want to remove obsolete or no longer performed operation types, so that the system stays current with hospital practices.
  - [UC023 (US5.1.23)](../UC023/README.md) - As an Admin, I want to list/search operation types, so that I can see the details, edit and remove operation types.

### 1.5 Input and Output Data

**Input Data:**

- Typed data: operation name, estimated duration (for each phase)
- Selected data: N.A.

**Output Data:**

- Operation ID (unique identifier)

### 1.6. System Sequence Diagram (SSD)

![System Sequence Diagram](svg/uc020-system-sequence-diagram.svg)

### 1.7 Other Relevant Remarks

- The system must ensure that the operation ID is unique and automatically assigned.
- The system must store the time spent on each phase of the surgery.
- The system must make the new operation type available for scheduling immediately after creation (status = active).
