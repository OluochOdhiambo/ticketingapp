using System.ComponentModel;
using System.Reflection;

namespace Infrastructure.Crosscutting.Framework.Utils
{
    public static class EnumExtensionHelper
    {
        public static string GetDescription(this Enum value)
        {
            var field = value.GetType().GetField(value.ToString());

            if (field == null)
                return value.ToString();

            var attribute = field.GetCustomAttribute<DescriptionAttribute>();

            return attribute?.Description ?? value.ToString();
        }
    }
}