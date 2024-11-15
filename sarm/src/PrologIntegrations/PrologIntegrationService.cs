namespace DDDNetCore.PrologIntegration.PrologIntegrations
{
    public class PrologIntegrationService
    {
        public PrologIntegrationService()
        {
        }

        //CreateFileContent
        public async Task<bool> CreateFile(
            Dictionary<string, List<string>> staff, Dictionary<string, string> agenda_staff, 
            Dictionary<string, string> timetable, Dictionary<string, string> surgery, 
            Dictionary<string, string> surgery_id, Dictionary<string, string> assignment_surgery, 
            DateTime date)
        {
            try{
            //     string content = "";
            //     content += "staff(";
            //     foreach (var item in staff)
            //     {
            //         content += item.Key + ", [";
            //         foreach (var item2 in item.Value)
            //         {
            //             content += item2 + ", ";
            //         }
            //         content = content.Substring(0, content.Length - 2);
            //         content += "], ";
            //     }
            //     content = content.Substring(0, content.Length - 2);
            //     content += ").\n";

            //     content += "agenda_staff(";
            //     foreach (var item in agenda_staff)
            //     {
            //         content += item.Key + ", " + item.Value + ", ";
            //     }
            //     content = content.Substring(0, content.Length - 2);
            //     content += ").\n";

            //     content += "timetable(";
            //     foreach (var item in timetable)
            //     {
            //         content += item.Key + ", " + item.Value + ", ";
            //     }
            //     content = content.Substring(0, content.Length - 2);
            //     content += ").\n";

            //     content += "surgery(";
            //     foreach (var item in surgery)
            //     {
            //         content += item.Key + ", " + item.Value + ", ";
            //     }
            //     content = content.Substring(0, content.Length - 2);
            //     content += ").\n";

            //     content += "surgery_id(";
            //     foreach (var item in surgery_id)
            //     {
            //         content += item.Key + ", " + item.Value + ", ";
            //     }
            //     content = content.Substring(0, content.Length - 2);
            //     content += ").\n";

            //     content += "assignment_surgery(";
            //     foreach (var item in assignment_surgery)
            //     {
            //         content += item.Key + ", " + item.Value + ", ";
            //     }
            //     content = content.Substring(0, content.Length - 2);
            //     content += ").\n";

                await File.WriteAllTextAsync("PlanningModule\\knowledge_base\\kb-" + date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2") + ".pl", "content");

                if(File.Exists("PlanningModule\\knowledge_base\\kb-" + date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2") + ".pl"))
                {
                    return true;
                }
                else
                {
                    return false;
                }

            }catch(Exception e)
            {
                throw new Exception("Error creating file content", e);
            }
        }
    }
}