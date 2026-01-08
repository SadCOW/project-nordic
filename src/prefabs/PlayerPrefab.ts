import {Scene, Vector3} from "@babylonjs/core";
import {GameObject} from "../core/GameObject";
import {CameraComponent} from "../components/CameraComponent";
import {GravityComponent} from "../components/GravityComponent";
import {AssetLoader} from "../core/AssetLoader";
import {PlayerMovement} from "../components/PlayerMovementComponent";

export class PlayerPrefab {
    create(scene: Scene, assetLoader: AssetLoader): GameObject {
        // const assetLoader = new AssetLoader(scene)

        const {root, mesh} = assetLoader.instantiateModel(
            "player",
            {
                // name: "player"
            });
        // console.log(mesh);
        // mesh.setPivotPoint(Vector3.Zero());
        // mesh.position.setAll(0);
        mesh.checkCollisions = true;
        mesh.showBoundingBox = true;
        console.log(mesh.parent?.name, mesh.parent?.getClassName())
		console.log(root.getAbsolutePosition(), mesh.getAbsolutePosition(), mesh.getBoundingInfo().boundingBox.centerWorld)
        // console.log(mesh.getChildMeshes().length);

        // mesh.computeWorldMatrix(true);
        // mesh.refreshBoundingInfo(true);
        //
        // console.log("mesh.position", mesh.position.toString());
        // console.log("bbox centerWorld", mesh.getBoundingInfo().boundingBox.centerWorld.toString());
        // console.log("bbox minWorld", mesh.getBoundingInfo().boundingBox.minimumWorld.toString());
        // console.log("bbox maxWorld", mesh.getBoundingInfo().boundingBox.maximumWorld.toString());
        //
        // console.log(mesh.name, mesh.getClassName());

        const player = new GameObject(mesh, scene);
        player.addComponent(new PlayerMovement());
        player.addComponent(new CameraComponent());
        // player.addComponent(new JumpComponent());
        player.addComponent(new GravityComponent());

        return player;
    }
}
