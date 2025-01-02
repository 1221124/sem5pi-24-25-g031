using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.Specializations;
using DDDNetCore.PrologIntegrations;
using Domain.DbLogs;
using Domain.OperationTypes;
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

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAvailability = staff.SlotAvailability };
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

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAvailability = staff.SlotAvailability };
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
        
        public async Task<List<StaffDto>> SearchBySpecializationAsync(SNOMEDCTCode specialization)
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
        public async Task<StaffDto> GetByLicenseNumber(LicenseNumber licenseNumber){
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

            var userId = new UserId(id);

            if (staff.UserId == null || staff.UserId != userId)
            {
                staff.UserId = new UserId(id);
                await _unitOfWork.CommitAsync();
            }

            return StaffMapper.ToDto(staff);
        }

        public async Task<bool> IsActive(Email email)
        {
            try {
                var staff = await _repo.GetByEmailAsync(email);

                if (staff == null) {
                    return false;
                }

                return staff.Status.IsActive();
            } catch (Exception e) {
                return false;
            }
        }

        public async Task<bool> InvalidUserId(Email email, Guid userId)
        {
            try {
                var staff = await _repo.GetByEmailAsync(email);

                if (staff == null) {
                    return false;
                }

                return staff.UserId == null || staff.UserId.AsGuid() != userId;
            } catch (Exception e) {
                return false;
            }
        }

        public async Task<List<StaffDto>> GetByRoleAndSpecialization(StaffRole role, SNOMEDCTCode specialization)
        {
            try {
                var staffs = await _repo.GetByRoleAsync(role);

                staffs = staffs.Where(s => s.Specialization == specialization).ToList();

                if (staffs == null) {
                    return null;
                }

                return StaffMapper.ToDtoList(staffs);
            } catch (Exception e) {
                return null;
            }
        }

        public bool IsStaffAvailable(StaffDto staff, DateTime startTime, DateTime endTime, Dictionary<AppointmentDto, OperationTypeDto> appointments)
        {
            try {
                if (staff == null) {
                    return false;
                }

                if (staff.SlotAvailability == null || staff.SlotAvailability.Count == 0) {
                    return false;
                }

                var availabilitySlotFullyOverlaps = false;
                var newAppointmentSlot = new Slot(startTime, endTime);

                foreach (var slot in staff.SlotAvailability)
                {
                    if (newAppointmentSlot.Start < slot.Start || newAppointmentSlot.End > slot.End)
                    {
                        continue;
                    }
                    
                    foreach (var apReqStaff in appointments)
                    {
                        var appointment = apReqStaff.Key;
                        var operationType = apReqStaff.Value;

                        var surgeryStart = appointment.AppointmentDate.Start.AddMinutes(operationType.PhasesDuration.Surgery);
                        var cleaningStart = surgeryStart.AddMinutes(operationType.PhasesDuration.Cleaning);

                        var requiredStaff = operationType.RequiredStaff
                            .Find(s => s.Role.ToString() == staff.StaffRole.ToString() && s.Specialization == staff.Specialization);

                        if (requiredStaff == null)
                        {
                            Console.WriteLine("Staff with license number " + staff.LicenseNumber + " is not required for the requested operation type.");
                            return false;
                        }

                        var phaseIntervals = new Dictionary<string, Slot>
                        {
                            { "Preparation", new Slot(appointment.AppointmentDate.Start, surgeryStart) },
                            { "Surgery", new Slot(surgeryStart, cleaningStart) },
                            { "Cleaning", new Slot(cleaningStart, appointment.AppointmentDate.End) }
                        };

                        foreach (var phase in phaseIntervals)
                        {
                            var isRequiredInPhase = requiredStaff.GetType()
                                .GetProperty($"IsRequiredIn{phase.Key}")?.GetValue(requiredStaff) as bool?;

                            if (isRequiredInPhase == true)
                            {
                                if (Slot.FullyOverlaps(slot, phase.Value))
                                {
                                    Console.WriteLine($"Slot of staff with license number {staff.LicenseNumber} fully overlaps with the {phase.Key} phase.");
                                    availabilitySlotFullyOverlaps = true;
                                } else {
                                    Console.WriteLine($"Slot of staff with license number {staff.LicenseNumber} does not fully overlap with the {phase.Key} phase.");
                                    return false;
                                }

                                if (Slot.Overlaps(newAppointmentSlot, phase.Value))
                                {
                                    Console.WriteLine($"Staff with license number {staff.LicenseNumber} is not available for the {phase.Key} phase.");
                                    return false;
                                }
                            }
                        }
                    }

                    if (availabilitySlotFullyOverlaps)
                        Console.WriteLine("Staff with license number " + staff.LicenseNumber + " is available for the requested slot.");
                        return true;
                }

                return false;
            } catch (Exception e) {
                return false;
            }
        }
    }
}