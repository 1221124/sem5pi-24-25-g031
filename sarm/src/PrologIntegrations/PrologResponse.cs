namespace DDDNetCore.PrologIntegrations
{
    public class PrologResponse
    {
        public string AppointmentsGenerated { get; set; }
        public string StaffAgendaGenerated { get; set; }
        public string BestFinishingTime { get; set; }

        public PrologResponse(string appointmentsGenerated, string staffAgendaGenerated, string bestFinishingTime)
        {
            AppointmentsGenerated = appointmentsGenerated;
            StaffAgendaGenerated = staffAgendaGenerated;
            BestFinishingTime = bestFinishingTime;
        }

        public PrologResponse()
        {
        }

        public static implicit operator PrologResponse(string response)
        {
            var splitResponse = response.Split("\n");
            var appointmentsGenerated = splitResponse[0].Split("= ")[1];
            var staffAgendaGenerated = splitResponse[1].Split("= ")[1];
            var bestFinishingTime = splitResponse[2].Split("= ")[1];
            return new PrologResponse(appointmentsGenerated, staffAgendaGenerated, bestFinishingTime);
        }
    }
}