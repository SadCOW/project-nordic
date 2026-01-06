import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {TreePrefab} from "../prefabs/TreePrefab";
import {GameObject} from "../core/GameObject";
import {ISceneLoaderProgressEvent} from "@babylonjs/core";
import {AssetLoader} from "../core/AssetLoader";

export interface MapConfig {
    width: number;
    depth: number;
    cellSize: number;
    density: number;
}

export class MapGenerator {
    constructor(private scene: Scene) {
    }

    private trees: GameObject[] = []

    async generate(config: MapConfig, sceen: Scene, assetLoader: AssetLoader): Promise<GameObject[]> {
        const prefab = new TreePrefab(
            assetLoader,
            "tree",
            // {scale: 3}
        );

        for (let x = -config.width / 2; x < config.width / 2; x++) {
            for (let z = -config.depth / 2; z < config.depth / 2; z++) {
                if (Math.random() > config.density) continue;

                const jitter: number = config.cellSize * 0.5

                const tree = await prefab.getBaseMesh(
                    this.scene,
                    // new Vector3(
                    //     x * config.cellSize + (Math.random() - 0.7) * jitter,
                    //     0,
                    //     z * config.cellSize + (Math.random() - 0.7) * jitter
                    // )
                );

                this.trees.push(tree);
            }
        }

        return this.trees;
    }
}

// import { Matrix, Scene, Vector3, AbstractMesh } from "@babylonjs/core";
// import { TreePrefab } from "../prefabs/TreePrefab";
//
// export interface MapConfig {
//     width: number;
//     depth: number;
//     cellSize: number;
//     density: number; // 0..1
// }
//
// export class MapGenerator {
//     constructor(private scene: Scene) {}
//
//     async generate(
//         config: MapConfig,
//         treePrefab: TreePrefab
//     ): Promise<AbstractMesh> {
//
//         const baseTree = treePrefab.getBaseMesh(this.scene);
//
//         const matrices: Matrix[] = [];
//         const jitter = config.cellSize * 0.5;
//
//         for (let x = -config.width / 2; x < config.width / 2; x++) {
//             for (let z = -config.depth / 2; z < config.depth / 2; z++) {
//
//                 if (Math.random() > config.density) continue;
//
//                 const position = new Vector3(
//                     x * config.cellSize + (Math.random() - 0.5) * jitter,
//                     0,
//                     z * config.cellSize + (Math.random() - 0.5) * jitter
//                 );
//
//                 const scale = 0.8 + Math.random() * 0.4;
//                 const rotationY = Math.random() * Math.PI * 2;
//
//                 const matrix = Matrix.Compose(
//                     new Vector3(scale, scale, scale),
//                     Matrix.RotationY(rotationY).getRotationQuaternion()!,
//                     position
//                 );
//
//                 matrices.push(matrix);
//             }
//         }
//
//         // 1 draw call
//         baseTree.thinInstanceAdd(matrices);
//
//         return baseTree;
//     }
// }
