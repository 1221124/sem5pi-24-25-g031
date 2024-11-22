import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String
 * }
 */

export default class Door {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a texture for the door (different from the wall texture)
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Create a group of objects for the door
        this.object = new THREE.Group();

        // Create the front face (rectangle) of the door
        let geometry = new THREE.PlaneGeometry(1.0, 3.0);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.0, 0.0, 0.025);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        // Create the rear face (rectangle)
        face = new THREE.Mesh().copy(face, false);
        face.rotateY(Math.PI);
        face.position.set(0.0, 0.0, -0.025);
        this.object.add(face);

        // Create the left side face (a four-triangle mesh)
        let points = new Float32Array([
            -0.475, -1.5, 0.025,
            -0.475, 1.5, 0.025,
            -0.5, 1.5, 0.0,
            -0.5, -1.5, 0.0,

            -0.5, 1.5, 0.0,
            -0.475, 1.5, -0.025,
            -0.475, -1.5, -0.025,
            -0.5, -1.5, 0.0
        ]);
        let normals = new Float32Array([
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,

            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707
        ]);
        let indices = [
            0, 1, 2,
            2, 3, 0,
            4, 5, 6,
            6, 7, 4
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3));
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        material = new THREE.MeshPhongMaterial({ color: 0x6b554b });
        face = new THREE.Mesh(geometry, material);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        // Create the right side face (a four-triangle mesh)
        face = new THREE.Mesh().copy(face, false);
        face.rotateY(Math.PI);
        this.object.add(face);

        // Create the top face (a four-triangle mesh)
        points = new Float32Array([
            -0.5, 1.5, 0.0,
            -0.475, 1.5, 0.025,
            -0.475, 1.5, -0.025,
            0.475, 1.5, 0.025,
            0.475, 1.5, -0.025,
            0.5, 1.5, 0.0
        ]);
        normals = new Float32Array([
            0.0, 1.5, 0.0,
            0.0, 1.5, 0.0,
            0.0, 1.5, 0.0,
            0.0, 1.5, 0.0,
            0.0, 1.5, 0.0,
            0.0, 1.5, 0.0,
        ]);
        indices = [
            0, 1, 2,
            2, 1, 3,
            3, 4, 2,
            4, 3, 5
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3));
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        face = new THREE.Mesh(geometry, material);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);
    }

}
