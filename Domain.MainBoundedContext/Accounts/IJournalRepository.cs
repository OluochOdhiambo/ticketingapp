using Domain.Seedwork;

namespace Domain.MainBoundedContext.Accounts
{
    public interface IJournalRepository : IRepository<Journal>
    {
        Task<Journal?> GetJournalWithEntriesByIdAsync(Guid id);
    }
}
