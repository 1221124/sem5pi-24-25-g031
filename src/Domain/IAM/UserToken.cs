namespace Domain.IAM
{
    public class UserToken
    {
        public string JwtToken { get; set; }

        public UserToken(string jwtToken)
        {
            JwtToken = jwtToken;
        }
    }
}