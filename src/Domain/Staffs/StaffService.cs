using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Domain.DBLogs;
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

        private readonly IDBLogRepository _logRepo;

        private readonly DBLogService _dbLogService;

        private static readonly EntityType StaffEntityType = EntityType.OPERATION_REQUEST;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo, IUserRepository userRepo, IDBLogRepository logRepo, DBLogService dbLogService)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._userRepo = userRepo;
            this._logRepo = logRepo;
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
                _dbLogService.LogError(StaffEntityType, e.ToString());
                return null;
            }
        }

        //CREATE STAFF WITH first name, last name, contact information, and specialization
        public async Task<StaffDto?> AddAsync(Staff dto, RoleFirstChar roleFirstChar)
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

                var numberStaff = staffList.Count + 1;

                string licenseNumber = roleFirstChar.Value + DateTime.Now.ToString("yyyy") + numberStaff;

                Console.WriteLine("Generated License Number: " + licenseNumber); // Para debug    

                // Construct new Staff object
                var staff = new Staff(new LicenseNumber(licenseNumber), dto.FullName, dto.ContactInformation, dto.Specialization);

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
        public async Task<StaffDto> UpdateAsync(string oldEmail, Staff staff)
        {
            try
            {
                Staff newStaff = await _repo.GetByEmailAsync(oldEmail);

                if (newStaff == null)
                {
                    _dbLogService.LogError(StaffEntityType, "Unable to find {staff " + staff.Id + "}");
                    return StaffMapper.ToDto(staff);
                }

                // change all field
                try
                {
                    newStaff.ChangeContactInformation(staff.ContactInformation);
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to change contact information", ex);
                }

                try
                {
                    newStaff.ChangeSlotAvailability(staff.SlotAvailability);
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to change slot availability", ex);
                }

                try
                {
                    newStaff.ChangeSpecialization(staff.Specialization);
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to change specialization", ex);
                }

                try
                {
                    newStaff.ChangeUserId(staff.UserId);
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to change specialization", ex);
                }


                // await _repo.UpdateAsync(newStaff);
                await _unitOfWork.CommitAsync();

                //_dbLogService.LogAction(StaffEntityType, DBLogType.UPDATE, newStaff.Id);

                /*if(DBLogType.UPDATE)
                {
                    string toEmail = newStaff.ContactInformation.Email; // Assuming the contact information has an Email field
                    string subject = "Your contact information has been updated";
                    string body = $"Dear {newStaff.Name}, your contact information has been successfully updated.";
                    
                    await _emailService.SendEmailAsync(toEmail, subject, body);
                }*/

                return StaffMapper.ToDto(newStaff);
            }
            catch (Exception e)
            {
                _dbLogService.LogError(StaffEntityType, e.ToString());
                return StaffMapper.ToDto(staff);
            }
        }

        public async Task<StaffDto> InactivateAsync(Email email)
        {
            var staff = await _repo.GetByEmailAsync(email);

            if (staff == null)
                return null;

            // change all fields
            staff.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new StaffDto { Id = staff.Id.AsGuid(), FullName = staff.FullName, ContactInformation = staff.ContactInformation, Specialization = staff.Specialization, Status = staff.Status, SlotAppointement = staff.SlotAppointement, SlotAvailability = staff.SlotAvailability };
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

        public async Task<List<StaffDto>> SearchByNameAsync(FullName fullName)
        {
            try
            {
                List<Staff> staff = await _repo.GetByFullNameAsync(fullName);

                if (staff == null || staff.Count == 0)
                    return new List<StaffDto>();


                List<StaffDto> listDto = StaffMapper.ToDtoList(staff);

                return listDto;

            }
            catch (Exception e)
            {
                _dbLogService.LogError(StaffEntityType, e.ToString());
                return new List<StaffDto>();
            }
          
            
            
        }
    }
}