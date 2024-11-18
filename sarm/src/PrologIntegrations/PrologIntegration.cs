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
        private readonly Dictionary<string, List<string>> _staff;
        private readonly Dictionary<string, List<string>> _agendaStaff;
        private readonly Dictionary<string, string> _timetable;
        private readonly Dictionary<string, List<string>> _surgery;
        private readonly List<string> _surgeryId;
        private readonly List<string> _assignmentSurgery;

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
            catch (Exception)
            {
                throw new ArgumentException("Error: Prolog Integration failed");
            }
        }

        //create file
        public async Task<bool> CreateKnowledgeBaseText(DateTime date)
        {
            try
            {
                //obtain data
                var list = await _appointmentService.Planning(new AppointmentDate(date));

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
                    PopulateAgendaStaffAndTimetable(staffDto, date);

                    await PopulateSurgeryAndSurgeryId(item);
                    PopulateAssignmentSurgery(item, staffDto);
                }

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

            var firstChar = staff.LicenseNumber.Value[..1][0];

            if (firstChar == 'D')
            {
                //populate staff
                string value = "staff(" + staff.LicenseNumber + ",doctor," + staff.Specialization + ",[";

                var operationRequest = await _operationRequestService.GetFilteredAsync(
                    appointment.OperationRequestId.Value,
                    null, null, null, null, null, null);

                if (operationRequest.Count != 1) return;

                if (this._staff.ContainsKey(value))
                {
                    if (!this._staff[value].Contains(operationRequest[0].OperationType.Value))
                        this._staff[value].Add(operationRequest[0].OperationType.Value);
                }
                
                else this._staff.Add(value, [operationRequest[0].OperationType.Value]);
            }
        }

        private void PopulateAgendaStaffAndTimetable(StaffDto staff, DateTime date)
        {
            char firstChar = staff.LicenseNumber.Value[..1][0];
            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");

            if (firstChar == 'D')
            {
                //populate agenda_staff // agenda_staff(d001,20241028,[(720,840,m01),(1080,1200,c01)]).
                string value = "agenda_staff(" + staff.LicenseNumber + "," + dateFormat + ",";

                //fill with appointment stlots


                foreach (var slot in staff.SlotAppointement)
                {
                    if (slot.Start.Date != date || slot.End.Date != date) continue;

                    if (this._agendaStaff.ContainsKey(value))
                    {
                        if (!this._staff[value].Contains(slot))
                            this._agendaStaff[value].Add(slot);
                    }
                    else this._agendaStaff[value].Add(slot);
                }

                //populate timetable // timetable(d003,20241028,(600,1320)).
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

                string timetable = "(" + start + "," + end + ")";

                if (this._timetable.ContainsKey(value))
                {
                    if (!this._timetable[value].Contains(timetable))
                        this._timetable.Add(value, timetable);
                }
                else this._timetable.Add(value, timetable);
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

            string value = "surgery(" + operationType.Name.Value + ",";

            foreach (var phase in operationType.PhasesDuration.Phases)
            {
                if (this._surgery.ContainsKey(value))
                {
                    
                    //FIXXXXXXXXXX
                    if (!this._surgery[value].Contains(phase.Value.Value.ToString()))
                    {
                        var list = this._surgery[value];
                        list.Add(phase.);
                        this._surgery[value] = list;
                    }
                }
                else this._surgery.Add(value, [phase.Value.Value.ToString()]);
            }
            
            
            //populate surgery_id
            value = "surgery_id(" + appointment.AppointmentNumber.Value + "," + operationType.Name.Value + ")";

            if (!this._surgeryId.Contains(value)) this._surgeryId.Add(value);
        }
        private void PopulateAssignmentSurgery(Appointment appointment, StaffDto staff)
        {
            //assignment_surgery(so100001,d001).

            string value = "assignment_surgery(" + appointment.AppointmentNumber + "," + staff.LicenseNumber + ")";

            if(!this._assignmentSurgery.Contains(value)) _assignmentSurgery.Add(value);
        }
    }
}