using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Seedwork
{
    public class DomainException : Exception
    {
        public DomainException(string message) : base(message)
        {

        }
    }
}
