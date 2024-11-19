using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.Surgeries;
using Domain.OperationTypes;
using Domain.Staffs;

namespace DDDNetCore.PrologIntegrations
{
    public class PrologIntegration
    {
        // Services
        private readonly PrologService _prologService;
        private readonly PrologIntegrationService _prologIntegrationService;
        private readonly StaffService _staffService;
        private readonly AppointmentService _appointmentService;
        private readonly SurgeryRoomService _surgeryRoomService;
        private readonly OperationTypeService _operationTypeService;
        private readonly OperationRequestService _operationRequestService;

        // Knowledge Base
        // private readonly Dictionary<string, List<string>> _staff; //remove comma and add ]).
        // private readonly Dictionary<string, List<string>> _agendaStaff; //remove comma and add ]).
        // private readonly Dictionary<string, string> _timetable; //already closed
        // private readonly Dictionary<string, List<string>> _surgery; //remove comma and add ).
        private readonly List<string> _staff; //remove comma and add ]).
        private readonly List<string> _agendaStaff; //remove comma and add ]).
        private readonly List<string> _timetable; //already closed
        private readonly List<string> _surgery; //remove comma and add ).
        private readonly List<string> _surgeryId; //already closed
        private readonly List<string> _assignmentSurgery; //already closed

        public PrologIntegration(PrologService prologService, PrologIntegrationService prologIntegrationService,
            StaffService staffService, AppointmentService appointmentService, SurgeryRoomService surgeryRoomService,
            OperationTypeService operationTypeService, OperationRequestService operationRequestService)
        {
            _prologService = prologService;
            _prologIntegrationService = prologIntegrationService;
            _staffService = staffService;
            _appointmentService = appointmentService;
            _surgeryRoomService = surgeryRoomService;
            _operationTypeService = operationTypeService;
            _operationRequestService = operationRequestService;

            _staff = [];
            _agendaStaff = [];
            _timetable = [];
            _surgery = [];
            _surgeryId = [];
            _assignmentSurgery = [];
        }

