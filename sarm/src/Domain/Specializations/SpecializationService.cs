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

        public async Task<SNOMEDCTCode> AssignCodeAsync()
        {
            try
            {
                var lastCode = await _repository.GetLastCodeAsync();

                int lastNumber = 0;
                if (!string.IsNullOrEmpty(lastCode) && lastCode.Trim().ToLower().StartsWith("CT"))
                {
                    if (int.TryParse(lastCode[4..], out var parsedNumber))
                    {
                        lastNumber = parsedNumber;
                    }
                }

                int nextNumber = lastNumber + 1;
                return new SNOMEDCTCode($"CT{nextNumber}");
            }
            catch (Exception)
            {
                return new SNOMEDCTCode("CT1"); // Retorna um código de especialização padrão
            }
        }


        public async Task<SpecializationDto> AddAsync(CreatingSpecializationDto dto, SNOMEDCTCode SNOMEDCTCode)
        {
            try
            {
                if (dto == null)
                    return null;

                var specialization = new Specialization(SNOMEDCTCode, dto.Name, dto.Description);

                await _repository.AddAsync(specialization);
                await _unitOfWork.CommitAsync();

                return SpecializationMapper.ToDto(specialization);
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}