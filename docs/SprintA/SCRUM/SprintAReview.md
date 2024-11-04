# Sprint A Review

## Sprint Overview

- **Sprint Duration**: September 30, 2024 - October 27, 2024
- **Sprint Goal**: Develop the software architecture artifacts and the core functionalities of the backoffice system, focusing on user management, patient management, and operation requisitions.
- **Scrum Master**: Tiago Carvalho, 1221124

## Objectives and Achievements

### Objectives

1. Develop the software architecture artifacts, including the domain model, components diagram, and deployment view.
2. Implement core functionalities for user management, patient management, and operation requisitions.
3. Develop unit, integration, and system tests to ensure the robustness of the system.
4. Deliver a functional increment that stakeholders can review and provide feedback on.

### Achievements

1. **Use Cases Implemented**:
    - Successfully implemented all assigned use cases, though a few minor requirements are still pending.
2. **Testing**:
    - **Unit Tests**: Developed and executed several unit tests. Some tests passed, while others revealed issues that need addressing.
    - **Integration Tests**: Created integration tests to verify the interaction between different components. Encountered some errors that are being debugged.

## Use Case Distribution and Status

### Beatriz Silva, 1200347

- **UC002 (US5.1.2)**: Reset password functionality for backoffice users (via IAM).
- **UC012 (US5.1.12)**: Create new staff profile.
- **UC013 (US5.1.13)**: Edit staff profile.
- **UC014 (US5.1.14)**: Deactivate staff profile.
- **UC015 (US5.1.15)**: List/search staff profiles.

### David Sousa, 1220784

- **UC006 (US5.1.6)**: Log in to the backoffice system (via IAM).
- **UC007 (US5.1.7)**: Patient login using external IAM credentials (via IAM).
- **UC016 (US5.1.16)**: Request an operation.
- **UC017 (US5.1.17)**: Update operation requisition.
- **UC018 (US5.1.18)**: Remove operation requisition.
- **UC019 (US5.1.19)**: List/search operation requisitions.

### Guilherme Ribeiro, 1220786

- **UC004 (US5.1.4)**: Update patient profile.
- **UC005 (US5.1.5)**: Delete patient account and data.
- **UC008 (US5.1.8)**: Create new patient profile.
- **UC009 (US5.1.9)**: Edit patient profile.
- **UC010 (US5.1.10)**: Delete patient profile.
- **UC011 (US5.1.11)**: List/search patient profiles.

### Tiago Carvalho, 1221124

- **UC001 (US5.1.1)**: Register new backoffice users (via IAM).
- **UC003 (US5.1.3)**: Patient registration for healthcare application (via IAM).
- **UC020 (US5.1.20)**: Add new types of operations.
- **UC021 (US5.1.21)**: Edit existing operation types.
- **UC022 (US5.1.22)**: Remove obsolete operation types.
- **UC023 (US5.1.23)**: List/search operation types.

## Pending Work and Issues

- Some minor requirements for the use cases are pending completion and will be addressed in the next sprint.
- Several tests (unit, integration, and system) encountered errors. These issues are documented and prioritized for fixing in the upcoming sprint.

## Next Steps

1. Address pending requirements for the implemented use cases.
2. Debug and resolve issues found in the tests.
3. Refine and enhance the testing framework to ensure higher coverage and reliability.
4. Prepare for the next sprint planning to continue building on the current progress.

## Conclusion

The sprint has successfully delivered the core functionalities of the backoffice system, with most use cases fully implemented and tested. Although some tests revealed issues, the team has documented and prioritized these for resolution. Stakeholder feedback during the Sprint Review will guide the adjustments and improvements for the next sprint.
