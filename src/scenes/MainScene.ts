import {
    Color3,
    Engine,
    HemisphericLight,
    MeshBuilder,
    Scene,
    ScenePerformancePriority,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";

import {PlayerPrefab} from "../prefabs/PlayerPrefab";
import {GameObject} from "../core/GameObject";
import {MapGenerator} from "../map/MapGenerator";

import "@babylonjs/loaders/glTF";
import {AssetLoader} from "../core/AssetLoader";
import {CameraComponent} from "../components/CameraComponent";

export class MainScene {
    scene: Scene;
    private gameObjects: GameObject[] = [];
    private assetLoader: AssetLoader;

    constructor(engine: Engine) {
        this.scene = new Scene(engine);

        // mobile preset
        this.scene.performancePriority = ScenePerformancePriority.Aggressive;
        this.scene.skipPointerDownPicking = true;
        this.scene.autoClear = true;

        this.scene.collisionsEnabled = false;
        this.assetLoader = new AssetLoader(this.scene);

        this.setupEnvironment();
        this.init(engine);
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

        const mainPlace = new GameObject(ground, this.scene);
        mainPlace.addComponent(new CameraComponent());
    }

    private async init(engine: Engine): Promise<void> {
        await this.loadAssets();
        await this.initMap();
        await this.initPlayer();

        this.scene.onBeforeRenderObservable.add(() => {
            const dt = engine.getDeltaTime() * 0.001;

            for (let i = 0; i < this.gameObjects.length; i++) {
                const obj: any = this.gameObjects[i];

                if (obj && typeof obj.update === "function") {
                    obj.update(dt);
                } else {
                    // Helpful debug: some items in `gameObjects` are not GameObjects / not updatable
                    console.warn("Non-updatable object in gameObjects:", obj);
                }
            }
        });
    }

    private async loadAssets(): Promise<void> {
        await this.assetLoader.load("tree", "/models/trees/", "tree.glb")
        await this.assetLoader.load("player", "models/player/", "player.glb")
    }

    private async initMap(): Promise<void> {
        const generator = new MapGenerator(this.scene);

        // const forest = await generator.generate(
        //     {
        //         width: 20,
        //         depth: 20,
        //         cellSize: 4,
        //         density: 1
        //     },
        //     this.scene
        // );
        const forest = await generator.generate({
                width: 20,
                depth: 20,
                cellSize: 4,
                density: 1
            },
            this.scene,
            this.assetLoader
        )

        this.gameObjects.push(...forest);
    }

    private async initPlayer(): Promise<void> {
        const prefab = new PlayerPrefab();
        const player = prefab.create(this.scene, this.assetLoader);
        this.gameObjects.push(player);
    }
}

