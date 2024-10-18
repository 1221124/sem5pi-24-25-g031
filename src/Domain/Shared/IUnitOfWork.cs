using System.Threading.Tasks;

namespace Domain.Shared
{
    public interface IUnitOfWork
    {
        Task<int> CommitAsync();
    }
}