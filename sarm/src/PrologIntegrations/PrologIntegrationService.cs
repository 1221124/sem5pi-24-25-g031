using System.Diagnostics;
using System.Text.RegularExpressions;
using DDDNetCore.Domain.SurgeryRooms;
using Infrastructure;

namespace DDDNetCore.PrologIntegrations
{
    public class PrologIntegrationService
    {
        public async Task<bool> CreateFile(
            List<string> _staff,
            List<string> _agendaStaff,
            List<string> _timetable,
            List<string> _surgery,
            List<string> _surgeryId,
            List<string> _surgeryRequiredStaff,
            List<string> _agendaOperationRoom,
            DateTime date)
        {
            try{
                string content = "";

                foreach (var item in _agendaStaff)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _timetable)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _staff)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _surgery)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _surgeryRequiredStaff)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _surgeryId)
                {
                    content += item + "\n";
                }
                content += "\n";

                foreach (var item in _agendaOperationRoom)
                {
                    content += item + "\n";
                }

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
                
                string directoryPath = Path.Combine(projectRootPath, "PlanningModule", "lapr5", "knowledge_base");

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

        public string PreparePrologCommand(SurgeryRoomNumber surgeryRoomNumber, DateTime date) {
            string surgeryRoom = SurgeryRoomNumberUtils.ToString(surgeryRoomNumber).ToLower();
            string dateStr = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");

            string prologCommand = $@"
            consult('{AppSettings.PrologPathLAPR5}knowledge_base/kb-{dateStr}.pl'),
            consult('{AppSettings.PrologPathLAPR5}code/{AppSettings.PrologFile}'),
            schedule_appointments({surgeryRoom},{dateStr},AppointmentsGenerated,StaffAgendaGenerated,BestFinishingTime).
            ";

            return prologCommand;
        }

        public string RunPrologEngine(string command)
        {
            ProcessStartInfo psi = new ProcessStartInfo
            {
                FileName = "swipl", //needs to have swipl/bin in the PATH
                Arguments = "-q -t halt",
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (Process process = new Process())
            {
                process.StartInfo = psi;
                process.Start();

                using (var writer = process.StandardInput)
                {
                    if (writer.BaseStream.CanWrite)
                    {
                        writer.WriteLine(command);
                    }
                }

                string result = process.StandardOutput.ReadToEnd();
                string errors = process.StandardError.ReadToEnd();
                process.WaitForExit();

                if (!string.IsNullOrEmpty(errors))
                {
                    throw new Exception($"Error executing Prolog: {errors}");
                }

                return result;
            }
        }

        public PrologResponse ParsePrologResponse(string prologOutput)
        {
            var appointmentsPattern = @"AppointmentsGenerated\s*=\s*(\[.*?\])";
            var staffAgendaPattern = @"StaffAgendaGenerated\s*=\s*(\[.*?\])";
            var finishingTimePattern = @"BestFinishingTime\s*=\s*(\d+)";

            var appointmentsMatch = Regex.Match(prologOutput, appointmentsPattern);
            var staffAgendaMatch = Regex.Match(prologOutput, staffAgendaPattern);
            var finishingTimeMatch = Regex.Match(prologOutput, finishingTimePattern);

            var appointmentsGenerated = appointmentsMatch.Success ? appointmentsMatch.Groups[1].Value : null;
            var staffAgendaGenerated = staffAgendaMatch.Success ? staffAgendaMatch.Groups[1].Value : null;
            var bestFinishingTime = finishingTimeMatch.Success ? finishingTimeMatch.Groups[1].Value : null;
            
            return new PrologResponse(appointmentsGenerated, staffAgendaGenerated, bestFinishingTime);
        }
    }
}