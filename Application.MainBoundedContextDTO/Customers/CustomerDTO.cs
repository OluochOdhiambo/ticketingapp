using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MainBoundedContextDTO.Customers
{
    public class CustomerDTO
    {
        public string Code { get; set; } = null!;

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;
    }
}
