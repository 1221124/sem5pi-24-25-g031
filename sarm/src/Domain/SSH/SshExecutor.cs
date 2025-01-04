using Renci.SshNet;

public class SshExecutor
{
    public string ExecuteSshCommand(string command, string host, string username, string password)
    {
        using (var client = new SshClient(host, username, password))
        {
            try
            {
                client.Connect();

                if (client.IsConnected)
                {
                    var result = client.RunCommand(command);

                    return result.Result;
                }
                else
                {
                    return "Failure connecting.";
                }
            }
            catch (Exception ex)
            {
                return $"Error executing commnad: {ex.Message}";
            }
            finally
            {
                if (client.IsConnected)
                    client.Disconnect();
            }
        }
    }
}
