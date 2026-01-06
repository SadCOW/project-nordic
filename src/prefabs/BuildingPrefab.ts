import {
    Scene,
    MeshBuilder,
    Vector3,
    StandardMaterial,
    Color3,
    Texture,
    Vector4,
    Tools,
    Mesh
} from "@babylonjs/core";

import {Prefab} from "../core/Prefab";
import {GameObject} from "../core/GameObject";

export interface BuildingConfig {
    width?: number;
    depth?: number;
    height?: number;
    hp?: number;
    color?: Color3;
}

export class BuildingPrefab extends Prefab {
    create(scene: Scene): GameObject {
        const roofMat = new StandardMaterial("roofMat");
        roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);

        const boxMat = new StandardMaterial("boxMat");
        boxMat.diffuseTexture = new Texture("https://doc.babylonjs.com/img/getstarted/cubehouse.png");
        const faceUV = [];
        faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
        faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
        faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
        faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side

        const base = MeshBuilder.CreateBox('base', {
            width: 3,
            depth: 3,
            height: 2,
            faceUV: faceUV,
            wrap: true
        }, scene);
        base.position.y = 1;
        // base.rotation.y = Tools.ToRadians(90);
        base.material = boxMat;

        const roof = MeshBuilder.CreateBox('roof', {
            width: 3.2,
            depth: 3.2,
            height: 0.6
        }, scene);
        roof.position.y = 2.3;
        // roof.rotation.z = Tools.ToRadians(90);
        roof.material = roofMat;

        const merged = Mesh.MergeMeshes(
            [base, roof],
            true,
            false,
            undefined,
            false,
            true
        );

        if (!merged) throw new Error("MergeMeshes failed");

        merged.name = "Building";
        merged.checkCollisions = true;
        merged.position.set(2, 0, 2);

        merged.setPivotPoint(new Vector3(0, 0, 0));

        const building = new GameObject(merged, scene);

        return building;
    }
}