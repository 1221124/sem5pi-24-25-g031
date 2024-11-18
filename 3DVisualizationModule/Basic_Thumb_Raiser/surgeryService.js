export default class SurgeryService {
    constructor(rooms) {
        this.rooms = rooms; // Lista de salas 3D
    }

    async fetchAndUpdateRooms() {
        try {
            const surgeries = await fetch("http://localhost:5000/api/Surgeries").then((res) => res.json());
            this.updateRoomsBasedOnSurgeries(surgeries);
        } catch (error) {
            console.error("Erro ao buscar cirurgias e atualizar salas:", error);
        }
    }

    updateRoomsBasedOnSurgeries(surgeries) {
        const currentTime = new Date();
        surgeries.forEach((surgery) => {
            const room = this.rooms.find((r) => r.number === surgery.surgeryRoom);

            if (room) {
                const isOccupied = surgery.currentStatus === "AVAILABLE" && isTimeMatching(currentTime, surgery);
                room.setOccupiedState(isOccupied);
            }
        });
    }
}

function isTimeMatching(currentTime, surgery) {
    const surgeryStartTime = new Date(surgery.startTime);
    const surgeryEndTime = new Date(surgery.endTime);
    return currentTime >= surgeryStartTime && currentTime <= surgeryEndTime;
}
