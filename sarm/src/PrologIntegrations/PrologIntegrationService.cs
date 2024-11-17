namespace DDDNetCore.PrologIntegrations
{
    public class PrologIntegrationService
    {
        //CreateFileContent
        public async Task<bool> CreateFile(
            Dictionary<string, List<string>> staff, Dictionary<string, string> agenda_staff, 
            Dictionary<string, string> timetable, Dictionary<string, string> surgery, 
            Dictionary<string, string> surgery_id, Dictionary<string, string> assignment_surgery, 
            DateTime date)
        {
            try{
                string content = "";
                content += "staff(";
                foreach (var item in staff)
                {
                    content += item.Key + ", [";
                    foreach (var item2 in item.Value)
                    {
                        content += item2 + ", ";
                    }
                    content = content.Substring(0, content.Length - 1);
                    content += "], ";
                }
                content = content.Substring(0, content.Length - 1);
                content += ").\n";

                content += "agenda_staff(";
                foreach (var item in agenda_staff)
                {
                    content += item.Key + ", " + item.Value + ", ";
                }
                content = content.Substring(0, content.Length - 1);
                content += ").\n";

                content += "timetable(";
                foreach (var item in timetable)
                {
                    content += item.Key + ", " + item.Value + ", ";
                }
                content = content.Substring(0, content.Length - 1);
                content += ").\n";

                content += "surgery(";
                foreach (var item in surgery)
                {
                    content += item.Key + ", " + item.Value + ", ";
                }
                content = content.Substring(0, content.Length - 1);
                content += ").\n";

                content += "surgery_id(";
                foreach (var item in surgery_id)
                {
                    content += item.Key + ", " + item.Value + ", ";
                }
                content = content.Substring(0, content.Length - 1);
                content += ").\n";

                content += "assignment_surgery(";
                foreach (var item in assignment_surgery)
                {
                    content += item.Key + ", " + item.Value + ", ";
                }
                content = content.Substring(0, content.Length - 1);
                content += ").\n";

                // Navigate to the project root directory safely
                string projectRootPath = AppDomain.CurrentDomain.BaseDirectory;
                for (int i = 0; i < 5; i++) // Navigate up 5 levels
                {
                    var parent = Directory.GetParent(projectRootPath);
                    if (parent == null)
                    {
                        throw new InvalidOperationException("Could not determine the project root directory.");
                    }
                    projectRootPath = parent.FullName;
                }
                
                string directoryPath = Path.Combine(projectRootPath, "PlanningModule", "knowledge_base");

                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                string filePath = Path.Combine(directoryPath, "kb-" + date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2") + ".pl");

                Console.WriteLine($"File path: {filePath}");

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }


                
                await File.WriteAllTextAsync(filePath, content);

                if(File.Exists(filePath))
                {
                    return true;
                }
                else
                {
                    return false;
                }

            }catch (Exception e)
            {
                Console.WriteLine($"Error: {e.Message}");
                Console.WriteLine($"Stack Trace: {e.StackTrace}");
                throw new Exception("Error creating file content", e);
            }

        }
    }
}