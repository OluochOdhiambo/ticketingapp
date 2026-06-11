using Domain.Seedwork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Infrastructure.Data.MainBoundedContext.Repositories
{
    internal abstract class EfRepository<TEntity>
        where TEntity : AggregateRoot
    {
        protected readonly MainDbContext _context;

        protected EfRepository(MainDbContext context)
        {
            _context = context;
        }

        protected DbSet<TEntity> Set => _context.Set<TEntity>();

        #region Add

        public virtual void Add(TEntity entity)
            => Set.Add(entity);

        public virtual async Task AddAsync(TEntity entity)
            => await Set.AddAsync(entity);

        #endregion

        #region Update

        public virtual void Update(TEntity entity)
            => Set.Update(entity);

        #endregion

        #region Merge

        public virtual void Merge(TEntity existingEntity, TEntity newEntity)
        {
            _context.Entry(existingEntity).CurrentValues.SetValues(newEntity);

            _context.Entry(existingEntity)
                .Property(x => x.Id)
                .IsModified = false;
        }

        #endregion

        #region Remove

        public virtual void Remove(TEntity entity)
            => Set.Remove(entity);

        #endregion

        #region Get By Id

        public virtual TEntity? GetById(Guid id)
            => Set.Find(id);

        public virtual async Task<TEntity?> GetByIdAsync(Guid id)
            => await Set.FindAsync(id);

        #endregion

        #region Get All

        public virtual IEnumerable<TEntity> GetAll()
            => Set.AsNoTracking().ToList();

        public virtual async Task<List<TEntity>> GetAllAsync()
            => await Set.AsNoTracking().ToListAsync();

        #endregion

        #region Find

        public virtual IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> predicate)
            => Set.Where(predicate).AsNoTracking().ToList();

        public virtual async Task<List<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
            => await Set.Where(predicate).AsNoTracking().ToListAsync();

        #endregion

        #region Exists / Count

        public virtual bool Exists(Expression<Func<TEntity, bool>> predicate)
            => Set.Any(predicate);

        public virtual async Task<bool> ExistsAsync(Expression<Func<TEntity, bool>> predicate)
            => await Set.AnyAsync(predicate);

        public virtual int Count(Expression<Func<TEntity, bool>>? predicate = null)
            => predicate == null
                ? Set.Count()
                : Set.Count(predicate);

        public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null)
            => predicate == null
                ? await Set.CountAsync()
                : await Set.CountAsync(predicate);

        #endregion
    }
}
