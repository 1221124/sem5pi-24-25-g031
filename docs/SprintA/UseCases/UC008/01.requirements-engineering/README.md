# UC030 - As Customer Manager, I want the system to notify candidates, by email, of the result of the verification process


## 1. Requirements Engineering

### 1.1. Use Case Description

> As Customer Manager, I want the system to notify candidates, by email, of the result of the verification process.

---

### 1.2. Customer Specifications and Clarifications

**From the specifications document:**

- The solution should be deployed using several network nodes. It is expected that, at least, the relational
  database server and the Follow Up Server be deployed in nodes diferent from localhost, preferably in the cloud. The e-mail notification
  tasks must be executed in background by the Follow Up Server.

**From the client clarifications:**

> **Question:** Relativamente ao envio das notificações por email, é necessário guardar que esse envio foi feito?
> 
> **Answer:** No documento nada de explicito é dito sobre este assunto. No entanto, do ponto de vista de gestão do processo da jobs4u parece-me adequado que essa informação fique registada.

> **Question:** "As Customer Manager, I want the system to notify candidates, by email, of the result of the verification process" qual é o processo através do qual essa notificação é gerada? Após a avaliação do Requirement Specification module, este gera um resultado "Aprovado" ou "Rejeitado". Este resultado despoleta automaticamente uma notificação para o candidato ou é o Customer Manager que tem a responsabilidade de informar o candidato através do sistema do resultado da verificação (ex. depois de um resultado negativo ser gerado, o Customer Manager vai no sistema rejeitar o candidato para que seja enviado o email)?
>  
> **Answer:** É a segunda opção que apresenta. A US1015 permite que o Customer Manager invoque o processo de verificação de requisitos. Depois disso todas as candidaturas devem estar aceites ou recusadas. É então possível ao Customer Manager invocar a notificação através da US1016.

> **Question:** About the Us1016 wich states: "As Customer Manager, I want the system to notify candidates, by email, of the result of verification process". I want to know when the client says "verification process" is the same about the screening phase.
> 
> **Answer:** Yes.

> **Question:** This user story has a functional dependency with 1015. I would like to know if an error occurs, do I need to delete what happened in US 1015, as if it were a transaction?
> 
> **Answer:** The process of notification (US1016) must be done after the verification (US1015) but an error in the notification does not invalidate the “results” of the verification process.

---

### 1.3. Acceptance Criteria

> AC030.1: When moving from the screening phase to the interview phase, the system must send an email to all candidates who passed the screening phase, informing them that they have advanced to the interview phase.
---

### 1.4. Found out Dependencies

* This Use Case is relative to US 1010, which is related to the backoffice job opening management functionality.
* It relates to the following Use Cases as well:
  - [UC026](../../UC002/README.md) - As Customer Manager, I want to open phases of the process for a job opening
  - [UC027](../../UC002/README.md) - As Customer Manager, I want to close phases of the process for a job opening


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