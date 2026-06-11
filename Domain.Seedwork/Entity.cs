using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Domain.Seedwork
{
    public abstract class Entity
    {
        public Guid Id { get; protected set; }

        public string CreatedBy { get; protected set; } = string.Empty;

        public DateTime CreatedDate { get; protected set; }

        public DateTime? UpdatedDate { get; protected set; }

        public string? UpdatedBy { get; protected set; }

        protected Entity()
        {
            CreatedDate = DateTime.UtcNow;
        }

        /// <summary>
        /// Generate identity for this entity
        /// </summary>
        public void GenerateNewIdentity()
        {
            if (IsTransient())
            {
                Id = IdentityGenerator.NewSequentialGuid();
            }
        }

        protected bool IsTransient()
        {
            return Id == Guid.Empty;
        }

        public override bool Equals(object obj)
        {
            if (obj is null)
                return false;

            if (ReferenceEquals(this, obj))
                return true;

            if (obj.GetType() != GetType())
                return false;

            var other = (Entity)obj;

            if (IsTransient() || other.IsTransient())
                return false;

            return Id == other.Id;
        }

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }
    }
}
