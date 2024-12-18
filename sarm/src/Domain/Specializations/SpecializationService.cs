using Domain.Shared;

namespace DDDNetCore.Domain.Specializations;

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
}