using System.ComponentModel;

namespace Infrastructure.Crosscutting.Framework.Utils
{
    public enum JournalStatus
    {
        [Description("Pending")]
        Pending = 0,
        [Description("Posted")]
        Posted = 1
    }

    public enum OrderStatus
    {
        [Description("Draft")]
        Draft = 0,
        [Description("Booked")]
        Booked = 1,
        [Description("Paid")]
        Paid = 2,
        [Description("Refunded")]
        Refunded = 3,
        [Description("Cancelled")]
        Cancelled = 9
    }

    public enum PaymentMethod
    {
        [Description("Credit Card")]
        CreditCard = 1,
        [Description("QRCode Scan")]
        QRCodeScan = 2,
    }

    public enum TransactionStatus
    {
        [Description("Pending")]
        Pending = 1,
        [Description("Confirmed")]
        Confirmed = 2,
        [Description("Failed")]
        Failed = 3,
    }

    public enum TicketType
    {
        [Description("Gold")]
        Gold = 1,
        [Description("Premium")]
        Premium = 2,
        [Description("VIP")]
        VIP = 3
    }
}
