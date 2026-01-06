import {Color4, MeshBuilder, Scene, Vector3} from "@babylonjs/core";
import {Prefab} from "../core/Prefab";
import {GameObject} from "../core/GameObject";

import {PlayerMovement} from "../components/PlayerMovementComponent";
import {CameraComponent} from "../components/CameraComponent";
import {JumpComponent} from "../components/JumpComponent";
import {GravityComponent} from "../components/GravityComponent";
import {AssetLoader} from "../core/AssetLoader";

export class PlayerPrefab {
    create(scene: Scene, assetLoader: AssetLoader): GameObject {
        // const assetLoader = new AssetLoader(scene)

        const mesh = assetLoader.instantiateMesh("player");
        mesh.setPivotPoint(Vector3.Zero());
        mesh.checkCollisions = true;
        mesh.showBoundingBox = true;
        // console.log(mesh)

        const player = new GameObject(mesh, scene);
        player.addComponent(new PlayerMovement());
        player.addComponent(new CameraComponent());
        // player.addComponent(new JumpComponent());
        player.addComponent(new GravityComponent());

        return player;
    }
}
