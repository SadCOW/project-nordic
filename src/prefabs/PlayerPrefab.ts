import {Scene, Vector3} from "@babylonjs/core";
import {GameObject} from "../core/GameObject";
import {CameraComponent} from "../components/CameraComponent";
import {GravityComponent} from "../components/GravityComponent";
import {AssetLoader} from "../core/AssetLoader";

export class PlayerPrefab {
    create(scene: Scene, assetLoader: AssetLoader): GameObject {
        // const assetLoader = new AssetLoader(scene)

        const mesh = assetLoader.instantiateMesh("player");
        mesh.setPivotPoint(Vector3.Zero());
        mesh.checkCollisions = true;
        mesh.showBoundingBox = true;

        const player = new GameObject(mesh, scene);
        // player.addComponent(new PlayerMovement());
        player.addComponent(new CameraComponent());
        // player.addComponent(new JumpComponent());
        player.addComponent(new GravityComponent());

        return player;
    }
}
