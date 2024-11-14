import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3,
 *  walkingSpeed: Float,
 *  initialDirection: Float,
 *  turningSpeed: Float,
 *  runningFactor: Float,
 *  keyCodes: { fixedView: String, firstPersonView: String, thirdPersonView: String, topView: String, viewMode: String, userInterface: String, miniMap: String, help: String, statistics: String, run: String, left: String, right: String, backward: String, forward: String, jump: String, yes: String, no: String, wave: String, punch: String, thumbsUp: String }
 * }
 */

export default class Player {
    constructor(parameters) {
        this.onLoad = function (description) {
            this.object = description.scene;
            this.animations = description.animations;

            // Turn on shadows for this object
            this.setShadow(this.object);

            // Get the object's axis-aligned bounding box (AABB) in 3D space
            const box = new THREE.Box3();
            box.setFromObject(this.object); // This function may result in a larger box than strictly necessary: https://threejs.org/docs/#api/en/math/Box3.setFromObject

            // Compute the object size
            const size = new THREE.Vector3();
            box.getSize(size);

            // Adjust the object's oversized dimensions (hard-coded; see previous comments)
            size.x = 3.0;
            size.y = 4.4;
            size.z = 2.6;

            // Set the object's radius and eye height
            this.radius = size.x / 2.0 * this.scale.x;
            this.eyeHeight *= size.y * this.scale.y;

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.initialDirection = THREE.MathUtils.degToRad(this.initialDirection);
        this.keyStates = { fixedView: false, firstPersonView: false, thirdPersonView: false, topView: false, viewMode: false, miniMap: false, statistics: false, userInterface: false, help: false, run: false, left: false, right: false, backward: false, forward: false, jump: false, yes: false, no: false, wave: false, punch: false, thumbsUp: false };
        this.loaded = false;

        // Create a resource .gltf or .glb file loader
        const loader = new GLTFLoader();

        // Load a model description resource file
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

    setShadow(object) {
        object.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
            if (child instanceof THREE.Object3D) {
                child.castShadow = true;
                child.receiveShadow = false;
            }
        });
    }
}