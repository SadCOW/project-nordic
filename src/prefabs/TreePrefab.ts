// import {Scene, TransformNode, Vector3} from "@babylonjs/core";
// import "@babylonjs/loaders/glTF";
// import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";
// import {GameObject} from "../core/GameObject";
//
// export interface TreeConfig {
//     diameter?: number;
//     height?: number;
//     scale?: number;
// }
//
// export class TreePrefab {
//     constructor(
//         private modelPath: string,
//         private modelFile: string,
//         private config: TreeConfig = {}
//     ) {
//     }
//
//     async create(scene: Scene, position: Vector3) {
//         const result = await SceneLoader.ImportMeshAsync(
//             null,
//             this.modelPath,
//             this.modelFile,
//             scene
//         );
//
//         const root = new TransformNode("TreeRoot", scene);
//         root.position.copyFrom(position);
//
//         for (const mesh of result.meshes) {
//             if (mesh.parent === null) {
//                 mesh.parent = root;
//             }
//
//             mesh.isPickable = true;
//             mesh.checkCollisions = false;
//         }
//
//         const s = (this.config.scale ?? 1) * (0.8 + Math.random() * 0.2);
//         root.scaling.setAll(s);
//         // root.rotation.y = Math.random() * Math.PI * 2;
//
//         return new GameObject(root, scene);
//     }
// }

import { AbstractMesh, Scene } from "@babylonjs/core";
import { AssetLoader } from "../core/AssetLoader";

export class TreePrefab {
    private baseMesh?: AbstractMesh;

    constructor(
        private assetLoader: AssetLoader,
        private assetKey: string,
        private scale = 1
    ) {}

    /**
     * Returns base mesh for instancing / thinInstances
     * GLB must be loaded beforehand
     */
    async getBaseMesh(scene: Scene): Promise<AbstractMesh> {
        if (this.baseMesh) {
            return this.baseMesh;
        }

        const mesh = this.assetLoader.instantiateMesh(this.assetKey);

        mesh.setEnabled(true);
        mesh.isPickable = false;
        mesh.checkCollisions = false;
        mesh.receiveShadows = false;

        mesh.scaling.setAll(this.scale);

        // mobile optimizations
        mesh.freezeWorldMatrix();

        if (mesh.material) {
            mesh.material.freeze();
        }

        this.baseMesh = mesh;
        return mesh;
    }
}
