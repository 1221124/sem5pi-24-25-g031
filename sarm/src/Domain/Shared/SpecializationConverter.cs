using Newtonsoft.Json;

namespace Domain.Shared
{
    public class SpecializationConverter : JsonConverter<Specialization>
    {
        public override void WriteJson(JsonWriter writer, Specialization value, JsonSerializer serializer)
        {
            writer.WriteValue(SpecializationUtils.ToString(value));
        }

        public override Specialization ReadJson(JsonReader reader, Type objectType, Specialization existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            var value = reader.Value as string;
            if (value == null)
            {
                throw new JsonSerializationException("Expected string value.");
            }
            return SpecializationUtils.FromString(value);
        }
    }
}