        public async Task<bool> RunProlog(string date)
        {
            try
            {
                var dateFormat = DateTime.Parse(date);

                if (await CreateKnowledgeBaseText(dateFormat))
                {
                    if (await _prologIntegrationService.CreateFile(_staff, _agendaStaff, _timetable, _surgery,
                            _surgeryId, _assignmentSurgery, dateFormat))
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
                var list = await _appointmentService.GetByDateAsync(new AppointmentDate(date));

                if (list == null || list.Count == 0)
                {
                    return false;
                }

                //organize data

                foreach (var item in list)
                {
                    var request = await _operationRequestService.GetFilteredAsync(
                        item.OperationRequestId.Value,
                        null, null, null, null, null, null);

                    if (request.Count == 0) return false;

                    var staffDto = await _staffService.GetByLicenseNumber(request[0].Staff);

                    if (staffDto == null)
                    {
                        throw new ArgumentException("Staff not found; Fix the appointment");
                    }

                    await PopulateStaff(item, staffDto);
                    PopulateAgendaStaffAndTimetable(item, staffDto, date);

                    await PopulateSurgeryAndSurgeryId(item);
                    PopulateAssignmentSurgery(item, staffDto);
                }

                CloseLists();

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private async Task PopulateStaff(Appointment appointment, StaffDto staff)
        {
            // staff(d001,doctor,orthopaedist,[so2,so3,so4]).
            //staff(license number, 'doctor', specialization, [op. types associated]).

            var firstChar = staff.LicenseNumber.Value[0];

            if (char.ToUpper(firstChar) == 'D')
            {
                //populate staff
                var value = "staff(" + staff.LicenseNumber + ",doctor," + staff.Specialization + ",[";

                var operationRequest = await _operationRequestService.GetFilteredAsync(
                    appointment.OperationRequestId.Value,
                    null, null, null, null, null, null);

                if (operationRequest.Count != 1) throw new ArgumentException("Operation Request not found; Fix the appointment");

                var operationTypeValue = "'" + operationRequest[0].OperationType.Value + "',";

                var existingString = this._staff.FirstOrDefault(s => s.StartsWith(value));

                if (existingString != null)
                {
                    int index = this._staff.IndexOf(existingString);
                    this._staff[index] = existingString + operationTypeValue;
                }
                else
                {
                    this._staff.Add(value + operationTypeValue);
                }

                // if (this._staff.ContainsKey(value))
                // {
                //     if (!this._staff[value].Contains(operationTypeValue)) {
                //         var list = this._staff[value];
                //         list.Add(operationTypeValue);
                //         this._staff[value] = list;
                //     }
                // }
                
                // else this._staff.Add(value, [operationTypeValue]);
            }
        }

        private void PopulateAgendaStaffAndTimetable(Appointment appointment, StaffDto staff, DateTime date)
        {
            var firstChar = staff.LicenseNumber.Value[0];

            if (char.ToUpper(firstChar) == 'D') 
            {
                //populate agenda_staff
                //agenda_staff(d001,20241028,[(720,840,m01),(1080,1200,c01)]).
                string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
                string value = "agenda_staff(" + staff.LicenseNumber + "," + dateFormat + ",";

                int startToMinutes;
                int endToMinutes;
                var existingString = "";
                //fill with appointment slots
                foreach (var slot in staff.SlotAppointement)
                {
                    if (slot.Start.Date != date.Date || slot.End.Date != date) continue;

                    startToMinutes = slot.Start.Hour * 60 + slot.Start.Minute;
                    endToMinutes = slot.End.Hour * 60 + slot.End.Minute;
                    var slotValue = "(" + startToMinutes + "," + endToMinutes + "," + appointment.AppointmentNumber + "),";

                    existingString = this._agendaStaff.FirstOrDefault(s => s.StartsWith(value));

                    if (existingString != null)
                    {
                        int index = this._agendaStaff.IndexOf(existingString);
                        this._agendaStaff[index] = existingString + slotValue;
                    }
                    else
                    {
                        this._agendaStaff.Add(value + slotValue);
                    }

                    // if (this._agendaStaff.ContainsKey(value))
                    // {
                    //     if (!this._agendaStaff[value].Contains(slotValue))
                    //         this._agendaStaff[value].Add(slotValue);
                    // }
                    // else this._agendaStaff[value].Add(slotValue);
                }

                //populate timetable
                //timetable(d003,20241028,(600,1320)).
                value = "timetable(" + staff.LicenseNumber + "," + dateFormat + ",";

                //fill with timetable
                DateTime start = new DateTime();
                DateTime end = new DateTime();

                foreach (var slot in staff.SlotAvailability)
                {
                    if (slot.Start.Date != date.Date || slot.End.Date != date.Date) continue;

                    if (start == new DateTime() || end == new DateTime())
                    {
                        start = slot.Start;
                        end = slot.End;
                        continue;
                    }

                    if (slot.Start < start)
                        start = slot.Start;
                    if (slot.End > end)
                        end = slot.End;
                }

                if (end < start)
                    throw new ArgumentException("Invalid Timetable; Fix Slot");

                startToMinutes = start.Hour * 60 + start.Minute;
                endToMinutes = end.Hour * 60 + end.Minute;
                string timetable = "(" + startToMinutes + "," + endToMinutes + ")).";

                existingString = this._timetable.FirstOrDefault(s => s.StartsWith(value));

                if (existingString != null)
                {
                    int index = this._timetable.IndexOf(existingString);
                    this._timetable[index] = value + timetable;
                }
                else
                {
                    this._timetable.Add(value + timetable);
                }

                // if (this._timetable.ContainsKey(value))
                // {
                //     if (!this._timetable[value].Contains(timetable))
                //         this._timetable.Add(value, timetable);
                // }
                // else this._timetable.Add(value, timetable);
            }
        }

        private async Task PopulateSurgeryAndSurgeryId(Appointment appointment)
        {   //populate operation types
            //%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).

            // surgery(so2,45,60,45).

            var operationRequest = await _operationRequestService.GetFilteredAsync(
                appointment.OperationRequestId.Value,
                null, null, null, null, null, null);

            if (operationRequest.Count != 1) return;

            var operationType = await _operationTypeService.GetByNameAsync(operationRequest[0].OperationType);

            if (operationType == null)
                throw new ArgumentException("Operation Type not found; Fix the appointment");

            string value = "surgery('" + operationType.Name.Value + "',";

            var existingString = "";

            foreach (var phase in operationType.PhasesDuration.Phases)
            {
                var phaseValue = phase.Value.Value + ",";

                existingString = this._surgery.FirstOrDefault(s => s.StartsWith(value));

                if (existingString != null)
                {
                    int index = this._surgery.IndexOf(existingString);
                    this._surgery[index] = existingString + phaseValue;
                }
                else
                {
                    this._surgery.Add(value + phaseValue);
                }
                // if (this._surgery.ContainsKey(value))
                // {
                    
                //     if (!this._surgery[value].Contains(phaseValue))
                //     {
                //         var list = this._surgery[value];
                //         list.Add(phaseValue);
                //         this._surgery[value] = list;
                //     }
                // }
                // else this._surgery.Add(value, [phaseValue]);
            }
            
            
            //populate surgery_id
            //surgery_id(so100001,s02).
            value = "surgery_id(" + appointment.AppointmentNumber.Value + ",'" + operationType.Name.Value + "').";

            if (!this._surgeryId.Contains(value)) this._surgeryId.Add(value);
        }
        private void PopulateAssignmentSurgery(Appointment appointment, StaffDto staff)
        {
            //populate assignment surgery
            //assignment_surgery(so100001,d001).

            string value = "assignment_surgery(" + appointment.AppointmentNumber + "," + staff.LicenseNumber + ").";

            if(!this._assignmentSurgery.Contains(value)) _assignmentSurgery.Add(value);
        }

        private void CloseLists()
        {
            for (int i = 0; i < this._staff.Count; i++)
            {
                this._staff[i] = this._staff[i].Substring(0, this._staff[i].Length - 1) + "]).";
            }

            for (int i = 0; i < this._agendaStaff.Count; i++)
            {
                this._agendaStaff[i] = this._agendaStaff[i].Substring(0, this._agendaStaff[i].Length - 1) + "]).";
            }

            for (int i = 0; i < this._surgery.Count; i++)
            {
                this._surgery[i] = this._surgery[i].Substring(0, this._surgery[i].Length - 1) + ").";
            }
        }
    }
}