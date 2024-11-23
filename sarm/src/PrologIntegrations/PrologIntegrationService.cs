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

        public (string absolutePrologPath, string command1, string command2, string command3) PreparePrologCommand(SurgeryRoomNumber surgeryRoomNumber, DateTime date) {
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
            string codeFilePath = Path.Combine(absolutePrologPath, "code", AppSettings.PrologFile);
            codeFilePath = codeFilePath.Replace(@"\\", "/");

            if (!File.Exists(kbFilePath) || !File.Exists(codeFilePath)) 
            {
                throw new FileNotFoundException("Prolog file(s) not found.");
            }

            // string command1 = $@"cd('{absolutePrologPath}').";
            // string command2 = $@"consult('knowledge_base/kb-{dateStr}.pl').";
            // string command3 = $@"consult('code/{AppSettings.PrologFile}').";
            // string command4 = $@"schedule_appointments({surgeryRoom},{dateStr},AppointmentsGenerated,StaffAgendaGenerated,BestFinishingTime).";
            // string command1 = $@"cd(""{absolutePrologPath.Replace(@"\", "/")}"").";
            // string command1 = $@"consult('knowledge_base/kb-{dateStr}.pl').";
            string command1 = $@"consult('knowledge_base/kb-{dateStr}.pl').";
            string command2 = $@"consult('code/{AppSettings.PrologFile}').";
            string command3 = $@"schedule_appointments({surgeryRoom},{dateStr},AppointmentsGenerated,StaffAgendaGenerated,BestFinishingTime).";

            // string prologCommand = $@"
            // cd('{absolutePrologPath}'),
            // consult('knowledge_base/kb-{dateStr}.pl'),
            // consult('code/{AppSettings.PrologFile}'),
            // schedule_appointments({surgeryRoom},{dateStr},AppointmentsGenerated,StaffAgendaGenerated,BestFinishingTime).
            // ";

            Console.WriteLine("Absolute Prolog Path: " + absolutePrologPath);
            Console.WriteLine("Prolog Command 1: " + command1);
            Console.WriteLine("Prolog Command 2: " + command2);
            Console.WriteLine("Prolog Command 3: " + command3);

            return (absolutePrologPath, command1, command2, command3);
            // return (command2, command3, command4);
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
                // try {
                    process.Start();
                    
                    using (var writer = process.StandardInput)
                    {
                        if (writer.BaseStream.CanWrite)
                        {
                            writer.WriteLine(command.command1);
                            writer.WriteLine(command.command2);
                            writer.WriteLine(command.command3);
                            // writer.WriteLine("halt.");
                        }
                    }
                
                    string result = process.StandardOutput.ReadToEnd();
                    // string errors = process.StandardError.ReadToEnd();
                    process.StandardInput.Close();

                    // process.WaitForExit();
                    // if (!process.HasExited)
                    // {
                    //     process.Kill();
                    // }

                    Console.WriteLine("Prolog Output: ");
                    Console.WriteLine(result);
                    // Console.WriteLine("Prolog Errors: ");
                    // Console.WriteLine(errors);

                    // if (!string.IsNullOrEmpty(errors))
                    // {
                    //     // Console.WriteLine("Prolog Errors: " + errors);
                    //     throw new Exception($"Error executing Prolog: {errors}");
                    // }

                    // Console.WriteLine("Prolog Output: " + result);
                    return result;
                // } catch (Exception e) {
                //     if (process != null && !process.HasExited)
                //     {
                //         process.Kill();
                //     }
                //     Console.WriteLine($"Error: {e.Message}");
                //     Console.WriteLine($"Stack Trace: {e.StackTrace}");
                //     throw new Exception("Error running Prolog engine", e);
                // }
            }
        }

        // public string RunPrologEngine(string absolutePrologPath, string command)
        // {
        //     Console.WriteLine("Running Prolog Engine...");
        //     ProcessStartInfo psi = new ProcessStartInfo
        //     {
        //         FileName = "swipl", //needs to have swipl/bin in the PATH
        //         Arguments = "-q -t halt",
        //         RedirectStandardInput = true,
        //         RedirectStandardOutput = true,
        //         RedirectStandardError = true,
        //         UseShellExecute = false,
        //         CreateNoWindow = true,
        //         WorkingDirectory = absolutePrologPath
        //     };

        //     using (Process process = new Process())
        //     {
        //         try {
        //             process.StartInfo = psi;
        //             process.Start();

        //             using (var writer = process.StandardInput)
        //             {
        //                 if (writer.BaseStream.CanWrite)
        //                 {
        //                     writer.WriteLine(command);
        //                 }
        //             }

        //             string result = process.StandardOutput.ReadToEnd();
        //             string errors = process.StandardError.ReadToEnd();
        //             process.WaitForExit();

        //             if (!string.IsNullOrEmpty(errors))
        //             {
        //                 throw new Exception($"Error executing Prolog: {errors}");
        //             }

        //             Console.WriteLine("Prolog Output: " + result);
        //             return result;
        //         } catch (Exception e) {
        //             if (process != null && !process.HasExited)
        //             {
        //                 process.Kill();
        //             }
        //             Console.WriteLine($"Error: {e.Message}");
        //             Console.WriteLine($"Stack Trace: {e.StackTrace}");
        //             throw new Exception("Error running Prolog engine", e);
        //         }
        //     }
        // }

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