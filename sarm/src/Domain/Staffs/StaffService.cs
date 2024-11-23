using System.Text.RegularExpressions;
using DDDNetCore.Domain.Appointments;
using DDDNetCore.PrologIntegrations;
using Domain.DbLogs;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IStaffRepository _repo;

        private readonly IUserRepository _userRepo;
        
        private readonly DbLogService _dbLogService;

        private static readonly EntityType StaffEntityType = EntityType.OperationRequest;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo, IUserRepository userRepo, DbLogService dbLogService)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._userRepo = userRepo;
            this._dbLogService = dbLogService;
        }

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<StaffDto>> GetAllAsync()
        {
            try
            {
                var list = await this._repo.GetAllAsync();

                if (list == null)
                {
                    return [];
                }
                else
                {
                    return StaffMapper.ToDtoList(list);
                }
            }
            catch (Exception)
            {
                return [];
            }
        }

        public async Task<StaffDto> GetByIdAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }
        /*public async Task<List<StaffDto>> GetBySearchCriteriaAsync(Staff staffDto)
        {

        }*/

        public async Task<StaffDto?> GetByEmailAsync(Email email)
        {
            try
            {
                if (email == null)
                {
                    return null;
                }
                var staff = await this._repo.GetByEmailAsync(email);

                if (staff == null)
                    return null;

                //return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
                return StaffMapper.ToDto(staff);
            }
            catch (Exception e)
            {
                //_dbLogService.LogError(StaffEntityType, e.ToString());
                return null;
            }
        }

        //CREATE STAFF WITH first name, last name, contact information, and specialization
        public async Task<StaffDto?> AddAsync(Staff dto)
        {
            try
            {
                if (dto.ContactInformation.PhoneNumber == null)
                {
                    throw new ArgumentNullException(nameof(dto.ContactInformation), "Contact information cannot be null.");
                }

                if (dto.ContactInformation.PhoneNumber.Equals(0))
                {
                    throw new ArgumentNullException(nameof(dto.ContactInformation), "Contact information igual a 0.");
                }

                var staffList = await _repo.GetAllAsync();
                if (staffList == null)
                {
                    throw new InvalidOperationException("Failed to retrieve staff list.");
                }

                if (await _repo.GetByEmailAsync(dto.ContactInformation.Email) != null || await _repo.GetByPhoneNumberAsync(dto.ContactInformation.PhoneNumber) != null)
                {
                    throw new InvalidDataException("Email or phone number exists!");
                }

                var licenseNumber = await AssignLicenseNumberAsync(dto.StaffRole);

                var staff = new Staff(licenseNumber, dto.FullName, dto.ContactInformation, dto.Specialization, dto.StaffRole);

                if (staff == null)
                    return null;

                await this._repo.AddAsync(staff);

                await this._unitOfWork.CommitAsync();

                //_dbLogService.LogAction(EntityType.STAFF, DBLogType.CREATE, staff.Id);

                return StaffMapper.ToDto(staff);
            }
            catch (Exception e)
            {
                // Log error with stack trace for better debugging
                Console.WriteLine("Error: " + e.Message);
                Console.WriteLine("Stack Trace: " + e.StackTrace);
                return StaffMapper.ToDto(dto);
            }
        }

        public async Task<LicenseNumber> AssignLicenseNumberAsync(StaffRole role)
        {
            var staff = await _repo.GetByRoleAsync(role);
            if (staff == null)
            {
                throw new InvalidOperationException("Failed to retrieve staff list.");
            }

            var numberStaff = staff.Count + 1;
            string licenseNumber = StaffRoleUtils.IdStaff(role) + DateTime.Now.ToString("yyyy") + numberStaff;

            return new LicenseNumber(licenseNumber);
        }
        
        public async Task<StaffDto> UpdateAsync(string oldEmail, UpdatingStaffDto dto)
        {
            try
            {
                var staff = await _repo.GetByEmailAsync(oldEmail);

                if (staff == null)
                {
                    await _dbLogService.LogAction(EntityType.Staff, DbLogType.Update, "Unable to update because Staff not found");
                    return null;
                }

                if(dto.AvailabilitySlots != null)
                    staff.ChangeSlotAvailability(dto.AvailabilitySlots);
                
                if(dto.Specialization != null)
                    staff.ChangeSpecialization(dto.Specialization);

                if (dto.Status != null)
                    staff.ChangeStatus(dto.Status);
                
                await _unitOfWork.CommitAsync();
                
                if (dto.PhoneNumber != null && dto.PhoneNumber != staff.ContactInformation.PhoneNumber)
                {
                    var phoneNumberToCheck = dto.PhoneNumber;
                    var byPhoneNumberAsync = await _repo.GetByPhoneNumberAsync(phoneNumberToCheck);
                    if (byPhoneNumberAsync != null)
                    {
                        throw new Exception("Phone number already exists");
                    }
                }

                if (dto.Email != null && !dto.Email.Equals(staff.ContactInformation.Email))
                {
                    var emailToCheck = dto.Email;
                    var byEmailAsync = await _repo.GetByEmailAsync(emailToCheck);
                    if (byEmailAsync != null)
                    {

                        throw new Exception("Email already exists");
                    }
                }

                if (dto.PhoneNumber != null && staff.ContactInformation.PhoneNumber != dto.PhoneNumber)
                {
                    staff.ChangePhoneNumber(dto.PhoneNumber);
                }
                if(dto.Email != null && !staff.ContactInformation.Email.Equals(dto.Email)) 
                {
                    staff.ChangeEmail(dto.Email);
                }
                
                _dbLogService.LogAction(StaffEntityType, DbLogType.Update, "Updated {" + staff.Id.Value + "}");
                return StaffMapper.ToDto(staff);
            }
            catch (Exception e)
            {
                //_dbLogService.LogError(StaffEntityType, e.ToString());
                Console.WriteLine(e.Message);
                return null;
            }
        }

        public async Task<StaffDto> InactivateAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id); 

            if (staff == null)
                return null;   

            staff.Status = Status.Inactive;
            
            await this._unitOfWork.CommitAsync();

            return StaffMapper.ToDto(staff);
        }

        public async Task<StaffDto> DeleteAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            if (staff.Status.IsActive())
                throw new BusinessRuleValidationException("It is not possible to delete an active category.");

            this._repo.Remove(staff);

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
        }
        
        public async Task<StaffDto> SearchByEmailAsync(Email email)
        {
            try
            {
                var staff = await _repo.GetByEmailAsync(email);

                if (staff == null)
                    return null;
                
                return StaffMapper.ToDto(staff);
            }
            catch (Exception e)
            {
                //_dbLogService.LogError(StaffEntityType, e.ToString());
                return null;
            }
        }

        public async Task<List<StaffDto>> SearchByNameAsync(FullName fullName)
        {
            try
            {
                var staff = await _repo.GetByFullNameAsync(new Name(fullName.FirstName), new Name(fullName.LastName));

                if (staff == null)
                    return null;


                List<StaffDto> listDto = StaffMapper.ToDtoList(staff);

                return listDto;

            }
            catch (Exception e)
            {
                //_dbLogService.LogError(StaffEntityType, e.ToString());
                return null;
            }
        }
        
        public async Task<List<StaffDto>> SearchBySpecializationAsync(Specialization specialization)
        {
            try
            {
                var staff = await _repo.GetBySpecializationAsync(specialization);

                if (staff == null)
                    return null;
                
                List<StaffDto> listDto = StaffMapper.ToDtoList(staff);

                return listDto;
            }
            catch (Exception e)
            {
                //_dbLogService.LogError(StaffEntityType, e.ToString());
                return null;
            }
        }

        public async Task<List<StaffDto>> SearchByRoleAsync(StaffRole role)
        {
            try
            {
                var staff = await _repo.GetByRoleAsync(role);

                if (staff == null)
                    return null;
                
                List<StaffDto> listDto = StaffMapper.ToDtoList(staff);

                return listDto;
            }
            catch (Exception e)
            {
                //_dbLogService.LogError(StaffEntityType, e.ToString());
                return null;
            }
        }

        //GetByLicenseNumber
        public async Task<StaffDto?> GetByLicenseNumber(LicenseNumber licenseNumber){
            try{
                var staff = await _repo.GetByLicenseNumber(licenseNumber);

                if(staff == null)
                    return null;

                return StaffMapper.ToDto(staff);

            }catch(Exception){
                return null;
            }
            
        }

        public async Task<List<StaffDto>> GetActiveWithUserIdNull()
        {
            List<Staff> staff = await this._repo.GetActiveWithUserIdNull();

            if (staff == null || staff.Count == 0)
            {
                return null;
            }

            List<StaffDto> listDto = StaffMapper.ToDtoList(staff);

            return listDto;
        }

        public async Task<List<StaffDto>> GetAsync(string? name, string? email, string? specialization)
        {
            List<Staff> staff = await this._repo.GetAsync(name, email, specialization);

            if (staff == null || staff.Count == 0)
            {
                return null;
            }

            List<StaffDto> listDto = StaffMapper.ToDtoList(staff);

            return listDto;
        }

        public async Task<StaffDto> AddSlotAppointment(StaffDto staff, Slot newSlot)
        {
            try
            {
                if (staff == null)
                    return null;

                if (newSlot == null)
                    return null;

                var staffEntity = await _repo.GetByIdAsync(new StaffId(staff.Id));

                if (staffEntity == null)
                    return null;

                staffEntity.AddAppointmentSlot(newSlot);

                await _unitOfWork.CommitAsync();

                return StaffMapper.ToDto(staffEntity);
            }
            catch (Exception e)
            {
                //_dbLogService.LogError(StaffEntityType, e.ToString());
                return null;
            }
        }

        public async Task<StaffDto> AddSlotAvailability(StaffDto staff, Slot newSlot)
        {
            try
            {
                if (staff == null)
                    return null;

                if (newSlot == null)
                    return null;

                var staffEntity = await _repo.GetByIdAsync(new StaffId(staff.Id));

                if (staffEntity == null)
                    return null;

                staffEntity.AddAvailabilitySlot(newSlot);

                await _unitOfWork.CommitAsync();

                return StaffMapper.ToDto(staffEntity);
            }
            catch (Exception e)
            {
                //_dbLogService.LogError(StaffEntityType, e.ToString());
                return null;
            }
        }

        public async Task<StaffDto> AddUserId(Email email, Guid id)
        {
            if (email == null)
            {
                return null;
            }

            if (id == null)
            {
                return null;
            }

            var staff = await _repo.GetByEmailAsync(email);

            if (staff == null)
            {
                return null;
            }

            staff.UserId = new UserId(id);

            await _unitOfWork.CommitAsync();

            return StaffMapper.ToDto(staff);
        }

        public async Task<Dictionary<LicenseNumber, List<AppointmentNumber>>> CreateSlotAppointments(DateTime date, PrologResponse response)
        {
            try {
                //staffAgendaGenerated = licenseNumber,[(slotStartInMinutes,slotEndInMinutes,operationRequestCode),...] ; ...
                var staffs = response.StaffAgendaGenerated.Split(new[] { " ; " }, StringSplitOptions.RemoveEmptyEntries);

                Dictionary<LicenseNumber, List<AppointmentNumber>> staffAppointments = new Dictionary<LicenseNumber, List<AppointmentNumber>>();

                foreach (var staff in staffs) {
                    //staff = licenseNumber,[(slotStartInMinutes,slotEndInMinutes,operationRequestCode),...]
                    int index = staff.IndexOf(',');

                    var licenseNumber = new LicenseNumber(staff.Substring(0, index).Trim());

                    //operationsStr = [(slotStartInMinutes,slotEndInMinutes,operationRequestCode),...]
                    var operationsStr = staff.Substring(index + 1).Trim();

                    //operationsStr = (slotStartInMinutes,slotEndInMinutes,operationRequestCode),(slotStartInMinutes,slotEndInMinutes,operationRequestCode)
                    operationsStr = operationsStr.Substring(1, operationsStr.Length - 2);

                    //operations: each operation = slotStartInMinutes,slotEndInMinutes,operationRequestCode (except first and last operation)
                    var operations = operationsStr.Split(new[] { "),(" }, StringSplitOptions.RemoveEmptyEntries);

                    //remove first character (bracket) from first operation
                    operations[0] = operations[0].Substring(1);

                    //remove last character (bracket) from last operation
                    operations[operations.Length - 1] = operations[operations.Length - 1].Substring(0, operations[operations.Length - 1].Length - 1);

                    var staffEntity = await GetByLicenseNumber(licenseNumber);
                    if (staffEntity == null) {
                        return new Dictionary<LicenseNumber, List<AppointmentNumber>>();
                        throw new Exception($"Staff with license number {licenseNumber} not found.");
                    }

                    List<AppointmentNumber> appointments = new List<AppointmentNumber>();

                    if (staffEntity == null) {
                        throw new Exception("Staff not found.");
                    }

                    foreach (var operation in operations) {
                        var parts = operation.Split(',');

                        if (parts.Length != 3)
                        {
                            throw new Exception($"Invalid format for: {operation}");
                        }

                        var opRequestCode = parts[2].Trim();
                        var appointmentNumber = new AppointmentNumber("ap" + int.Parse(opRequestCode.Substring(3)));

                        if (!appointments.Contains(appointmentNumber)) appointments.Add(appointmentNumber);

                        string startTimeStr = ConvertMinutesToTime(int.Parse(parts[0].Trim()));
                        string endTimeStr = ConvertMinutesToTime(int.Parse(parts[1].Trim()));

                        DateTime startInHHMM = DateTime.ParseExact(startTimeStr, "HH:mm", null);
                        DateTime endInHHMM = DateTime.ParseExact(endTimeStr, "HH:mm", null);

                        var start = date.Date.Add(startInHHMM.TimeOfDay);
                        var end = date.Date.Add(endInHHMM.TimeOfDay);

                        var slotEntity = new Slot(start, end);

                        await AddSlotAppointment(staffEntity, slotEntity);
                    }

                    staffAppointments.Add(licenseNumber, appointments);
                }
                
                return staffAppointments;
                
            } catch (Exception e) {
                return new Dictionary<LicenseNumber, List<AppointmentNumber>>();
                throw new Exception("Error assigning slot appointments to staff: " + e.Message);
            }
        }

        private static string ConvertMinutesToTime(int minutes)
        {
            int hours = minutes / 60;
            int mins = minutes % 60;
            return $"{hours:D2}:{mins:D2}";
        }
    }
}