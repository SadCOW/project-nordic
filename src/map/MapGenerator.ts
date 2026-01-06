import {Scene} from "@babylonjs/core/scene";
import {TreePrefab} from "../prefabs/TreePrefab";
import {Matrix, Mesh, Vector3} from "@babylonjs/core";
import {Quaternion} from "@babylonjs/core/Maths/math.vector";

export interface MapConfig {
    width: number;
    depth: number;
    cellSize: number;
    density: number;
}

export class MapGenerator {
    constructor(private scene: Scene) {
    }
    async generate(
        config: MapConfig,
        prefab: TreePrefab,
    ): Promise<Mesh> {
        const baseTree = (await prefab.getBaseMesh(this.scene)) as Mesh;
        if (!(baseTree instanceof Mesh)) {
            throw new TypeError("ThreePrefab.getBaseMesh(scene) must return Mesh")
        }

        const matrices: Matrix[] = [];
        const jitter = config.cellSize * 0.5;

        for (let x = -config.width * 0.5; x < config.width * 0.5; x++) {
            for (let z = -config.depth * 0.5; z < config.depth * 0.5; z++) {
                if (Math.random() > config.density) continue;

                const position = new Vector3(
                    x * config.cellSize + (Math.random() - 0.5) * jitter,
                    0,
                    z * config.cellSize + (Math.random() - 0.5) * jitter
                );

                const scale = 0.8 + Math.random() * 0.4;
                const rotationY = Math.random() * Math.PI * 2;

                const matrix = Matrix.Compose(
                    new Vector3(scale, scale, scale),
                    Quaternion.RotationAxis(new Vector3(0, 1, 0), Math.PI),
                    position
                );

                matrices.push(matrix);
            }
        }

        baseTree.thinInstanceAdd(matrices);
        return baseTree;
    }
}
