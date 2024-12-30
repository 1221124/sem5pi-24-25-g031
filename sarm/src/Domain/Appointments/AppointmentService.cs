using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using DDDNetCore.PrologIntegrations;
using Domain.Shared;
using Domain.Staffs;

namespace DDDNetCore.Domain.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _appointmentRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository, IUnitOfWork unitOfWork)
        {
            _appointmentRepository = appointmentRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<AppointmentDto>> GetByRoomAndDateAsync(SurgeryRoomNumber surgeryRoomNumber, DateTime date)
        {
            try {
                var appointments = await _appointmentRepository.GetByRoomAndDateAsync(surgeryRoomNumber, date);
                if (appointments == null || appointments.Count == 0)
                {
                    return null;
                }
                return AppointmentMapper.ToDtoList(appointments);
            } catch (Exception) {
                return null;
            }
        }

        public async Task<AppointmentDto?> GetCurrentInRoomAsync(SurgeryRoomNumber surgeryRoomNumber)
        {
            try {
                Console.WriteLine("Getting current appointment in room: " + surgeryRoomNumber);
                var date = DateTime.Now;
                Console.WriteLine("Date: " + date);
                var appointments = await this.GetByRoomAndDateAsync(surgeryRoomNumber, date);
                Console.WriteLine("Appointments: " + appointments);

                if (appointments == null || appointments.Count == 0) return null;
                Console.WriteLine("Appointments count: " + appointments.Count);

                foreach (var appointment in appointments)
                {
                    Console.WriteLine("Checking appointment: " + appointment);
                    if(appointment.AppointmentDate.Start <= date && appointment.AppointmentDate.End >= date)
                    {
                        Console.WriteLine("Current appointment: " + appointment);
                        return appointment;
                    }
                }

                Console.WriteLine("No current appointment found");
                return null;


            } catch (Exception) {
                return null;
            }
        }

        public async Task<List<AppointmentDto>> GetAll()
        {
            var appointments = await _appointmentRepository.GetAllAsync();
            if (appointments == null || appointments.Count == 0)
            {
                return null;
            }
            return AppointmentMapper.ToDtoList(appointments);
        }

        public async Task<AppointmentDto> AddAsync(CreatingAppointmentDto appointment)
        {
            try
            {
                if (appointment == null)
                    throw new ArgumentNullException(nameof(appointment));

                var newAppointment = AppointmentMapper.ToEntity(appointment);

                await _appointmentRepository.AddAsync(newAppointment);
                await _unitOfWork.CommitAsync();

                return AppointmentMapper.ToDto(newAppointment);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<AppointmentDto> UpdateAsync(AppointmentId id, UpdatingAppointmentDto dto)
        {
            try
            {
                if (dto == null)
                    throw new ArgumentNullException(nameof(dto));

                var appointment = await _appointmentRepository.GetByIdAsync(id);

                if (appointment == null)
                    return null;

                appointment.SurgeryRoomNumber = dto.SurgeryRoomNumber;
                appointment.AppointmentDate = dto.AppointmentDate;
                appointment.AssignedStaff = dto.AssignedStaff;

                await _unitOfWork.CommitAsync();

                return AppointmentMapper.ToDto(appointment);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<(List<RequestCode> requestCodes, List<AppointmentNumber> appointmentNumbers)> CreateAppointmentsAutomatically(DateTime dateTime, Dictionary<SurgeryRoomNumber, PrologResponse> prologResponse)
        {
            try
            {
                var requestCodes = new List<RequestCode>();
                var appointmentNumbers = new List<AppointmentNumber>();

                Console.WriteLine("Creating appointments automatically...");

                foreach (var (surgeryRoomNumber, response) in prologResponse)
                {
                    var surgeryRoom = SurgeryRoomNumberUtils.ToString(surgeryRoomNumber);

                    var appointments = response.AppointmentsGenerated.Split(", ");

                    var staffs = response.StaffAgendaGenerated.Split(new[] { " ; " }, StringSplitOptions.RemoveEmptyEntries);

                    foreach (var appointment in appointments)
                    {
                        Console.WriteLine("Appointment: " + appointment);
                        // var modifiedAppointment = appointment.Substring(1, appointment.Length - 2);
                        var appointmentData = appointment.Split(",");
                        Console.WriteLine("Appointment data: " + appointmentData);

                        var startInMinutes = appointmentData[0];
                        Console.WriteLine("Start in minutes: " + startInMinutes);
                        var endInMinutes = appointmentData[1];
                        Console.WriteLine("End in minutes: " + endInMinutes);
                        var code = appointmentData[2].Trim().ToLower();
                        Console.WriteLine("Code: " + code);

                        var opRequestCode = new RequestCode();
                        var appointmentNumber = new AppointmentNumber();
                        if (code.StartsWith("ap")) {
                            Console.WriteLine("Appointment already exists: " + code);
                            continue;
                        }
                        else if (code.StartsWith("req")) {
                            opRequestCode = new RequestCode(code);
                            var number = code.Substring(3);
                            appointmentNumber = new AppointmentNumber("ap" + number);
                            Console.WriteLine("Request code: " + opRequestCode);
                            Console.WriteLine("Appointment number: " + appointmentNumber);

                            requestCodes.Add(opRequestCode);
                            appointmentNumbers.Add(appointmentNumber);
                        } else {
                            throw new Exception("Invalid code: " + code);
                        }

                        int hours = int.Parse(startInMinutes) / 60;
                        int minutes = int.Parse(startInMinutes) % 60;
                        var startInHours = hours.ToString("D2") + ":" + minutes.ToString("D2");

                        hours = int.Parse(endInMinutes) / 60;
                        minutes = int.Parse(endInMinutes) % 60;
                        var endInHours = hours.ToString("D2") + ":" + minutes.ToString("D2");

                        var startTime = DateTime.ParseExact(startInHours, "HH:mm", null);
                        var endTime = DateTime.ParseExact(endInHours, "HH:mm", null);

                        var start = dateTime.Date.Add(startTime.TimeOfDay);
                        var end = dateTime.Date.Add(endTime.TimeOfDay);

                        var slot = new Slot(start, end);

                        Console.WriteLine("Slot: " + slot);

                        List<LicenseNumber> staff = new List<LicenseNumber>();

                        foreach (var staffData in staffs)
                        {
                            //staff = licenseNumber,[(slotStartInMinutes,slotEndInMinutes,operationRequestCode),...]
                            int index = staffData.IndexOf(',');

                            var licenseNumber = new LicenseNumber(staffData.Substring(0, index).Trim().ToUpper());

                            Console.WriteLine("License number: " + licenseNumber);

                            Console.WriteLine("Staff data: " + staffData);

                            if (staffData[index + 1] == '[' && staffData[index + 2] == ']')
                            {
                                Console.WriteLine("No operations for staff: " + licenseNumber);
                                continue;
                            }

                            //operationsStr = [(slotStartInMinutes,slotEndInMinutes,operationRequestCode),...]
                            var operationsStr = staffData.Substring(index + 1).Trim();

                            //operationsStr = (slotStartInMinutes,slotEndInMinutes,operationRequestCode),(slotStartInMinutes,slotEndInMinutes,operationRequestCode)
                            operationsStr = operationsStr.Substring(1, operationsStr.Length - 2);

                            //operations: each operation = slotStartInMinutes,slotEndInMinutes,operationRequestCode (except first and last operation)
                            var operations = operationsStr.Split(new[] { "),(" }, StringSplitOptions.RemoveEmptyEntries);

                            //remove first character (bracket) from first operation
                            operations[0] = operations[0].Substring(1);

                            //remove last character (bracket) from last operation
                            operations[operations.Length - 1] = operations[operations.Length - 1].Substring(0, operations[operations.Length - 1].Length - 1);
                            
                            foreach (var operation in operations)
                            {
                                Console.WriteLine("Operation: " + operation);
                                var parts = operation.Split(',');

                                if (parts.Length != 3)
                                {
                                    throw new Exception($"Invalid format for: {operation}");
                                }

                                var staffOpRequestCode = parts[2].Trim();
                                if (staffOpRequestCode.StartsWith("ap")) {
                                    Console.WriteLine("Appointment already exists 2: " + staffOpRequestCode);
                                    continue;
                                }
                                var staffAppointmentNumber = new AppointmentNumber("ap" + int.Parse(staffOpRequestCode.Substring(3)));

                                if (!AppointmentNumber.SameValue(staffAppointmentNumber, appointmentNumber)) continue;

                                if (!staff.Contains(licenseNumber)) {
                                    Console.WriteLine("Adding staff" + licenseNumber + "to appointment: " + appointmentNumber);
                                    staff.Add(licenseNumber);
                                }
                            }
                        }
                        
                        var creatingAppointment = new CreatingAppointmentDto(opRequestCode, surgeryRoomNumber, appointmentNumber, slot, staff);

                        var addedAppointment = await AddAsync(creatingAppointment);
                    }

                }

                return (requestCodes, appointmentNumbers);
            }
            catch (Exception e)
            {
                throw new Exception("Error creating appointments automatically: " + e.Message);
            }
        }

        public async Task<AppointmentDto> GetByAppointmentNumberAsync(AppointmentNumber appointmentNumber)
        {
            try
            {
                if (appointmentNumber == null)
                    throw new ArgumentNullException(nameof(appointmentNumber));

                var appointment = await _appointmentRepository.GetByNumberAsync(appointmentNumber);

                if (appointment == null)
                    return null;

                return AppointmentMapper.ToDto(appointment);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<AppointmentDto> DeleteAsync(AppointmentId id)
        {
            var appointment = await this._appointmentRepository.GetByIdAsync(id); 

            if (appointment == null)
                return null;
            
            this._appointmentRepository.Remove(appointment);
            await this._unitOfWork.CommitAsync();

            return AppointmentMapper.ToDto(appointment);
        }

        public async Task<AppointmentDto> GetByRequestCodeAsync(RequestCode requestCode)
        {
            try {
                if (requestCode == null)
                    throw new ArgumentNullException(nameof(requestCode));

                var appointment = await _appointmentRepository.GetByRequestCodeAsync(requestCode);

                if (appointment == null)
                    return null;

                return AppointmentMapper.ToDto(appointment);
            } catch (Exception) {
                return null;
            }
        }

        public async Task<List<AppointmentDto>> GetByLicenseNumberAsync(LicenseNumber licenseNumber)
        {
            try {
                if (licenseNumber == null)
                    throw new ArgumentNullException(nameof(licenseNumber));

                var appointments = await _appointmentRepository.GetByLicenseNumberAsync(licenseNumber);

                if (appointments == null || appointments.Count == 0)
                    return [];

                return AppointmentMapper.ToDtoList(appointments);
            } catch (Exception) {
                return null;
            }
        }

        public async Task<List<AppointmentDto>> GetByStaff(LicenseNumber licenseNumber)
        {
            try {
                if (licenseNumber == null)
                    throw new ArgumentNullException(nameof(licenseNumber));

                var appointments = await _appointmentRepository.GetByLicenseNumberAsync(licenseNumber);

                if (appointments == null || appointments.Count == 0)
                    return [];

                return AppointmentMapper.ToDtoList(appointments);
            } catch (Exception) {
                return null;
            }
        }

        public async Task<List<AppointmentDto>> GetByRequestCodesAsync(List<RequestCode> requestCodes)
        {
            try {
                List<Appointment> appointments = new List<Appointment>();

                foreach (var requestCode in requestCodes)
                {
                    var appointment = await _appointmentRepository.GetByRequestCodeAsync(requestCode);
                    if (appointment != null)
                        appointments.Add(appointment);
                }

                if (appointments == null || appointments.Count == 0)
                    return [];

                return AppointmentMapper.ToDtoList(appointments);
            } catch (Exception) {
                return null;
            }
        }

        public async Task<List<AppointmentDto>> GetByDateAsync(DateTime date)
        {
            try {
                var appointments = await _appointmentRepository.GetByDateAsync(date);
                if (appointments == null || appointments.Count == 0)
                {
                    return null;
                }
                return AppointmentMapper.ToDtoList(appointments);
            } catch (Exception) {
                return null;
            }
        }
    }
}
            