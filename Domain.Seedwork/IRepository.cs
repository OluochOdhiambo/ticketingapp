using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Seedwork
{
    public interface IRepository<TEntity> where TEntity : AggregateRoot
    {
        #region Asynchronous CRUD

        Task<TEntity?> GetByIdAsync(Guid id);

        Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate);

        #endregion

        #region Synchronous CRUD

        void Add(TEntity entity);

        void Merge(TEntity entity, TEntity newEntity);

        void Remove(TEntity entity);

        #endregion
    }
}
