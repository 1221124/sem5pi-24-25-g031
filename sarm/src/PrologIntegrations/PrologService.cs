using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
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

        // Knowledge Base
        // private readonly Dictionary<string, List<string>> _staff; //remove comma and add ]).
        // private readonly Dictionary<string, List<string>> _agendaStaff; //remove comma and add ]).
        // private readonly Dictionary<string, string> _timetable; //already closed
        // private readonly Dictionary<string, List<string>> _surgery; //remove comma and add ).
        private readonly List<string> _agendaStaff;
        private readonly List<string> _timetable;
        private readonly List<string> _staff;
        private readonly List<string> _surgery;
        private readonly List<string> _surgeryId;
        private readonly List<string> _assignmentSurgery;
        private readonly List<string> _agendaOperationRoom;

        public PrologService(
            AppointmentService appointmentService,
            StaffService staffService,
            OperationTypeService operationTypeService,
            OperationRequestService operationRequestService)
        {
            _appointmentService = appointmentService;
            _staffService = staffService;
            _operationTypeService = operationTypeService;
            _operationRequestService = operationRequestService;

            _agendaStaff = [];
            _timetable = [];
            _staff = [];
            _surgery = [];
            _surgeryId = [];
            _assignmentSurgery = [];
            _agendaOperationRoom = [];
        }

        public async Task<bool> RunProlog(string date)
        {
            try
            {
                var dateFormat = DateTime.Parse(date);

                if (await CreateKnowledgeBaseText(dateFormat))
                {
                    if (await CreateFile(dateFormat))
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
                {
                    return false;
                }

                await PopulateStaff(staffs);

                var appointments = await _appointmentService.GetByDateAsync(date);

                await PopulateAgendaStaff(appointments, staffs, date);
                PopulateTimetable(staffs, date);

                var operationTypes = await _operationTypeService.GetByStatusAsync(Status.Active);
                if (operationTypes == null || operationTypes.Count == 0)
                {
                    return false;
                }

                PopulateSurgery(operationTypes);

                var dateStr = date.Year.ToString() + "-" + date.Month.ToString("D2") + "-" + date.Day.ToString("D2");
                var operationRequests = await _operationRequestService.GetFilteredAsync(
                    null, null, null, null, dateStr, null, null
                );
                if (operationRequests == null || operationRequests.Count == 0)
                {
                    return false;
                }

                PopulateSurgeryId(operationRequests);

                PopulateAssignmentSurgery(operationRequests);

                PopulateAgendaOperationRoom(appointments, date);

                return true;
            }
            catch (Exception)
            {
                return false;
                throw new Exception("Error creating knowledge base text.");
            }
        }

        private async Task PopulateStaff(List<StaffDto> staffs)
        {
            // staff(d001,doctor,orthopaedist,[so2,so3,so4]).
            //staff(license number, 'doctor', specialization, [op. types associated]).

            foreach (var staff in staffs) {
                if (!staff.LicenseNumber.Value.ToUpper().StartsWith(char.ToUpper('D'))) continue;

                var value = "staff(" + staff.LicenseNumber.Value + ",doctor," + SpecializationUtils.ToString(staff.Specialization) + ",[";

                var operationTypes = await _operationTypeService.GetBySpecializationAsync(staff.Specialization);
                foreach (var operationType in operationTypes)
                {
                    value += "'" + operationType.Name.Value + "',";
                }

                if (value.EndsWith(",")) value = value[..^1];
                value += "]).";

                if (!this._staff.Contains(value)) this._staff.Add(value);
            }
        }

        private async Task PopulateAgendaStaff(List<Appointment> appointments, List<StaffDto> staffs, DateTime date)
        {
            //agenda_staff(d001,20241028,[(720,840,ap01),(1080,1200,ap02)]).
            //agenda_staff(license number, date, [(start, end, appointment number)]).
            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
            foreach(var staff in staffs)
            {
                string value = "agenda_staff(" + staff.LicenseNumber + "," + dateFormat + ",[";

                foreach (var slot in staff.SlotAppointement) {
                    if (slot.Start.Date != date.Date || slot.End.Date != date) continue;

                    var startToMinutes = slot.Start.Hour * 60 + slot.Start.Minute;
                    var endToMinutes = slot.End.Hour * 60 + slot.End.Minute;

                    foreach (var appointment in appointments) {
                        var appointmentSlot = new Slot(appointment.AppointmentDate.Start, appointment.AppointmentDate.End);
                        if (!appointmentSlot.Equals(slot)) continue;

                        var operationRequests = await _operationRequestService.GetFilteredAsync(
                            appointment.OperationRequestId.AsString(), null, null, null, null, null, null
                        );

                        if (operationRequests.Count != 1) throw new ArgumentException("Operation Request not found; Fix the appointment");

                        var operationRequest = operationRequests[0];
                        if (operationRequest.Staff != staff.LicenseNumber) continue;
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
            //timetable(d001,20241028,(720,840)).
            //timetable(license number, date, (start, end)).

            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
            foreach (var staff in staffs) {
                string value = "timetable(" + staff.LicenseNumber + "," + dateFormat + ",(";

                int start = 1440;
                int end = 0;
                foreach (var slot in staff.SlotAvailability) {
                    if (slot.Start.Date != date.Date || slot.End.Date != date) continue;

                    int startToMinutes = slot.Start.Hour * 60 + slot.Start.Minute;
                    int endToMinutes = slot.End.Hour * 60 + slot.End.Minute; 

                    bool changed = false;
                    if (startToMinutes < start) {
                        start = startToMinutes;
                        changed = true;
                    }
                    if (endToMinutes > end) {
                        end = endToMinutes;
                        changed = true;
                    }

                    var existingString = this._timetable.FirstOrDefault(s => s.StartsWith(value));

                    if (existingString != null && changed)
                    {
                        int index = this._timetable.IndexOf(existingString);
                        this._timetable[index] = existingString + start + "," + end + ")).";
                    }
                    else
                    {
                        this._timetable.Add(value + start + "," + end + ")).");
                    }
                }
            }
        }

        private void PopulateSurgery(List<OperationTypeDto> operationTypes) {
            //surgery(so2,45,60,45).
            //surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).
            foreach (var operationType in operationTypes) {
                string value = "surgery(" + operationType.Name.Value + "," + operationType.PhasesDuration.Preparation + "," + operationType.PhasesDuration.Surgery + "," + operationType.PhasesDuration.Cleaning + ").";
                this._surgery.Add(value);
            }
        }

        private void PopulateSurgeryId(List<OperationRequestDto> operationRequests) {
            //surgery_id(so100001,so2).
            //surgery_id(OpRequestId, OpTypeName).
            foreach (var operationRequest in operationRequests) {
                string value = "surgery_id(" + operationRequest.Id + "," + operationRequest.OperationType + ").";
                this._surgeryId.Add(value);
            }
        }
        private void PopulateAssignmentSurgery(List<OperationRequestDto> operationRequests)
        {
            //assignment_surgery(so100001,d001).
            //assignment_surgery(OpRequestId, LicenseNumber).
            foreach (var operationRequest in operationRequests)
            {
                string value = "assignment_surgery(" + operationRequest.Id + "," + operationRequest.Staff + ").";
                this._assignmentSurgery.Add(value);
            }
        }

        private void PopulateAgendaOperationRoom(List<Appointment> appointments, DateTime date)
        {
            //agenda_operation_room(or1,20241028,[(720,840,ap2),(1080,1200,ap3)]).
            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
            foreach (var surgeryRoomNumber in Enum.GetValues(typeof(SurgeryRoomNumber)).Cast<SurgeryRoomNumber>())
            {
                string value = "agenda_operation_room(" + surgeryRoomNumber + "," + dateFormat + ",[";
                foreach(var appointment in appointments)
                {
                    if (appointment.SurgeryRoomNumber != surgeryRoomNumber) continue;

                    var startToMinutes = appointment.AppointmentDate.Start.Hour * 60 + appointment.AppointmentDate.Start.Minute;
                    var endToMinutes = appointment.AppointmentDate.End.Hour * 60 + appointment.AppointmentDate.End.Minute;
                    value += "(" + startToMinutes + "," + endToMinutes + "," + appointment.AppointmentNumber + "),";
                }

                if (value.EndsWith(",")) value = value[..^1];
                value += "]).";

                this._agendaOperationRoom.Add(value);
            }
        }

        public async Task<bool> CreateFile(DateTime date)
        {
            try{
                string content = "";

                foreach (var item in _staff)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _agendaStaff)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _timetable)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _surgery)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _surgeryId)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _assignmentSurgery)
                {
                    content += item + "\n";
                }

                // Navigate to the project root directory safely
                string projectRootPath = AppDomain.CurrentDomain.BaseDirectory;
                for (int i = 0; i < 5; i++) // Navigate up 5 levels
                {
                    var parent = Directory.GetParent(projectRootPath);
                    if (parent == null)
                    {
                        throw new InvalidOperationException("Could not determine the project root directory.");
                    }
                    projectRootPath = parent.FullName;
                }
                
                string directoryPath = Path.Combine(projectRootPath, "PlanningModule", "knowledge_base");

                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                string filePath = Path.Combine(directoryPath, "kb-" + date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2") + ".pl");

                Console.WriteLine($"File path: {filePath}");

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                await File.WriteAllTextAsync(filePath, content);

                if(File.Exists(filePath))
                {
                    return true;
                }
                else
                {
                    return false;
                }

            }catch (Exception e)
            {
                Console.WriteLine($"Error: {e.Message}");
                Console.WriteLine($"Stack Trace: {e.StackTrace}");
                throw new Exception("Error creating file content", e);
            }

        }
    }
}