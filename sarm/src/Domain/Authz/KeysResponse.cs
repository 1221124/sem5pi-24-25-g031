using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;

public class KeysResponse
{
    public List<JsonWebKey> Keys { get; set; }
}

public class JsonWebKey
{
    public string Kid { get; set; }
    public string N { get; set; }
    public string E { get; set; }

    public RSAParameters ExtractParameters()
    {
        return new RSAParameters
        {
            Modulus = Base64UrlEncoder.DecodeBytes(N),
            Exponent = Base64UrlEncoder.DecodeBytes(E)
        };
    }
}