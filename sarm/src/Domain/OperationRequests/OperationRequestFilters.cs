using Domain.OperationRequests;
using Domain.Shared;
using Domain.Staffs;

namespace DDDNetCore.Domain.OperationRequests
{
    public class OperationRequestFilters
    {
        public Guid SearchId { get; set; }
        public LicenseNumber SearchLicenseNumber { get; set; }
        public FullName SearchPatientName { get; set; }
        public Name SearchOperationType { get; set; }
        public DeadlineDate SearchDeadlineDate { get; set; }
        public Priority SearchPriority { get; set; }
        public RequestStatus SearchRequestStatus { get; set; }

        public OperationRequestFilters(Guid searchId, LicenseNumber searchLicenseNumber, FullName searchPatientName, Name searchOperationType, DeadlineDate searchDeadlineDate, Priority searchPriority, RequestStatus searchRequestStatus)
        {
            SearchId = searchId;
            SearchLicenseNumber = searchLicenseNumber ?? new LicenseNumber();
            SearchPatientName = searchPatientName ?? new FullName("");
            SearchOperationType = searchOperationType ?? new Name("");
            SearchDeadlineDate = searchDeadlineDate ?? new DeadlineDate();
            SearchPriority = searchPriority;
            SearchRequestStatus = searchRequestStatus;
        }
    }
}