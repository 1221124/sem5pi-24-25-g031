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
            string _agendaOperationRoom,
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

                content += _agendaOperationRoom;

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

                File.Create(filePath).Dispose();

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

        public (string absolutePrologPath, string command1, string command2, string command3) PreparePrologCommand(SurgeryRoomNumber surgeryRoomNumber, DateTime date, int option) {
            string surgeryRoom = SurgeryRoomNumberUtils.ToString(surgeryRoomNumber).ToLower();
            Console.WriteLine($"Surgery Room: {surgeryRoom}");
            Console.WriteLine($"Date: {date}");
            string dateStr = date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2");
            Console.WriteLine($"DateStr: {dateStr}");

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
            string absolutePrologPath = Path.Combine(projectRootPath, AppSettings.PrologPathLAPR5);
            absolutePrologPath = absolutePrologPath.Replace(@"\\", "/");
            
            Console.WriteLine("Current Directory: " + Directory.GetCurrentDirectory());
            Console.WriteLine("Resolved Prolog Path: " + absolutePrologPath);

            string kbFilePath = Path.Combine(absolutePrologPath, "knowledge_base", $"kb-{dateStr}.pl");
            kbFilePath = kbFilePath.Replace(@"\\", "/");
            string codeFilePath = Path.Combine(absolutePrologPath, "code", AppSettings.PrologFileScheduling);
            codeFilePath = codeFilePath.Replace(@"\\", "/");
            string codeFilePathFirstHeuristic = Path.Combine(absolutePrologPath, "code", AppSettings.PrologFileFirstHeuristic);
            codeFilePathFirstHeuristic = codeFilePathFirstHeuristic.Replace(@"\\", "/");

            if (!File.Exists(kbFilePath) || !File.Exists(codeFilePath) || !File.Exists(codeFilePathFirstHeuristic))
            {
                throw new FileNotFoundException("Prolog file(s) not found.");
            }

            string command1 = $@"consult('knowledge_base/kb-{dateStr}.pl').";
            string command2;
            if (option == 0) {
                command2 = $@"consult('code/{AppSettings.PrologFileScheduling}').";
            } else if (option == 1) {
                command2 = $@"consult('code/{AppSettings.PrologFileFirstHeuristic}').";
            } else {
                throw new Exception("Invalid option.");
            }
            string command3 = $@"schedule_appointments({surgeryRoom},{dateStr},AppointmentsGenerated,StaffAgendaGenerated,BestFinishingTime).";

            Console.WriteLine("Absolute Prolog Path: " + absolutePrologPath);
            Console.WriteLine("Prolog Command 1: " + command1);
            Console.WriteLine("Prolog Command 2: " + command2);
            Console.WriteLine("Prolog Command 3: " + command3);

            return (absolutePrologPath, command1, command2, command3);
        }

        public string RunPrologEngine((string absolutePrologPath, string command1, string command2, string command3) command)
        {
            Console.WriteLine("Running Prolog Engine...");
            ProcessStartInfo psi = new ProcessStartInfo
            {
                FileName = "swipl", 
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
                WorkingDirectory = command.absolutePrologPath
            };

            using (Process process = new Process())
            {
                process.StartInfo = psi;
                process.Start();
                
                using (var writer = process.StandardInput)
                {
                    if (writer.BaseStream.CanWrite)
                    {
                        writer.WriteLine("set_prolog_flag(answer_write_options,[max_depth(0)]).");
                        writer.WriteLine(command.command1);
                        writer.WriteLine(command.command2);
                        writer.WriteLine(command.command3);
                        writer.WriteLine("halt.");
                    }
                }
            
                string result = process.StandardOutput.ReadToEnd();
                process.StandardInput.Close();

                process.WaitForExit();
                if (!process.HasExited)
                {
                    process.Kill();
                }

                Console.WriteLine("Prolog Output: ");
                Console.WriteLine(result);

                return result;
            }
        }

        public PrologResponse? ParsePrologResponse(string prologOutput)
        {
            string[] lines = prologOutput.Split(new[] { Environment.NewLine }, StringSplitOptions.None);
            //skip to the line starting with "Final Result"
            int i = 0;
            while (i < lines.Length && !lines[i].StartsWith("Final Result"))
            {
                if (lines[i].StartsWith("false"))
                {
                    return null;
                }
                i++;
            }

            //Final Result: AgOpRoomBetter=[0,134,req2, 135,269,req3, 270,404,req1]
            //LAgDoctorsBetter=[(d20246,[(45,105,req2),(45,105,req2)]),(d20245,[(180,240,req3),(180,240,req3)]),(d20244,[(45,105,req2),(180,240,req3),(315,375,req1)]),(d20248,[(315,375,req1)]),(d20247,[(315,375,req1)])]
            //TFinOp=404
            //Tempo de geracao da solucao:0.0009179115295410156

            //parse AgOpRoomBetter
            string appointmentsGenerated = lines[i].Substring(lines[i].IndexOf('[') + 1, lines[i].LastIndexOf(']') - lines[i].IndexOf('[') - 1);
            Console.WriteLine("AppointmentsGenerated RESULT: " + appointmentsGenerated + "\n");

            //parse LAgDoctorsBetter
            i++;
            string trimmedStaffAgendaGenerated = lines[i].Substring(lines[i].IndexOf('[') + 1, lines[i].LastIndexOf(']') - lines[i].IndexOf('[') - 1);

            string[] elements = Regex.Split(trimmedStaffAgendaGenerated, ", ");
            string staffAgendaGenerated = string.Join(" ; ", elements);
            Console.WriteLine("StaffAgendaGenerated RESULT: " + staffAgendaGenerated + "\n");

            //parse TFinOp
            i++;
            string bestFinishingTime = lines[i].Substring(lines[i].IndexOf('=') + 1);
            
            return new PrologResponse(appointmentsGenerated, staffAgendaGenerated, bestFinishingTime);
        }

        public bool DestroyFile(DateTime dateTime)
        {
            try {
                string dateStr = dateTime.Year.ToString() + dateTime.Month.ToString("D2") + dateTime.Day.ToString("D2");

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
                string absolutePrologPath = Path.Combine(projectRootPath, AppSettings.PrologPathLAPR5);
                absolutePrologPath = absolutePrologPath.Replace(@"\\", "/");
                
                string directoryPath = Path.Combine(absolutePrologPath, "knowledge_base");
                string filePath = Path.Combine(directoryPath, $"kb-{dateStr}.pl");

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error: {e.Message}");
                Console.WriteLine($"Stack Trace: {e.StackTrace}");
                throw new Exception("Error destroying file content", e);
            }
        }
    }
}