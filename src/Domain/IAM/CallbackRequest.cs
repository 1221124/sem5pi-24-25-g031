namespace Domain.IAM
{
    public class CallbackRequest
    {
        public string RedirectUri { get; set; }

        public CallbackRequest(string redirectUri)
        {
            RedirectUri = redirectUri;
        }

        public CallbackRequest()
        {
        }
    }
}