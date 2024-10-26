# UC030 - As Customer Manager, I want the system to notify candidates, by email, of the result of the verification process

# 4. Tests 

In this project, a Test-Driven Development (TDD) approach was used.

```java
class EmailServiceTest {
    @InjectMocks
    private JobOpeningManagementService jobOpeningManagementService;
    @Mock
    private JobApplicationRepository jobApplicationRepository;
    @Mock
    private CandidateRepository candidateRepository;
    private Candidate candidate1;
    private Candidate candidate2;

    private JobApplication jobApplication1;
    private JobApplication jobApplication2;
    private JobApplication jobApplication3;

    private JobOpening jobOpening1;
    private JobOpening jobOpening2;
    private List<JobApplication> jobApplications;
    private List<JobOpening> jobOpenings;

    private Rank rank;


    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        SystemUserBuilder userBuilder = UserBuilderHelper.builder();
        CandidateBuilder candidateBuilder = new CandidateBuilder();
        CustomerBuilder customerBuilder = new CustomerBuilder();
        JobOpeningBuilder jobOpeningBuilder = new JobOpeningBuilder();
        JobApplicationBuilder jobApplicationBuilder = new JobApplicationBuilder();

        SystemUser user1 = userBuilder.with(EmailAddress.valueOf("1200347@isep.ipp.pt"), Password.encodedAndValid("Password1!", new BasePasswordPolicy(), new PlainTextEncoder()).get(), Name.valueOf("Test", "Test")).build();
        SystemUser user2 = userBuilder.with(EmailAddress.valueOf("name@domain.com"), Password.encodedAndValid("Password2!", new BasePasswordPolicy(), new PlainTextEncoder()).get(), Name.valueOf("Name", "Name")).build();

        candidate1 = candidateBuilder.with(user1).build();
        candidate2 = candidateBuilder.with(user2).build();

        JobReference jobReference1 = new JobReference("CUST-001");
        JobReference jobReference2 = new JobReference("CUST-002");

        Designation jobTitle = Designation.valueOf("JobTitle");
        Address address = new Address(District.AVEIRO, County.valueOf("County"), Parish.valueOf("Parish"),
                Street.valueOf("Street"), DoorNumber.valueOf(123), PostalCode.valueOf("4250-420"));
        Description description = Description.valueOf("Description");

        Calendar start = Calendar.getInstance();
        Calendar end = Calendar.getInstance();
        start.set(2023, Calendar.JANUARY, 1);
        end.set(2023, Calendar.DECEMBER, 31);
        DateInterval interval = new DateInterval(start, end);

        Map<Phase, PhaseDetails> phases = new HashMap<>();
        phases.put(Phase.APPLICATION, new PhaseDetails(interval, Status.COMPLETED));
        phases.put(Phase.SCREENING, new PhaseDetails(interval, Status.COMPLETED));
        phases.put(Phase.INTERVIEW, new PhaseDetails(interval, Status.COMPLETED));
        phases.put(Phase.ANALYSIS, new PhaseDetails(interval, Status.COMPLETED));
        phases.put(Phase.RESULT, new PhaseDetails(interval, Status.COMPLETED));

        InterviewModel interviewModel = new InterviewModel(Designation.valueOf("InterviewModel"), Description.valueOf("InterviewModel"));
        JobRequirements jobRequirements = new JobRequirements(Designation.valueOf("JobRequirements"), Description.valueOf("JobRequirements"));

        SystemUser user3 = userBuilder.with("1200347@isep.ipp.pt", "Password1!", "Customer", "JobsForU", "1200347@isep.ipp.pt").build();
        Customer customer = customerBuilder.withSystemUser(user3).withCustomerCode(CustomerCode.valueOf("CUST")).withAddress(address).build();

        jobOpening1 = jobOpeningBuilder.with(jobReference1, jobTitle, ContractType.FULL_TIME, JobMode.HYBRID, address,
                customer, NumberOfVacancies.valueOf(1), description, phases, interviewModel, jobRequirements, Status.COMPLETED).build();

        jobOpening2 = jobOpeningBuilder.with(jobReference2, jobTitle, ContractType.FULL_TIME, JobMode.HYBRID, address,
                customer, NumberOfVacancies.valueOf(1), description, phases, interviewModel, jobRequirements, Status.IN_PROGRESS).build();

        jobOpenings = List.of(jobOpening1, jobOpening2);

        JobApplicationReference appRef1 = new JobApplicationReference("CUST-001" + candidate1.email().toString());
        JobApplicationReference appRef2 = new JobApplicationReference("CUST-001" + candidate2.email().toString());
        JobApplicationReference appRef3 = new JobApplicationReference("CUST-002" + candidate1.email().toString());

        jobApplication1 = jobApplicationBuilder.with(appRef1, jobOpening1, candidate1).build();
        jobApplication2 = jobApplicationBuilder.with(appRef2, jobOpening1, candidate2).build();
        jobApplication3 = jobApplicationBuilder.with(appRef3, jobOpening2, candidate1).build();

        jobApplications = List.of(jobApplication1);

        when(candidateRepository.ofIdentity(candidate1.identity())).thenReturn(Optional.of(candidate1));
        when(candidateRepository.ofIdentity(candidate2.identity())).thenReturn(Optional.of(candidate2));

        when(jobApplicationRepository.applicationsByCandidate(candidate1)).thenReturn(Stream.of(jobApplication1, jobApplication2, jobApplication3).filter(jobApplication -> jobApplication.candidate().equals(candidate1)).toList());
        when(jobApplicationRepository.applicationsByCandidate(candidate2)).thenReturn(Stream.of(jobApplication1, jobApplication2, jobApplication3).filter(jobApplication -> jobApplication.candidate().equals(candidate2)).toList());

        when(jobApplicationRepository.numberOfApplicants(jobApplication1)).thenReturn(Stream.of(jobApplication1, jobApplication2, jobApplication3).filter(jobApplication -> jobApplication.jobOpening().equals(jobApplication1.jobOpening())).toList().size());
        when(jobApplicationRepository.numberOfApplicants(jobApplication2)).thenReturn(Stream.of(jobApplication1, jobApplication2, jobApplication3).filter(jobApplication -> jobApplication.jobOpening().equals(jobApplication2.jobOpening())).toList().size());
        when(jobApplicationRepository.numberOfApplicants(jobApplication3)).thenReturn(Stream.of(jobApplication1, jobApplication2, jobApplication3).filter(jobApplication -> jobApplication.jobOpening().equals(jobApplication3.jobOpening())).toList().size());

        rank = new Rank(1, RankStatus.RANKED);

    }
}
```

