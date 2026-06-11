using Domain.Seedwork;

namespace Domain.MainBoundedContext.Customers
{
    public class Customer : AggregateRoot
    {
        public Customer() { }

        public Customer(string code, string firstName, string lastName, string email, string phoneNumber) 
        {
            Code = code;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            PhoneNumber = phoneNumber;
        }

        public string Code { get; private set; }

        public string FirstName { get; private set; }

        public string LastName { get; private set; }

        public string Email { get; private set; }

        public string PhoneNumber { get; private set; }
    }
}
