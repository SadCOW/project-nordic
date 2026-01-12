import {World} from "../core/World";
import {Color3, MeshBuilder, Scene, StandardMaterial, Vector3} from "@babylonjs/core";
import {PrefabLoader} from "../assets/PrefabLoader";
import {LevelMap} from "./types";
import {WorldObjectRegistry} from "../world/WorldObjectRegistry";

export class LevelBuilder {
    private levelCenter?: Vector3;
    private objects: WorldObjectRegistry;

    constructor(
        private world: World,
        private scene: Scene,
        private prefabs: PrefabLoader
    ) {
        this.scene.collisionsEnabled = true;
        this.objects = new WorldObjectRegistry(world, scene, prefabs);
    }

    async build(level: LevelMap) {
        // 1. Создаём плоскую землю
        const ground = MeshBuilder.CreateGround(
            "ground",
            {
                width: level.width,
                height: level.height,
                subdivisions: 1
            },
            this.scene
        );

        const groundMaterial = new StandardMaterial("groundMat", this.scene);
        groundMaterial.diffuseColor = new Color3(0.2, 0.4, 0.2); // зелёная трава
        ground.material = groundMaterial;

        const centerX = level.width * 0.5 - 0.5;
        const centerZ = level.height * 0.5 - 0.5;

        ground.position.x = centerX;
        ground.position.z = centerZ;

        // Сохраняем центр уровня
        this.levelCenter = new Vector3(centerX, 0, centerZ);

        // 3. Генерируем деревья случайно по карте
        for (let z = 0; z < level.height; z++) {
            for (let x = 0; x < level.width; x++) {
                // шанс появления дерева
                if (Math.random() < 0.1) {
                    await this.objects.spawn("tree", {
                        position: new Vector3(x, 0, z)
                    });
                }
            }
        }
    }

    public getCenter(): Vector3 {
        if (!this.levelCenter) {
            throw new Error("Level is not built yet. Call build() first.");
        }
        return this.levelCenter.clone();
    }
}