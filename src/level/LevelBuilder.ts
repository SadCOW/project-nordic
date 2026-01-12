import {World} from "../core/World";
import {AssetContainer, Color3, MeshBuilder, Scene, StandardMaterial, Vector3} from "@babylonjs/core";
import {PrefabLoader} from "../assets/PrefabLoader";
import {spawnFromPrefab} from "../assets/spawnFromPrefab";
import {LevelMap} from "./types";

export class LevelBuilder {
    private treePrefab?: AssetContainer;
    private levelCenter?: Vector3;

    constructor(
        private world: World,
        private scene: Scene,
        private prefabs: PrefabLoader
    ) {
        this.scene.collisionsEnabled = true;
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

        // 2. Загружаем префаб дерева один раз
        const tree = await this.prefabs.loadGLB("/models/props/tree.glb");
        this.treePrefab = tree.container;

        // 3. Генерируем деревья случайно по карте
        for (let z = 0; z < level.height; z++) {
            for (let x = 0; x < level.width; x++) {
                // шанс появления дерева
                if (Math.random() < 0.1) {
                    this.spawnTree(x, z);
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

    private spawnTree(x: number, z: number) {
        if (!this.treePrefab) return;

        const entity = this.world.createEntity();
        const model = spawnFromPrefab(this.scene, this.treePrefab, "Tree");

        // Создаем простой коллайдер для дерева
        const collider = MeshBuilder.CreateBox("treeCollider", {
            width: 0.8,
            height: 2.8,
            depth: 0.8
        }, this.scene);

        collider.isVisible = false;
        collider.checkCollisions = true;

        model.root.parent = collider;
        model.root.position.set(0, 0, 0);
        model.root.rotation.set(0, 0, 0);

        // небольшая рандомизация позиции внутри тайла
        const offsetX = (Math.random() - 0.5) * 0.6;
        const offsetZ = (Math.random() - 0.5) * 0.6;

        // рандомный поворот и масштаб для разнообразия
        const rotationY = Math.random() * Math.PI * 2;
        const scale = 1.8 + Math.random() * 0.4;

        model.root.scaling.set(scale, scale, scale);

        const position = new Vector3(x + offsetX, 0, z + offsetZ);

        // ставим коллайдер в мировую позицию
        collider.position.copyFrom(position);
        collider.rotation.y = rotationY;

        this.world.addComponent(entity, "Transform", {
            position: position.clone(),
            rotation: new Vector3(0, rotationY, 0)
        });

        this.world.addComponent(entity, "Render", {model, collider});
    }
}