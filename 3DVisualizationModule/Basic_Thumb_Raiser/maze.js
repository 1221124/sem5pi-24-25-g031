import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import TWEEN from "three/addons/libs/tween.module.js";


/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {
    constructor(parameters, camera) {
        this.selectedBedRoomNumber = '';
        this.selectedBed = '';
        this.descriptionWidth = '';
        this.descriptionHeight = '';
        this.camera = camera;
        this.onLoad = function (description) {
            // Store the maze's map and size
            this.descriptionWidth = description.size.width;
            this.descriptionHeight = description.size.height;
            this.map = description.map;
            this.size = description.size;

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.initialDirection = description.initialDirection;

            // Store the maze's exit location
            this.exitLocation = this.cellToCartesian(description.exitLocation);

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, size: description.size });
            this.object.add(this.ground.object);

            // Create a wall
            this.wall = new Wall({ textureUrl: description.wallTextureUrl });

            this.doorMaterial = this.wall.object.children[0].material.clone();
            this.doorMaterial.transparent = true;
            this.doorMaterial.opacity = 0.5;

            this.door = new Wall({ textureUrl: description.doorTextureUrl });

            // Load hospital bed model
            const bedLoader = new GLTFLoader();

            this.doors = [];

            this.surgicalBeds = [];

            this.objectToIntersect = new THREE.Group();
            this.mouse = new THREE.Vector2();
            this.raycaster = new THREE.Raycaster();

            this.rayLineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
            this.rayLineGeometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 0)
            ]);
            this.rayLine = new THREE.Line(this.rayLineGeometry, this.rayLineMaterial);
            this.object.add(this.rayLine);

            window.addEventListener("mousedown", (event) => this.onMouseDown(event));

            // Build the maze
            let wallObject, bedObject, doorObject;
            for (let i = 0; i <= description.size.width; i++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                for (let j = 0; j <= description.size.height; j++) { // In order to represent the southmost walls, the map height is one row greater than the actual maze height
                    /*
                     * description.map[][] | North wall | West wall
                     * --------------------+------------+-----------
                     *          0          |     No     |     No
                     *          1          |     No     |    Yes
                     *          2          |    Yes     |     No
                     *          3          |    Yes     |    Yes
                     *          4          |     No     |     No
                     */
                    if (description.map[j][i] == 2 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0);
                        this.object.add(wallObject);
                    }
                    if (description.map[j][i] == 1 || description.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - description.size.width / 2.0, 0.5, j - description.size.height / 2.0 + 0.5);
                        this.object.add(wallObject);
                    }
                    // Construir portas
                    if (description.map[j][i] === 4) {
                        doorObject = this.door.object.clone();
                        doorObject.position.set(i - description.size.width / 2.0 + 0.5, 0.5, j - description.size.height / 2.0);
                        this.doors.push(doorObject);

                        this.object.add(doorObject);
                    }
                    if (description.map[j][i] === 5) {

                        bedLoader.load('./models/gltf/bed.glb', (gltf) => {
                            bedObject = gltf.scene;
                            bedObject.position.set(
                                i - description.size.width / 2.0 + 0.5,
                                0.5,
                                j - description.size.height / 2.0
                            );

                            bedObject.scale.set(1, 1, 1);
                            this.objectToIntersect.add(bedObject);
                            this.object.add(bedObject);

                            this.surgicalBeds.push({
                                object: bedObject,
                                position: {
                                    x: bedObject.position.x,
                                    y: bedObject.position.y,
                                    z: bedObject.position.z
                                }
                            });
                        });

                        this.getSurgeries().then((response) => {
                            if (response.status === 200) {

                                const surgeryRoomsWrapper = response.body.surgeryRooms;
                                if (Array.isArray(surgeryRoomsWrapper) && surgeryRoomsWrapper.length > 0) {

                                    surgeryRoomsWrapper.forEach((surgeryRoom) => {
                                        if (surgeryRoom.CurrentStatus === 'OCCUPIED') {
                                            const roomNumber = surgeryRoom.SurgeryRoomNumber;
                                            switch (roomNumber) {
                                                case 'OR1': {
                                                    if (i === 2 && j === 2) {
                                                        bedLoader.load('./models/gltf/bedWithBody.glb', (gltf) => {
                                                            const bedObject = gltf.scene;
                                                            bedObject.position.set(
                                                                i - description.size.width / 2.0 + 0.5,
                                                                0.5,
                                                                j - description.size.height / 2.0
                                                            );
                                                            bedObject.scale.set(0.8, 0.8, 0.8);
                                                            this.object.add(bedObject);
                                                        });
                                                        console.log('Cama carregada para OR1');
                                                    }
                                                    break;
                                                }
                                                case 'OR2': {
                                                    if (i === 6 && j === 2) {
                                                        bedLoader.load('./models/gltf/bedWithBody.glb', (gltf) => {
                                                            const bedObject = gltf.scene;
                                                            bedObject.position.set(
                                                                i - description.size.width / 2.0 + 0.5,
                                                                0.5,
                                                                j - description.size.height / 2.0
                                                            );
                                                            bedObject.scale.set(0.8, 0.8, 0.8);
                                                            this.object.add(bedObject);
                                                        });
                                                        console.log('Cama carregada para OR2');
                                                    }
                                                    break;
                                                }
                                                case 'OR3': {
                                                    if (i === 10 && j === 2) {
                                                        bedLoader.load('./models/gltf/bedWithBody.glb', (gltf) => {
                                                            const bedObject = gltf.scene;
                                                            bedObject.position.set(
                                                                i - description.size.width / 2.0 + 0.5,
                                                                0.5,
                                                                j - description.size.height / 2.0
                                                            );
                                                            bedObject.scale.set(0.8, 0.8, 0.8);
                                                            this.object.add(bedObject);
                                                        });
                                                        console.log('Cama carregada para OR3');
                                                    }
                                                    break;
                                                }
                                                case 'OR4': {
                                                    if (i === 2 && j === 10) {
                                                        bedLoader.load('./models/gltf/bedWithBody.glb', (gltf) => {
                                                            const bedObject = gltf.scene;
                                                            bedObject.position.set(
                                                                i - description.size.width / 2.0 + 0.5,
                                                                0.5,
                                                                j - description.size.height / 2.0
                                                            );
                                                            bedObject.scale.set(0.8, 0.8, 0.8);
                                                            this.object.add(bedObject);
                                                        });
                                                        console.log('Cama carregada para OR4');
                                                    }
                                                    break;
                                                }
                                                case 'OR5': {
                                                    if (i === 6 && j === 10) {
                                                        bedLoader.load('./models/gltf/bedWithBody.glb', (gltf) => {
                                                            const bedObject = gltf.scene;
                                                            bedObject.position.set(
                                                                i - description.size.width / 2.0 + 0.5,
                                                                0.5,
                                                                j - description.size.height / 2.0
                                                            );
                                                            bedObject.scale.set(0.8, 0.8, 0.8);
                                                            this.object.add(bedObject);
                                                        });
                                                        console.log('Cama carregada para OR5');
                                                    }
                                                    break;
                                                }
                                                case 'OR6': {
                                                    if (i === 10 && j === 10) {
                                                        bedLoader.load('./models/gltf/bedWithBody.glb', (gltf) => {
                                                            const bedObject = gltf.scene;
                                                            bedObject.position.set(
                                                                i - description.size.width / 2.0 + 0.5,
                                                                0.5,
                                                                j - description.size.height / 2.0
                                                            );
                                                            bedObject.scale.set(0.8, 0.8, 0.8);
                                                            this.object.add(bedObject);
                                                        });
                                                        console.log('Cama carregada para OR6');
                                                    }
                                                    break;
                                                }
                                                default: {
                                                    console.log(`Nenhuma operação para ${roomNumber}`);
                                                    break;
                                                }
                                            }
                                        }
                                    });

                                }
                            }
                        });
                    }
                }
            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        }

        this.onMouseDown = function (event) {
            // Update mouse coordinates
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera.object);

            // Check for intersections
            const intersects = this.raycaster.intersectObjects(this.surgicalBeds.map(bed => bed.object));


            if (intersects.length > 0) {

                const intersectedObject = intersects[0].object;

                const selectedBed = this.surgicalBeds.find(bed => {
                    let found = false;
                    bed.object.traverse(child => {
                        if (child.uuid === intersectedObject.uuid) {
                            found = true;
                        }
                    });
                    return found;
                });

                if (selectedBed) {
                    console.log("Selected Bed UUID:", selectedBed.object.uuid);
                    console.log("Selected Bed Position:", selectedBed.position);
                    this.moveCameraToRoom(selectedBed.position);

                    console.log("selectBed.position: ", selectedBed.position);
                    console.log("Description: ", this.description);
                    console.log("Description Width: ", this.descriptionWidth);
                    console.log("Description Height: ", this.descriptionHeight);

                    var i = selectedBed.position.x - 0.5 + (this.descriptionWidth/2) ;
                    console.log("i: ", i);
                    var j = selectedBed.position.z + (this.descriptionHeight/2);
                    console.log("j: ", j);

                    if (i === 2 && j === 2) {
                        this.selectedBedRoomNumber = 'OR1';
                    } else if (i === 6 && j === 2) {
                        this.selectedBedRoomNumber = 'OR2';
                    } else if (i === 10 && j === 2) {
                        this.selectedBedRoomNumber = 'OR3';
                    } else if (i === 2 && j === 10) {
                        this.selectedBedRoomNumber = 'OR4';
                    } else if (i === 6 && j === 10) {
                        this.selectedBedRoomNumber = 'OR5';
                    } else if (i === 10 && j === 10) {
                        this.selectedBedRoomNumber = 'OR6';
                    } else {
                        this.selectedBedRoomNumber = '';
                    }

                    console.log("selected bed rrom: ", this.selectedBedRoomNumber);

                    if (selectedBed !== '') {
                        window.addEventListener("keydown", (event) => {
                            if (event.key === 'i')
                                this.obtainRoomDataWhenPressingI(selectedBed);
                        });
                    }
                    

                } else {
                    console.log("No matching bed found");
                }
            }
        }

        this.moveCameraToRoom = function (roomCenter) {
            console.log("Room Center", roomCenter);
        
            const initialTarget = this.camera.target.clone();
            const target = new THREE.Vector3(roomCenter.x, roomCenter.y, roomCenter.z);
        
            let startTime = null;
        
            const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
        
                const elapsed = (timestamp - startTime) / 1000;
        
                if (elapsed > 2) return;
        
                const progress = elapsed / 2;
        
                this.camera.setTarget(initialTarget.clone().lerp(target, progress));
        
                requestAnimationFrame(animate);
            }
        
            requestAnimationFrame(animate);
        };        

        this.getRoomCenter = function (i, j, size) {
            return {
                x: i - size.width / 2.0 + 0.5,
                y: 0,
                z: j - size.height / 2.0 + 0.5
            };
        };

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error)
        );


    }

    addIntersectableObject(object, userData = {}) {
        object.userData = { ...object.userData, ...userData }; // Add metadata for the object
        this.objectsToIntersect.push(object);
    }

    loadGLBModel(path, position, scale, userData = {}) {
        const loader = new GLTFLoader();
        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                model.position.copy(position);
                model.scale.copy(scale);

                this.addIntersectableObject(model, userData); // Add to the list of intersectable objects
                this.object.add(model); // Add to the scene
            },
            undefined,
            (error) => {
                console.error("Error loading GLB model:", error);
            }
        );
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.width / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.height / 2.0 + 0.5) * this.scale.z)
    }

    isRobotNearDoor(robotPosition, doorPosition, threshold = 1.0) {
        const distance = robotPosition.distanceTo(doorPosition);
        return distance < threshold;
    }

    openDoorIfNearby(robotPosition, door, description) {
        // Check if the robot is near the door
        if (this.isRobotNearDoor(robotPosition, door.object.position)) {
            // Atualize a posição da porta no arquivo Loquitas.json
            for (let j = 0; j < description.map.length; j++) {
                for (let i = 0; i < description.map[j].length; i++) {
                    if (description.map[j][i] === 4) { // Se a porta estiver fechada
                        description.map[j][i] = 3; // Atualiza para a porta aberta
                    }
                }
            }
        }
    }

    animateDoorOpening(door, robotPosition) {
        // Check if the robot is near the door and animate it opening
        if (this.isRobotNearDoor(robotPosition, door.object.position)) {
            new TWEEN.Tween(door.object.rotation)
                .to({ y: Math.PI / 2 }, 1000) // A rotação de 0 para 90 graus (abertura)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }
    }


    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.height / 2.0), Math.floor(position.x / this.scale.x + this.size.width / 2.0)];
    }

    distanceToWestWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    distanceToEastWall(position) {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    distanceToNorthWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    distanceToSouthWall(position) {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    foundExit(position) {
        return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };

    addDoor(door) {
        this.doors.push(door); // Adicionar porta ao labirinto
    }

    async getSurgeries() {

        const headers = {
            'Content-Type': 'application/json',
            //'Authorization': 'Bearer'
        }
        const options = {
            method: 'GET',
            headers: headers
        };
        const url = `http://localhost:5500/api/SurgeryRooms`;
        console.log("Fetching surgery rooms from:", url);

        try {
            const response = await fetch(url, options);
            if (response.status === 200) {

                const responseBody = await response.json();
                console.log('Response body:', responseBody);
                if (responseBody && Array.isArray(responseBody.surgeryRooms)) {
                    const surgeryRooms = responseBody.surgeryRooms.map((room) => ({
                        SurgeryRoomNumber: room.surgeryRoomNumber,
                        RoomTypeCode: room.roomTypeCode.value,
                        RoomCapacity: room.roomCapacity.capacity,
                        AssignedEquipment: room.assignedEquipment.equipment,
                        CurrentStatus: room.currentStatus,
                        MaintenanceSlots: room.maintenanceSlots.map(slot => ({
                            Start: slot.start || null,
                            End: slot.end || null
                        })),
                        Id: room.id
                    }));
                    console.log("Surgery rooms:", surgeryRooms);

                    return {
                        status: response.status,
                        body: {
                            surgeryRooms: surgeryRooms // Use o array completo mapeado
                        }
                    };
                } else {
                    throw new Error('Unexpected response structure or status');
                }
            } else {
                throw new Error('Unexpected response status: ' + response.status);
            }
        } catch (error) {
            console.error('Error fetching surgery room by number:', error);
            throw error;
        }
    }

    OpenAllDoors() {
        this.doors.forEach(door => {
            // Store the initial X position of each door
            const initialPositionX = door.position.x;
            const targetOffset = 1; // Adjust this value to control how far the door slides
            const duration = 2.5; // Shorter duration in seconds (you can change this to your preferred value)

            let startTime = null; // Track the start time for each animation

            const directionMultiplier = 1; // Set direction based on the array

            function animate(timestamp) {
                if (!startTime) startTime = timestamp; // Initialize start time on first frame
                const elapsed = (timestamp - startTime) / 1000; // Convert timestamp to seconds

                // If the animation has run for the duration, stop the animation
                if (elapsed > duration) return;

                // Calculate the progress as a linear movement from 0 to 1
                const progress = elapsed / duration; // Progress from 0 to 1 over the duration

                // Move door in the correct direction
                door.position.x = initialPositionX + directionMultiplier * progress * targetOffset; // Move left or right

                // Request the next frame of the animation
                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate); // Start the animation loop
        });
    }

    CloseAllDoors() {
        this.doors.forEach(door => {
            // Store the initial X position of each door
            const initialPositionX = door.position.x;
            const targetOffset = 1; // Adjust this value to control how far the door slides
            const duration = 2.5; // Duration in seconds for closing animation
            let startTime = null; // Track the start time for each animation


            const directionMultiplier = -1; // Set direction for closing (move to the right if in otherDoors)

            function animate(timestamp) {
                if (!startTime) startTime = timestamp; // Initialize start time on first frame
                const elapsed = (timestamp - startTime) / 1000; // Convert timestamp to seconds

                // If the animation has run for the duration, stop the animation
                if (elapsed > duration) return;

                // Calculate the progress as a linear movement from 0 to 1
                const progress = elapsed / duration; // Progress from 0 to 1 over the duration

                // Move door in the correct direction
                door.position.x = initialPositionX + directionMultiplier * progress * targetOffset; // Move left or right

                // Request the next frame of the animation
                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate); // Start the animation loop
        });
    }

    async obtainRoomDataWhenPressingI(selectedBed) { 
        let appointment, surgeryRoom;
        console.log("Selected Bed:", selectedBed);
    
        if (!selectedBed) return;
    
        try {
            // Modal setup
            const modalTitle = document.getElementById('modal-title');
            const modalDetails = document.getElementById('modal-details');
    
            modalTitle.textContent = `Current Surgery Room Details`;

            // Fetch the appointment and surgery room data
            surgeryRoom = await this.getSurgeryRoom(this.selectedBedRoomNumber);
            console.log("Surgery Room: ", surgeryRoom);

            // Check if the surgeryRoom is valid or an error
            if (surgeryRoom && surgeryRoom.status !== 404) {
                // Format surgery room details in a more pleasant way
                const surgeryRoomDetails = Object.entries(surgeryRoom)
                    .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                    .join("<br>");
            
                modalDetails.innerHTML = `<h3>Surgery Room Info</h3>${surgeryRoomDetails}`;
            
                // Fetch and format appointment details
                appointment = await this.getAppointment(this.selectedBedRoomNumber);
                console.log("App: ", appointment);
            
                const appointmentDetailsContainer = document.createElement("div");
                appointmentDetailsContainer.style.marginTop = "20px";
            
                if (appointment && appointment.status !== 404) {
                    const appointmentDetails = Object.entries(appointment)
                        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                        .join("<br>");
                    appointmentDetailsContainer.innerHTML = `<h3>Current Appointment</h3>${appointmentDetails}`;
                } else {
                    const message = appointment?.body?.message || "No appointment found for this room.";
                    appointmentDetailsContainer.innerHTML = `<h3>Current Appointment</h3><p>${message}</p>`;
                }
            
                modalDetails.appendChild(appointmentDetailsContainer);
            } else {
                const message = surgeryRoom?.body?.message || "No surgery room found for this room.";
                modalDetails.innerHTML = `<h3>Surgery Room Details</h3><p>${message}</p>`;
            }
            

            // Show modal
            const modal = document.getElementById('room-info-modal');
            const overlay = document.getElementById('modal-overlay');
            modal.style.display = 'block';
            overlay.style.display = 'block';
    
            // Close modal logic
            const closeModal = () => {
                modal.style.display = 'none';
                overlay.style.display = 'none';
    
                window.location.reload(); // Reload the page to reset the UI
            };
    
            document.getElementById('close-modal').onclick = closeModal;
            overlay.onclick = closeModal;
    
            return {
                surgeryRoomNumber: this.selectedBedRoomNumber,
                surgeryRoomData: surgeryRoom,
                appointment: appointment
            };
        } catch (error) {
            console.error("Error fetching room or appointment data:", error);
            alert("Something went wrong while fetching data. Please try again.");
        }
    }
    

    async getSurgeryRoom(surgeryRoomNumber) {
        const headers = {
            'Content-Type': 'application/json',
            //'Authorization'
        };
        const options = {
            method: 'GET',
            headers: headers
        };

        const url = `http://localhost:5500/api/SurgeryRooms/${surgeryRoomNumber}`;
        console.log("Url: ", url);

        try {
            const response = await fetch(url, options);
            if (response.status === 200) {
                const responseBody = await response.json();
                console.log('Response body:', responseBody);
                return {
                    // id: responseBody.id,
                    surgeryRoomNumber: responseBody.surgeryRoomNumber,
                    roomTypeCode: responseBody.roomTypeCode.value,
                    roomCapacity: responseBody.roomCapacity.capacity,
                    assignedEquipment: responseBody.assignedEquipment.equipment,
                    currentStatus: responseBody.currentStatus,
                    maintenanceSlots: responseBody.maintenanceSlots.map(slot => ({
                        start: slot.start || null,
                        end: slot.end || null
                    }))
                };
            } else {
                return {
                    status: response.status,
                    body: {
                        message: 'No surgery room found for the room number'
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching surgery room by number:', error);
            throw error;
        }
    }

    async getAppointment(surgeryRoomNumber) {
        const headers = {
            'Content-Type': 'application/json',
            //'Authorization'
        }
        const options = {
            method: 'GET',
            headers: headers
        };

        const url = `http://localhost:5500/api/Appointments/current/${surgeryRoomNumber}`;
        console.log("Url: ", url);

        try {
            const response = await fetch(url, options);
            if (response.status === 200) {
                const responseBody = await response.json(); 
                console.log('Response body:', responseBody);
                return {
                    // id: responseBody.id,
                    requestCode: responseBody.requestCode.value,
                    surgeryRoomNumber: responseBody.surgeryRoomNumber,
                    appointmentNumber: responseBody.appointmentNumber.value,
                    appointmentDate: {
                        start: responseBody.appointmentDate.start,
                        end: responseBody.appointmentDate.end
                    },
                    assignedStaff: [{
                        value: responseBody.assignedStaff.value
                    }]
                }
                
            } else {
                return {
                    status: response.status,
                    body: {
                        message: 'No appointment found for the surgery room number'
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching appointment by surgery room number:', error);
            throw error;
        }
    }
}