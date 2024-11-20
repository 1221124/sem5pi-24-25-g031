export default class SurgeryService {
    constructor(rooms) {
        this.rooms = rooms; // Lista de salas 3D
    }

    async fetchMap() {
        try {
            const response = await fetch("./Loquitas.json"); // Caminho relativo do arquivo
            if (!response.ok) {
                throw new Error("Erro ao carregar o mapa Loquitas.json");
            }
            const mapData = await response.json();
            return mapData;
        } catch (error) {
            console.error("Erro ao buscar Loquitas.json:", error);
            return null;
        }
    }

    async fetchAndUpdateRooms() {
        try {
            const surgeriesRooms = await fetch("http://localhost:5500/api/SurgeryRooms").then((res) => res.json());
            await this.updateRoomsBasedOnSurgeries(surgeriesRooms);
        } catch (error) {
            console.error("Erro ao buscar cirurgias e atualizar salas:", error);
        }
    }

    async updateRoomsBasedOnSurgeries(surgeriesRooms) {
        try{
            const mapData = await this.fetchMap();
            if (!mapData) return;

            surgeriesRooms.forEach((surgery) => {
                const room = surgery.surgeryRoom;

                if(room === 'OR1' && surgery.currentStatus === 'OCUPIED'){
                    const map = mapData.map;
                    const or1Coordinates = [2, 2];

                    map[or1Coordinates[0]][or1Coordinates[1]] = 6; // Define o número "6"
                    console.log(`Atualizado o mapa para OR1 nas coordenadas ${or1Coordinates}`);
                }
            });
        } catch (error) {
            console.error("Erro ao atualizar salas com base nas cirurgias:", error);
        }
    }
}

function isTimeMatching(currentTime, surgery) {
    const surgeryStartTime = new Date(surgery.startTime);
    const surgeryEndTime = new Date(surgery.endTime);
    return currentTime >= surgeryStartTime && currentTime <= surgeryEndTime;
}