**Test 1:** Check the email sending process.

```java
class EmailServiceTest {
    
@Test

void sendEmail() {
    boolean result = jobOpeningManagementService.sendEmail(Phase.INTERVIEW, jobOpening1, Status.COMPLETED);
    assertEquals(true, result);
}
}
```

# 5. Construction (Implementation)

To help achieve this Use Case's requirements, some EAPLI framework classes were used.

## Class CloseOpenPhasesJobOpeningUI
```java
public boolean show() {

    System.out.println("Setup Job Opening Phase");

    System.out.println("\nObtaining job openings available...\n");
    List<JobOpening> jobOpeningsAvailable = theController.filterJobOpenings(theController.obtainJobOpeningsAvailable());

    if (jobOpeningsAvailable.isEmpty()) {
        System.out.println("There are no job openings available.");
        return false;
    }


    final Iterable<JobOpening> jobOpenings = theController.allJobOpening();


    if (jobOpenings == null) {
        System.out.println("No job openings available.");
        return false;
    }

    SelectWidget<JobOpening> selectorJobOpening = new SelectWidget<>("Select job Opening", jobOpenings, new JobOpeningPrinter());
    selectorJobOpening.show();
    JobOpening jobOpeningSelected = selectorJobOpening.selectedElement();


    if (jobOpeningSelected == null) {
        System.out.println("No job opening selected.");
        return false;
    }else if (jobOpeningSelected.phases().isEmpty()) {
        System.out.println("The phases for this job opening have not been defined yet.");
        return false;
    }else if (theController.areAllPhasesComplete(jobOpeningSelected.phases())) {
        theController.updateStatus(jobOpeningSelected, Status.COMPLETED);
        System.out.println("All phases are completed. The job opening status has been updated to completed.");
        return true;
    }

    boolean validOption = true;

    while (validOption) {

        displayPhasesAndStatus(jobOpeningSelected);

        int option = Console.readInteger("Do you want to:\n" +
                "1. Close the current phase\n" +
                "2. Go back to the previous phase\n" +
                "3. Open the phase\n" +
                "4. Save and Exit\n" +
                "5. Cancel\n" +
                "Choose an option: ");

        switch (option) {
            case 1:
                boolean success = theController.managePhases(jobOpeningSelected);
                if (success) {
                    System.out.println("Closed the current phase and opened the next phase successfully.");
                } else {
                    System.out.println("Opened the next phase successfully, but no more phases to open.");
                    break;
                }
                break;
            case 2:
                success = theController.goBackToPreviousPhase(jobOpeningSelected);
                if (success) {
                    System.out.println("Opened the phase.");
                } else {
                    System.out.println("No previous phase available.");
                }
                break;
            case 3:
                success = theController.openPhase(jobOpeningSelected);
                if
                (success) {
                    System.out.println("Opened the phase.");
                } else {
                    System.out.println("Failed to open the phase. Either there are no phases available or the phases are not all pending.");
                }
                break;
            case 4:
                theController.saveToRepository(jobOpeningSelected);
                if (jobOpeningSelected.phases().get(Phase.INTERVIEW).status() == Status.COMPLETED){
                    theController.sendEmail(Phase.INTERVIEW, jobOpeningSelected, Status.COMPLETED);
                }
                System.out.println("Job opening saved. Exiting...");
                validOption = false;
                break;
            case 5:
                validOption = false;
                break;
            default:
                System.out.println("Invalid option. Please choose a valid option.");
                break;
        }
    }
    return true;
}
```

## Class ResultProcessNotificationController
```java
public void sendEmail(Phase phase, JobOpening jobOpening, Status status) {
    jobOpeningSvc.sendEmail(phase, jobOpening, status);
}
```

## Class EmailServiceTest
```java
public boolean sendNotification(String destination, String subject, String message){

    try {
        Email email = new SimpleEmail();
        email.setHostName("frodo.dei.isep.ipp.pt");
        email.setSmtpPort(25);
        email.setSSLOnConnect(false);
        email.setFrom("customermanager@jobs4u.com", "Customer Manager");
        email.setSubject(subject);
        email.setMsg(message);
        email.addTo(destination);
        email.send();
        return true;
    } catch (EmailException e) {
        throw new RuntimeException(e);
    }
}

public boolean sendEmail(JobOpening jobOpening, Status status){
    String email = jobOpening.customer().user().email().toString();
    String subject = "Jobs4U - The Job Opening " + jobOpening.jobTitle() + " has a new phase";
    String message = "The phase of job opening " +
            jobOpening.jobTitle() + " has been altered to " + status.status();
    return sendNotification(email, subject, message);
}
```

# 6. Integration and Demo 

* This functionality has been integrated with the job opening management feature for opening/closing job vacancies.

# 7. Observations

* To run this Use Case, check the Integration and Demonstration section in this Use Case [Read Me](../README.md) file.