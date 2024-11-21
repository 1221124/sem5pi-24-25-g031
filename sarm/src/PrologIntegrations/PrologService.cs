using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationRequests;
using Domain.OperationTypes;
using Domain.Shared;
using Domain.Staffs;

namespace DDDNetCore.PrologIntegrations
{
    public class PrologService
    {
        private readonly AppointmentService _appointmentService;
        private readonly StaffService _staffService;
        private readonly OperationTypeService _operationTypeService;
        private readonly OperationRequestService _operationRequestService;
        private readonly SurgeryRoomService _surgeryRoomService;
        private readonly PrologIntegrationService _prologIntegrationService;
        private readonly List<string> _agendaStaff;
        private readonly List<string> _timetable;
        private readonly List<string> _staff;
        private readonly List<string> _surgery;
        private readonly List<string> _surgeryRequiredStaff;
        private readonly List<string> _surgeryId;
        // private readonly List<string> _assignmentSurgery;
        private readonly List<string> _agendaOperationRoom;

        public PrologService(
            AppointmentService appointmentService,
            StaffService staffService,
            OperationTypeService operationTypeService,
            OperationRequestService operationRequestService,
            SurgeryRoomService surgeryRoomService,
            PrologIntegrationService prologIntegrationService)
        {
            _appointmentService = appointmentService;
            _staffService = staffService;
            _operationTypeService = operationTypeService;
            _operationRequestService = operationRequestService;
            _surgeryRoomService = surgeryRoomService;
            _prologIntegrationService = prologIntegrationService;

            _agendaStaff = [];
            _timetable = [];
            _staff = [];
            _surgery = [];
            _surgeryRequiredStaff = [];
            _surgeryId = [];
            // _assignmentSurgery = [];
            _agendaOperationRoom = [];
        }

        public async Task<bool> RunProlog(string date)
        {
            try
            {
                var dateFormat = DateTime.Parse(date);

                if (await CreateKnowledgeBaseText(dateFormat))
                {
                    if (await this._prologIntegrationService.CreateFile(
                        this._staff,
                        this._agendaStaff,
                        this._timetable,
                        this._surgery,
                        this._surgeryId,
                        dateFormat))
                    {
                        return true;
                    }
                }

                return false;
            }
            catch (Exception e)
            {
                throw new ArgumentException("Error: Prolog Integration failed - " + e.Message.ToString());
            }
        }

        //create file
        public async Task<bool> CreateKnowledgeBaseText(DateTime date)
        {
            try
            {
                //obtain data
                var staffs = await _staffService.GetAllAsync();
                if (staffs == null || staffs.Count == 0)
                    return false;

                var operationTypes = await _operationTypeService.GetByStatusAsync(Status.Active);
                if (operationTypes == null || operationTypes.Count == 0)
                    return false;

                await PopulateStaff(staffs, operationTypes);

                var appointments = await _appointmentService.GetByDateAsync(date);

                await PopulateAgendaStaff(appointments, staffs, date);
                PopulateTimetable(staffs, date);

                PopulateSurgery(operationTypes);

                PopulateSurgeryRequiredStaff(operationTypes);

                var dateStr = date.Year.ToString() + "-" + date.Month.ToString("D2") + "-" + date.Day.ToString("D2");

                var pendingOperationRequests = await _operationRequestService.GetFilteredAsync(
                    null, null, null, null, dateStr, null, RequestStatusUtils.ToString(RequestStatus.PENDING)
                );
                var rejectedOperationRequests = await _operationRequestService.GetFilteredAsync(
                    null, null, null, null, dateStr, null, RequestStatusUtils.ToString(RequestStatus.REJECTED)
                );

                var operationRequests = pendingOperationRequests.Concat(rejectedOperationRequests).ToList();
                if (operationRequests == null || operationRequests.Count == 0)
                    return false;
                operationRequests = operationRequests.OrderBy(x => x.DeadlineDate).ToList();

                PopulateSurgeryId(operationRequests);

                // PopulateAssignmentSurgery(operationRequests);

                var surgeryRooms = await _surgeryRoomService.GetAll();
                if (surgeryRooms == null || surgeryRooms.Count == 0)
                    return false;

                PopulateAgendaOperationRoom(surgeryRooms, appointments, date);

                return true;
            }
            catch (Exception)
            {
                return false;
                throw new Exception("Error creating knowledge base text.");
            }
        }

