using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Shared.Application.CustomersModule
{
    internal class CustomerDTO
    {
        public Guid Id { get; set; }

        public string Code { get; set; } = null!;

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;
    }
}
