using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using DDDNetCore.Domain.Appointments;
using Domain.DbLogs;
using Domain.OperationTypes;
using Domain.Shared;
using Domain.Users;
using Infrastructure.Staffs;


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
    }
}