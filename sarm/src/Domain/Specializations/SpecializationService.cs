using Domain.Shared;

namespace DDDNetCore.Domain.Specializations
{

    public class SpecializationService
    {
        private readonly ISpecializationRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public SpecializationService(ISpecializationRepository repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<Specialization>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<SpecializationDto> GetByIdAsync(SpecializationId id)
        {
            try
            {
                var specialization = await _repository.GetByIdAsync(id);

                if (specialization == null)
                {
                    return null;
                }

                return SpecializationMapper.ToDto(specialization);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public async Task<List<SpecializationDto>> GetAsync(string? name)
        {
            try
            {
                List<Specialization> specializations;

                if (string.IsNullOrEmpty(name))
                {
                    specializations = await _repository.GetAllAsync();
                }
                else
                {
                    specializations = await _repository.GetByNameAsync(name);
                }

                return SpecializationMapper.ToDtoList(specializations);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<SpecializationDto> AddAsync(CreatingSpecializationDto dto)
        {
            try
            {
                if (dto == null)
                    return null;

                var specialization = new Specialization(dto.SNOMEDCTCode, dto.Name, dto.Description);

                await _repository.AddAsync(specialization);
                await _unitOfWork.CommitAsync();

                return SpecializationMapper.ToDto(specialization);
            }
            catch (Exception)
            {
                return null;
            }
        }


        public async Task<SpecializationDto> UpdateAsync(SpecializationDto dto)
        {
            var specialization = await this._repository.GetByIdAsync(new SpecializationId(dto.Id));

            if (specialization == null)
                return null;   

            specialization.Name = dto.Name;
            specialization.Description = dto.Description;

            await this._unitOfWork.CommitAsync();

            return SpecializationMapper.ToDto(specialization);
        }
    }
}