using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Seedwork
{
    public static class IdentityGenerator
    {
        public static Guid NewSequentialGuid()
        {
            var guidBytes = Guid.NewGuid().ToByteArray();
            var timestamp = DateTime.UtcNow.Ticks;

            // Embed the timestamp into the first 8 bytes of the GUID
            for (int i = 0; i < 8; i++)
            {
                guidBytes[i] = (byte)(timestamp >> (i * 8));
            }
            return new Guid(guidBytes);
        }
    }
}
