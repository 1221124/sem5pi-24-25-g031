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
                    Console.WriteLine(item);
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

                if (AppSettings.Environment == "Production")
                {
                    //directory is sarm, which is the base directory of the project in production
                    directoryPath = projectRootPath;
                    Console.WriteLine("Production Environment directory path: " + directoryPath);
                    //copy file to VM
                    string scpCommand = $"scp \"{directoryPath}/PlanningModule/lapr5/knowledge_base/kb-{date.Year.ToString() + date.Month.ToString("D2") + date.Day.ToString("D2")}.pl\" root@10.9.10.31:/home/prolog/lapr5/knowledge_base/";
                    Console.WriteLine("SCP Command: " + scpCommand);
                    SendToVM(scpCommand);
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

        public (string absolutePrologPath, string command1, string command2, string command3) PreparePrologCommand(SurgeryRoomNumber? surgeryRoomNumber, DateTime date, int option) {
            string surgeryRoom = "";
            if (surgeryRoomNumber.HasValue) {
                surgeryRoom = SurgeryRoomNumberUtils.ToString(surgeryRoomNumber.Value).ToLower();
                Console.WriteLine($"Surgery Room: {surgeryRoom}");
            }

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

            if (AppSettings.Environment == "Production")
            {
                absolutePrologPath = "/home/prolog/lapr5";
            }

            string kbFilePath = Path.Combine(absolutePrologPath, "knowledge_base", $"kb-{dateStr}.pl");
            kbFilePath = kbFilePath.Replace(@"\\", "/");
            string codeFilePath = Path.Combine(absolutePrologPath, "code", AppSettings.PrologFileScheduling);
            codeFilePath = codeFilePath.Replace(@"\\", "/");
            string codeFilePathFirstHeuristic = Path.Combine(absolutePrologPath, "code", AppSettings.PrologFileFirstHeuristic);
            codeFilePathFirstHeuristic = codeFilePathFirstHeuristic.Replace(@"\\", "/");
            string codeFilePathAllRooms = Path.Combine(absolutePrologPath, "code", AppSettings.PrologFileAllRooms);
            codeFilePathAllRooms = codeFilePathAllRooms.Replace(@"\\", "/");

            if (!File.Exists(kbFilePath) || !File.Exists(codeFilePath) || !File.Exists(codeFilePathFirstHeuristic) || !File.Exists(codeFilePathAllRooms))
            {
                throw new FileNotFoundException("Prolog file(s) not found.");
            }

            string command1 = $@"consult('knowledge_base/kb-{dateStr}.pl').";
            string command2 = option switch
            {
                0 => $@"consult('code/{AppSettings.PrologFileScheduling}').",
                1 => $@"consult('code/{AppSettings.PrologFileFirstHeuristic}').",
                2 => $@"consult('code/{AppSettings.PrologFileAllRooms}').",
                _ => throw new ArgumentException("Invalid option."),
            };
            string command3 = $@"schedule_appointments({dateStr},AppointmentsGenerated,StaffAgendaGenerated,BestFinishingTime).";
            if (surgeryRoom != "") command3 = $@"schedule_appointments({surgeryRoom},{dateStr},AppointmentsGenerated,StaffAgendaGenerated,BestFinishingTime).";

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
                        writer.WriteLine("abort.");
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

        public void SendToVM(string command)
        {
            Console.WriteLine("Sending to VM...");
            var processInfo = new ProcessStartInfo("cmd.exe", "/c " + command)
            {
                RedirectStandardOutput = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (var process = Process.Start(processInfo))
            {
                if (process == null)
                {
                    throw new InvalidOperationException("Process could not be started.");
                }

                using (var reader = process.StandardOutput)
                {
                   string output = reader.ReadToEnd();
                   Console.WriteLine(output);
                }
            }
        }

        public Dictionary<SurgeryRoomNumber, PrologResponse> ParsePrologResponse(string prologOutput)
        {
            Dictionary<SurgeryRoomNumber, PrologResponse> result = new Dictionary<SurgeryRoomNumber, PrologResponse>();

            // split prologOutput by "SEPARATION" line
            string[] prologOutputSplitted = prologOutput.Split(new[] { "SEPARATION" }, StringSplitOptions.None);

            Console.WriteLine("Prolog Output Splitted...");

            foreach (var item in prologOutputSplitted)
            {
                if (item == prologOutputSplitted.Last())
                {
                    break;
                }

                string[] lines = item.Split(new[] { Environment.NewLine }, StringSplitOptions.None);

                //skip until the first line with "FOR ROOM"
                int i = 0;
                while (!lines[i].StartsWith("FOR ROOM"))
                {
                    i++;
                }

                Console.WriteLine("For room found...");

                //parse room number: FOR ROOM or1
                SurgeryRoomNumber roomNumber = SurgeryRoomNumberUtils.FromString(lines[i].Split(" ")[2].Trim());

                Console.WriteLine($"Room Number: {roomNumber}");

                //skip to next line to get AppointmentsGenerated (line starts with AppointmentsGenerated)
                i++;
                string appointmentsGenerated = lines[i].Substring(lines[i].IndexOf('[') + 1, lines[i].LastIndexOf(']') - lines[i].IndexOf('[') - 1);

                Console.WriteLine($"Appointments Generated: {appointmentsGenerated}");
                //skip to next line to get StaffAgendaGenerated (line starts with StaffAgendaGenerated)
                i++;
                string trimmedStaffAgendaGenerated = lines[i].Substring(lines[i].IndexOf('[') + 1, lines[i].LastIndexOf(']') - lines[i].IndexOf('[') - 1);
            
                string[] elements = Regex.Split(trimmedStaffAgendaGenerated, ", ");
                string staffAgendaGenerated = string.Join(" ; ", elements);

                Console.WriteLine($"Staff Agenda Generated: {staffAgendaGenerated}");

                //skip to next line to get BestFinishingTime (line starts with BestFinishingTime)
                i++;
                string bestFinishingTime = lines[i].Substring(lines[i].IndexOf(':') + 1);

                int time = int.Parse(bestFinishingTime.Trim());

                Console.WriteLine($"Best Finishing Time: {time}");

                if (time < 1441) {
                    Console.WriteLine("Adding to result finishing time: " + time);    
                    result.Add(roomNumber, new PrologResponse(appointmentsGenerated, staffAgendaGenerated, bestFinishingTime));
                }
            }

            Console.WriteLine("Prolog Response Parsed...");

            Console.WriteLine("Result: ");

            return result;
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