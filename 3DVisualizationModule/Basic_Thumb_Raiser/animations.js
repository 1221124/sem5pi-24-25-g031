import * as THREE from "three";

export default class Animations {
    constructor(object, animations) {
        this.states = ["Idle", "Walking", "Running", "Dance", "Death", "Sitting", "Standing"];
        this.emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];

        this.mixer = new THREE.AnimationMixer(object);
        this.actionInProgress = false;

        this.actions = {};
        for (let i = 0; i < animations.length; i++) {
            const clip = animations[i];
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
            if (this.states.indexOf(clip.name) >= 4 || this.emotes.indexOf(clip.name) >= 0) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }
        this.activeName = "Idle";
        this.actions[this.activeName].play();
    }

    fadeToAction(name, duration) {
        if (this.activeName != name && !this.actionInProgress) {
            const previousName = this.activeName;
            this.activeName = name;
            this.actions[previousName].fadeOut(duration);
            this.actions[this.activeName]
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play();
            // Some actions must not be interrupted
            if (this.activeName != "Idle" && this.activeName != "Walking" && this.activeName != "Running") {
                this.mixer.addEventListener("finished", event => this.actionFinished(event));
                this.actionInProgress = true;
            }
        }
    }

    actionFinished() {
        if (this.actionInProgress) {
            this.actionInProgress = false;
            this.mixer.removeEventListener("finished", this.actionInProgress);
        }
    }

    update(deltaT) {
        if (this.mixer) {
            this.mixer.update(deltaT);
        }
    }

    animateDoorOpening(door) {
        new TWEEN.Tween(door.rotation)
            .to({ y: Math.PI / 2 }, 1000) // A rotação de 0 para 90 graus (abertura)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    openDoorIfNearby(robotPosition, doorPosition, description) {
        if (this.isRobotNearDoor(robotPosition, doorPosition)) {
            for (let j = 0; j < description.map.length; j++) {
                for (let i = 0; i < description.map[j].length; i++) {
                    if (description.map[j][i] === 4) { // Se a porta estiver fechada
                        description.map[j][i] = 3; // Atualiza para a porta aberta
                    }
                }
            }
            this.animateDoorOpening(door);
        }
    }

    isRobotNearDoor(robotPosition, doorPosition, threshold = 1.0) {
        const distance = robotPosition.distanceTo(doorPosition);
        return distance < threshold;
    }
    updateDoors(robotPosition, doors, description) {
        doors.forEach((door) => {
            // Open the door if the robot is near
            this.openDoorIfNearby(robotPosition, door, description);
    
            // Animate the door opening
            this.animateDoorOpening(door, robotPosition);
        });
    }
}