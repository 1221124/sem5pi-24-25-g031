using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.Surgeries;
using Domain.OperationTypes;
using Domain.Staffs;

namespace DDDNetCore.PrologIntegration.PrologIntegrations
{
    public class PrologIntegration
    {
        private const string KnowledgeBase = "PlanningModule\\knowledge_base";

        // Services
        private readonly PrologService _prologService;
        private readonly PrologIntegrationService _prologIntegrationService;    
        private readonly StaffService _staffService;
        private readonly AppointmentService _appointmentService;
        private readonly SurgeryService _surgeryService;
        private readonly OperationTypeService _operationTypeService;

        // Knowledge Base
        private readonly Dictionary<string, List<string>> staff;
        private readonly Dictionary<string, string> agenda_staff;
        private readonly Dictionary<string, string> timetable;
        private readonly Dictionary<string, string> surgery;
        private readonly Dictionary<string, string> surgery_id;
        private readonly Dictionary<string, string> assignment_surgery;

        public PrologIntegration(PrologService prologService, PrologIntegrationService prologIntegrationService, StaffService staffService, AppointmentService appointmentService, SurgeryService surgeryService, OperationTypeService operationTypeService){
            _prologService = prologService;
            _prologIntegrationService = prologIntegrationService;
            _staffService = staffService;
            _appointmentService = appointmentService;
            _surgeryService = surgeryService;
            _operationTypeService = operationTypeService;

            staff = [];
            agenda_staff = [];
            timetable = [];
            surgery = [];
            surgery_id = [];
            assignment_surgery = [];
        }

        public async Task<bool> RunProlog(string date)
        {
            try{
                var dateFormat = DateTime.Parse(date);

                if(await CreateKnowledgeBaseText(dateFormat))
                {
                    if(await _prologIntegrationService.CreateFile(staff, agenda_staff, timetable, surgery, surgery_id, assignment_surgery, dateFormat))
                    {
                        return true;
                    }
                }

                return false;

            }catch(Exception)
            {
                throw new ArgumentException("Error: Prolog Integration failed");
            }
            
        }

        //create file
        public async Task<bool> CreateKnowledgeBaseText(DateTime date)
        {
            try{
                    
                //obtain data
                var dictionary = await _appointmentService.Planning(new AppointmentDate(date));

                if(dictionary == null || dictionary.Count == 0)
                {
                    return false;
                }

                //organize data

                foreach(var item in dictionary)
                {
                    var staff = await _staffService.GetByLicenseNumber(item.Key.Staff);

                    if(staff == null)
                    {
                        throw new ArgumentException("Staff not found; Fix the appointment");
                    }

                    PopulateStaff(item.Key, item.Value, staff);
                    PopulateAgendaStaffAndTimetable(item.Key, item.Value, staff, date);
                    
                    PopulateSurgery(item.Key, item.Value);
                    PopulateSurgeryId(item.Key, item.Value);
                    PopulateAssignmentSurgery(item.Key, item.Value);

                }
                
                //create file

                string path = KnowledgeBase + "\\" + date.ToString("yyyy-MM-dd") + ".pl";
            
                // Write to file logic here (omitted for brevity)
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        private void PopulateStaff(Appointment appointment, Surgery surgery, StaffDto staff) //fix
        {// staff(d001,doctor,orthopaedist,[so2,so3,so4]).

            char firstChar = staff.LicenseNumber.Value[..1][0];

            if(firstChar == 'D')
            {
                //populate staff
                string value = "staff(" + staff.LicenseNumber + ",doctor," + staff.Specialization + ",[";

                if(this.staff.ContainsKey(value))
                    if(!this.staff[value].Contains(surgery.Name))
                        this.staff[value].Add(surgery.Name);
                    
                else this.staff[value].Add(surgery.Name);
            }
        }

        private void PopulateAgendaStaffAndTimetable(Appointment appointment, Surgery surgery, StaffDto staff, DateTime date)
        {
            char firstChar = staff.LicenseNumber.Value[..1][0];
            string dateFormat = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
        
            if(firstChar == 'D')
            {
                //populate agenda_staff // agenda_staff(d001,20241028,[(720,840,m01),(1080,1200,c01)]).
                string value = "agenda_staff(" + staff.LicenseNumber + "," + dateFormat + ",";

                //fill with appointment stlots
                string slots = string.Empty;

                foreach(var slot in staff.SlotAppointement)
                {
                    if(slot != null)
                        slots += "(" + slot.Start + "," + slot.End + ")";
                    else
                        throw new ArgumentException("Slot not found; Fix Staff Appointment");
                }

                slots = "[" + slots + "]";

                if(this.agenda_staff.ContainsKey(value))
                    if(!this.staff[value].Contains(slots))
                        this.agenda_staff.Add(value, slots);
                    
                else this.agenda_staff.Add(value, slots);

                //populate timetable // timetable(d003,20241028,(600,1320)).

                value = "timetable(" + staff.LicenseNumber + "," + dateFormat + ",";

                //fill with timetable
                DateTime start = staff.SlotAvailability[0].Start;
                DateTime end = staff.SlotAvailability[0].End;

                foreach(var slot in staff.SlotAvailability)
                {
                    if(slot != null)
                    {
                        if(slot.Start < start)
                            start = slot.Start;
                        if(slot.End > end)
                            end = slot.End;
                    }
                    else
                        throw new ArgumentException("Slot not found; Fix Staff Availability");
                }

                if(end < start)
                    throw new ArgumentException("Invalid Timetable; Fix Slot");

                string timetable = "(" + start + "," + end + ")";

                if(this.timetable.ContainsKey(value))
                    if(!this.timetable[value].Contains(timetable))
                        this.timetable.Add(value, timetable);
                    
                else this.timetable.Add(value, timetable);                
            }
        }

        private async void PopulateSurgery(Appointment appointment, Surgery surgery){
            //%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).

            // surgery(so2,45,60,45).

            var operationType = await _operationTypeService.GetByNameAsync(appointment.OperationType);

            if(operationType == null)
                throw new ArgumentException("Operation Type not found; Fix the appointment");

            string value = "surgery(" + surgery.Name + ",";

            string phases = string.Empty;

            foreach(var phase in operationType.PhasesDuration.Phases)
            {
                phases += phase.Key.ToString() + ",";
            }

            value += phases.Remove(phases.Length - 1);  

            if(this.surgery.ContainsKey(value))
                if(!this.surgery[value].Contains(surgery.Name))
                    this.surgery.Add(value, surgery.Name);
                
            else this.surgery.Add(value, surgery.Name);
        }

        private void PopulateSurgeryId(Appointment appointment, Surgery surgery)
        {//surgery_id(so100001,so2).

            string value = "surgery_id(" + surgery.Id + "," + surgery.Name + ")";

            if(this.surgery_id.ContainsKey(value))
                if(!this.surgery_id[value].Contains(surgery.Name))
                    this.surgery_id.Add(value, surgery.Name);
                
            else this.surgery_id.Add(value, surgery.Name);
        }

        private void PopulateAssignmentSurgery(Appointment appointment, Surgery surgery)
        {//assignment_surgery(so100001,d001).
            
                string value = "assignment_surgery(" + surgery.Id + "," + appointment.Staff + ")";
    
                if(this.assignment_surgery.ContainsKey(value))
                    if(!this.assignment_surgery[value].Contains(surgery.Name))
                        this.assignment_surgery.Add(value, surgery.Name);
                    
                else this.assignment_surgery.Add(value, surgery.Name);
        }

    }
}