        private async Task PopulateStaff(List<StaffDto> staffs, List<OperationTypeDto> operationTypes)
        {
            // staff(D20241,Doctor,'Orthopaedics',['ACL Reconstruction Surgery',...]).
            //staff(license number, role, 'specialization', [op. types associated]).

            foreach (var staff in staffs) {
                var value = "staff(" + staff.LicenseNumber.Value + "," + StaffRoleUtils.ToString(staff.StaffRole) + ",'" + SpecializationUtils.ToString(staff.Specialization) + "',[";

                if (SpecializationUtils.IsCardiologyOrOrthopaedics(staff.Specialization))
                {
                    var specializationOperationTypes = operationTypes.FindAll(o => o.Specialization == staff.Specialization);
                    foreach (var operationType in specializationOperationTypes)
                    {
                        value += "'" + operationType.Name.Value + "',";
                    }
                } else {
                    foreach (var operationType in operationTypes)
                    {
                        value += "'" + operationType.Name.Value + "',";
                    }
                }

                if (value.EndsWith(",")) value = value[..^1];
                value += "]).";

                this._staff.Add(value);
            }
        }

        private async Task PopulateAgendaStaff(List<Appointment> appointments, List<StaffDto> staffs, DateTime date)
        {
            //agenda_staff(D20241,20241028,[(720,840,ap01),(1080,1200,ap02)]).
            //agenda_staff(license number, date, [(start, end, appointment number)]).
            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
            foreach(var staff in staffs)
            {
                string value = "agenda_staff(" + staff.LicenseNumber.Value + "," + dateFormat + ",[";

                foreach (var slot in staff.SlotAppointement) {
                    if (slot.Start.Date != date.Date || slot.End.Date != date) continue;

                    var startToMinutes = slot.Start.Hour * 60 + slot.Start.Minute;
                    var endToMinutes = slot.End.Hour * 60 + slot.End.Minute;

                    foreach (var appointment in appointments) {
                        var appointmentSlot = new Slot(appointment.AppointmentDate.Start, appointment.AppointmentDate.End);
                        if (!appointmentSlot.Equals(slot)) continue;

                        var operationRequests = await _operationRequestService.GetFilteredAsync(
                            appointment.OperationRequestId.AsString(), null, null, null, null, null, RequestStatusUtils.ToString(RequestStatus.ACCEPTED)
                        );

                        if (operationRequests.Count != 1) throw new ArgumentException("Operation Request not found; Fix the appointment");

                        var operationRequest = operationRequests[0];
                        if (operationRequest.Staff.Value != staff.LicenseNumber.Value) continue;
                        else {
                            value += "(" + startToMinutes + "," + endToMinutes + "," + appointment.AppointmentNumber + "),";
                            break;
                        }
                    }
                }

                if (value.EndsWith(",")) value = value[..^1];
                value += "]).";
            }
        }

        private void PopulateTimetable(List<StaffDto> staffs, DateTime date) {
            //timetable(D20241,20241028,(720,840)).
            //timetable(license number, date, (start, end)).

            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
            foreach (var staff in staffs) {
                string value = "timetable(" + staff.LicenseNumber.Value + "," + dateFormat + ",(";

                int start = 1440;
                int end = 0;
                foreach (var slot in staff.SlotAvailability) {
                    if (slot.Start.Date != date.Date || slot.End.Date != date) continue;

                    int startToMinutes = slot.Start.Hour * 60 + slot.Start.Minute;
                    int endToMinutes = slot.End.Hour * 60 + slot.End.Minute; 

                    if (startToMinutes < start) {
                        start = startToMinutes;
                    }
                    if (endToMinutes > end) {
                        end = endToMinutes;
                    }
                }
                this._timetable.Add(value + start + "," + end + ")).");
            }
        }

