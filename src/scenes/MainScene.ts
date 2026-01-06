import {
    Color3,
    Engine,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    ScenePerformancePriority,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";

import {MapGenerator} from "../map/MapGenerator";

import "@babylonjs/loaders/glTF";
import {AssetLoader} from "../core/AssetLoader";
import {CameraComponent} from "../components/CameraComponent";
import {PlayerPrefab} from "../prefabs/PlayerPrefab";
import {TreePrefab} from "../prefabs/TreePrefab";

type Updatable = { update(dt: number): void };

export class MainScene {
    public readonly scene: Scene;
    private readonly engine: Engine;
    private gameObjects: Updatable[] = [];
    private assetLoader: AssetLoader;
    private forestMesh?: Mesh;

    constructor(engine: Engine) {
        this.scene = new Scene(engine);
        this.engine = engine;

        // mobile preset
        this.scene.performancePriority = ScenePerformancePriority.Aggressive;
        this.scene.skipPointerDownPicking = true;
        this.scene.autoClear = true;

        this.scene.collisionsEnabled = false;
        this.assetLoader = new AssetLoader(this.scene);

        this.setupEnvironment();
        this.init();
    }

    private setupEnvironment(): void {
        const light = new HemisphericLight(
            "light",
            Vector3.Up(),
            this.scene
        );
        light.intensity = 0.6;
        light.specular.set(0, 0, 0);

        const groundMat = new StandardMaterial('ground', this.scene);
        groundMat.diffuseColor = new Color3(0, 1, 0);
        groundMat.disableLighting = false;
        groundMat.freeze();

        const ground = MeshBuilder.CreateGround(
            "ground",
            {width: 100, height: 100},
            this.scene
        );

        ground.material = groundMat;
        ground.checkCollisions = false;
        ground.isPickable = false;
        ground.freezeWorldMatrix();

        // If you want the ground to be a GameObject later, add it to gameObjects as an Updatable.
        // For now we only attach the camera component via your component system entry point.
        // NOTE: This assumes your camera component does not require a GameObject wrapper.
        // If it does, revert to GameObject usage and push it into `gameObjects`.
        new CameraComponent();
    }

    private async init(): Promise<void> {
        await this.loadAssets();
        await this.initMap();
        await this.initPlayer();
    }

    public update(dt: number): void {
        for (let i = 0; i < this.gameObjects.length; i++) {
            const obj = this.gameObjects[i];
            if (obj && typeof (obj as any).update === "function") {
                obj.update(dt);
            }
        }
    }

    public render(): void {
        // Keep render centralized so main.ts doesn't need to touch internal details.
        this.scene.render();
    }

    public dispose(): void {
        this.scene.dispose();
    }

    private async loadAssets(): Promise<void> {
        await this.assetLoader.load("tree", "/models/trees/", "tree.glb")
        await this.assetLoader.load("player", "models/player/", "player.glb")
    }

    private async initMap(): Promise<void> {
        const generator = new MapGenerator(this.scene);

        const treePrefab = new TreePrefab(this.assetLoader, "tree")

        const forest = await generator.generate({
                width: 40,
                depth: 40,
                cellSize: 1.5,
                density: 0.7
            },
            treePrefab,
        )

        this.forestMesh = forest;
    }

    private async initPlayer(): Promise<void> {
        const prefab = new PlayerPrefab();
        const player = prefab.create(this.scene, this.assetLoader);
        player.mesh.position.setAll(0);
        this.gameObjects.push(player);
    }
}
