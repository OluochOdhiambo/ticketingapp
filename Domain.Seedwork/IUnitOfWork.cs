using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Seedwork
{
    public interface IUnitOfWork : IDisposable
    {
        Task<int> CommitAsync(CancellationToken cancellationToken = default);
    }
}
