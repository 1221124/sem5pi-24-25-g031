using System.Text.RegularExpressions;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.OperationTypes;
using Domain.Shared;
using Domain.Staffs;
using Infrastructure;

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
            _agendaOperationRoom = [];
        }

        public async Task<(bool done, string message)> CreateKB(SurgeryRoomNumber surgeryRoomNumber, DateTime date)
        {
            try
            {
                var prologIntegration = await CreateKnowledgeBaseText(surgeryRoomNumber, date);
                if (prologIntegration.done)
                {
                    if (await this._prologIntegrationService.CreateFile(
                        this._staff,
                        this._agendaStaff,
                        this._timetable,
                        this._surgery,
                        this._surgeryId,
                        date))
                    {
                        return (true, prologIntegration.message);
                    }
                }

                return (false, prologIntegration.message);
            }
            catch (Exception e)
            {
                return (false, "Error: Prolog Integration failed - " + e.Message.ToString());
                throw new ArgumentException("Error: Prolog Integration failed - " + e.Message.ToString());
            }
        }

        //create file
        public async Task<(bool done, string message)> CreateKnowledgeBaseText(SurgeryRoomNumber surgeryRoomNumber, DateTime date)
        {
            try
            {
                //obtain data
                var staffs = await _staffService.GetAllAsync();
                if (staffs == null || staffs.Count == 0)
                    return (false, "No staff found.");

                var operationTypes = await _operationTypeService.GetByStatusAsync(Status.Active);
                if (operationTypes == null || operationTypes.Count == 0)
                    return (false, "No operation types found.");

                PopulateStaff(staffs, operationTypes);

                var appointments = await _appointmentService.GetByRoomAndDateAsync(surgeryRoomNumber, date);

                await PopulateAgendaStaff(appointments, staffs, date);
                PopulateTimetable(staffs, date);

                PopulateSurgery(operationTypes);

                PopulateSurgeryRequiredStaff(operationTypes);

                var dateStr = date.Year.ToString() + "-" + date.Month.ToString("D2") + "-" + date.Day.ToString("D2");

                var pendingOperationRequests = await _operationRequestService.GetFilteredAsync(
                    null, null, null, null, null, null, RequestStatusUtils.ToString(RequestStatus.PENDING)
                );
                var rejectedOperationRequests = await _operationRequestService.GetFilteredAsync(
                    null, null, null, null, null, null, RequestStatusUtils.ToString(RequestStatus.REJECTED)
                );

                var operationRequests = pendingOperationRequests.Concat(rejectedOperationRequests).ToList();
                if (operationRequests == null || operationRequests.Count == 0)
                    return (false, "No operation requests found.");
                
                //only the first AppSettings.MaxOperations will be considered
                int appointmentsCount = appointments.Count;

                if (appointmentsCount >= int.Parse(AppSettings.MaxOperations))
                    return (false, "Max number of operations reached.");

                operationRequests = operationRequests.Take(int.Parse(AppSettings.MaxOperations) - appointmentsCount).ToList();
                
                //order by date (closest first)
                operationRequests = operationRequests.OrderBy(x => x.DeadlineDate).ToList();

                PopulateSurgeryId(operationRequests);

                var surgeryRooms = await _surgeryRoomService.GetAll();
                if (surgeryRooms == null || surgeryRooms.Count == 0)
                    return (false, "No surgery rooms found.");

                dateStr = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
                PopulateAgendaOperationRoom(surgeryRooms, appointments, dateStr);

                return (true, "Knowledge base text created successfully.");
            }
            catch (Exception)
            {
                return (false, "Error creating knowledge base text.");
                throw new Exception("Error creating knowledge base text.");
            }
        }

        private void PopulateStaff(List<StaffDto> staffs, List<OperationTypeDto> operationTypes)
        {
            // staff(d20241,doctor,orthopaedics,[aCL_Reconstruction_Surgery,...]).
            //staff(license number, role, specialization, [op. types associated]).

            foreach (var staff in staffs) {
                var licenseNumber = staff.LicenseNumber.Value;
                licenseNumber = char.ToLower(licenseNumber[0]) + licenseNumber[1..];

                var specialization = SpecializationUtils.ToString(staff.Specialization).Replace(" ", "_").Replace("-", "_");
                specialization = char.ToLower(specialization[0]) + specialization[1..];

                var staffRole = StaffRoleUtils.ToString(staff.StaffRole);
                staffRole = char.ToLower(staffRole[0]) + staffRole[1..];

                var value = "staff(" + licenseNumber + "," + staffRole + "," + specialization + ",[";

                if (SpecializationUtils.IsCardiologyOrOrthopaedics(staff.Specialization))
                {
                    operationTypes = operationTypes.FindAll(o => o.Specialization == staff.Specialization);
                }
                foreach (var operationType in operationTypes) {
                    var name = operationType.Name.Value.Replace(" ", "_").Replace("-", "_");
                    name = char.ToLower(name[0]) + name[1..];
                    value += name + ",";
                }
                if (value.EndsWith(",")) value = value[..^1];
                value += "]).";

                this._staff.Add(value);
            }
        }

        private async Task PopulateAgendaStaff(List<Appointment> appointments, List<StaffDto> staffs, DateTime date)
        {
            //agenda_staff(d20241,20241028,[(720,840,ap01),(1080,1200,ap02)]).
            //agenda_staff(license number, date, [(start, end, appointment number)]).
            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
            foreach(var staff in staffs)
            {
                var licenseNumber = staff.LicenseNumber.Value;
                licenseNumber = char.ToLower(licenseNumber[0]) + licenseNumber[1..];
                string value = "agenda_staff(" + licenseNumber + "," + dateFormat + ",[";

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
            //timetable(d20241,20241028,(720,840)).
            //timetable(license number, date, (start, end)).

            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
            foreach (var staff in staffs) {
                var licenseNumber = staff.LicenseNumber.Value;
                licenseNumber = char.ToLower(licenseNumber[0]) + licenseNumber[1..];
                string value = "timetable(" + licenseNumber + "," + dateFormat + ",(";

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
            //surgery(aCL_Reconstruction_Surgery,45,60,45).
            //surgery(OperationTypeName,TPreparation,TSurgery,TCleaning).
            foreach (var operationType in operationTypes) {
                var name = operationType.Name.Value.Replace(" ", "_").Replace("-", "_");
                name = char.ToLower(name[0]) + name[1..];
                string value = "surgery(" + name + "," + operationType.PhasesDuration.Preparation + "," + operationType.PhasesDuration.Surgery + "," + operationType.PhasesDuration.Cleaning + ").";
                this._surgery.Add(value);
            }
        }

        private void PopulateSurgeryRequiredStaff(List<OperationTypeDto> operationTypes) {
            //required_staff(aCL_Reconstruction_Surgery,doctor,orthopaedics,3).
            //required_staff(OperationTypeName,Role,Specialization,Quantity).
            foreach (var operationType in operationTypes) {
                var name = operationType.Name.Value.Replace(" ", "_").Replace("-", "_");
                name = char.ToLower(name[0]) + name[1..];

                foreach (var staff in operationType.RequiredStaff) {
                    var role = RoleUtils.ToString(staff.Role);
                    role = char.ToLower(role[0]) + role[1..];

                    var specialization = SpecializationUtils.ToString(staff.Specialization).Replace(" ", "_").Replace("-", "_");
                    specialization = char.ToLower(specialization[0]) + specialization[1..];
                    
                    string value = "required_staff(" + name + "," + role + "," + specialization + "," + staff.Quantity.Value + ").";
                    this._surgeryRequiredStaff.Add(value);
                }
            }
        }

        private void PopulateSurgeryId(List<OperationRequestDto> operationRequests) {
            //surgery_id(ad3d1623_292a_43e0_97c3_48fa8d847a46,aCL_Reconstruction_Surgery).
            //surgery_id(OperationReqId, OpTypeName).
            foreach (var operationRequest in operationRequests) {
                var id = operationRequest.Id.ToString().Replace("-", "_");
                var operationType = operationRequest.OperationType.Value.Replace(" ", "_").Replace("-", "_");
                operationType = char.ToLower(operationType[0]) + operationType[1..];
                string value = "surgery_id(" + id + "," + operationType + ").";
                this._surgeryId.Add(value);
            }
        }

        private void PopulateAgendaOperationRoom(List<SurgeryRoom> surgeryRooms, List<Appointment> appointments, string date)
        {
            //agenda_operation_room(or1,20241028,[(720,840,ap2),(1080,1200,ap3)]).
            foreach (var surgeryRoom in surgeryRooms)
            {
                string value = "agenda_operation_room(" + SurgeryRoomNumberUtils.ToString(surgeryRoom.SurgeryRoomNumber).ToLower() + "," + date + ",[";
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

        public PrologResponse RunPrologEngine(SurgeryRoomNumber surgeryRoomNumber, DateTime date)
        {
            var command = _prologIntegrationService.PreparePrologCommand(surgeryRoomNumber, date);
            var response = _prologIntegrationService.RunPrologEngine(command);
            return _prologIntegrationService.ParsePrologResponse(response);
        }
    }
}