        private void PopulateSurgery(List<OperationTypeDto> operationTypes) {
            //surgery('ACL Reconstruction Surgery',45,60,45).
            //surgery('OperationTypeName',TPreparation,TSurgery,TCleaning).
            foreach (var operationType in operationTypes) {
                string value = "surgery('" + operationType.Name.Value + "'," + operationType.PhasesDuration.Preparation + "," + operationType.PhasesDuration.Surgery + "," + operationType.PhasesDuration.Cleaning + ").";
                this._surgery.Add(value);
            }
        }

        private void PopulateSurgeryRequiredStaff(List<OperationTypeDto> operationTypes) {
            //required_staff('ACL Reconstruction Surgery',[(Doctor,'Orthopaedics',3)]).
            //required_staff('OperationTypeName',[(Role,'Specialization',Quantity)]).
            foreach (var operationType in operationTypes) {
                string value = "required_staff(" + operationType.Name.Value + ",[";
                foreach (var staff in operationType.RequiredStaff) {
                    value += "(" + RoleUtils.ToString(staff.Role) + ",'" + SpecializationUtils.ToString(staff.Specialization) + "'," + staff.Quantity.Value + "),";
                }
                if (value.EndsWith(",")) value = value[..^1];
                value += "]).";
                this._surgeryRequiredStaff.Add(value);
            }
        }

        private void PopulateSurgeryId(List<OperationRequestDto> operationRequests) {
            //surgery_id(ad3d1623-292a-43e0-97c3-48fa8d847a46,'ACL Reconstruction Surgery').
            //surgery_id('OperationReqId', 'OpTypeName').
            foreach (var operationRequest in operationRequests) {
                string value = "surgery_id(" + operationRequest.Id.ToString() + "," + operationRequest.OperationType + ").";
                this._surgeryId.Add(value);
            }
        }

        // private void PopulateAssignmentSurgery(List<OperationRequestDto> operationRequests)
        // {
        //     //assignment_surgery(so100001,d001).
        //     //assignment_surgery(OpRequestId, LicenseNumber).
        //     foreach (var operationRequest in operationRequests)
        //     {
        //         string value = "assignment_surgery(" + operationRequest.Id + "," + operationRequest.Staff + ").";
        //         this._assignmentSurgery.Add(value);
        //     }
        // }

        private void PopulateAgendaOperationRoom(List<SurgeryRoom> surgeryRooms, List<Appointment> appointments, DateTime date)
        {
            //agenda_operation_room(OR1,20241028,[(720,840,ap2),(1080,1200,ap3)]).
            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
            foreach (var surgeryRoom in surgeryRooms)
            {
                string value = "agenda_operation_room(" + SurgeryRoomNumberUtils.ToString(surgeryRoom.SurgeryRoomNumber) + "," + dateFormat + ",[";
                foreach(var appointment in appointments)
                {
                    if (appointment.SurgeryRoomNumber != surgeryRoom.SurgeryRoomNumber) continue;

                    var startToMinutes = appointment.AppointmentDate.Start.Hour * 60 + appointment.AppointmentDate.Start.Minute;
                    var endToMinutes = appointment.AppointmentDate.End.Hour * 60 + appointment.AppointmentDate.End.Minute;
                    value += "(" + startToMinutes + "," + endToMinutes + "," + appointment.AppointmentNumber + "),";
                }

                if (value.EndsWith(",")) value = value[..^1];
                value += "]).";

                this._agendaOperationRoom.Add(value);
            }
        }
    }
}