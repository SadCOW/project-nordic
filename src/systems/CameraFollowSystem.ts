import {System} from "../core/System";
import {World} from "../core/World";
import {IsometricCamera} from "../rendering/IsometricCamera";
import {CameraTargetComponent} from "../components/CameraTargetComponent";
import {TransformComponent} from "../components/TransformComponent";
import {Vector3} from "@babylonjs/core/Maths/math.vector";

export class CameraFollowSystem extends System {
    constructor(private camera: IsometricCamera) {
        super();
    }

    update(world: World, dt: number) {
        const targets = world.getComponents<CameraTargetComponent>("CameraTarget");
        const transforms = world.getComponents<TransformComponent>("Transform");

        for (const [entity] of targets) {
            const transform = transforms.get(entity);
            if (!transform) continue;

            // Жесткое следование
            // this.camera.camera.target.copyFrom(transform.position);

            // Если хочешь мягкое:
            Vector3.LerpToRef(
                this.camera.camera.target,
                transform.position,
                0.05,
                this.camera.camera.target
            );
        }
    }
}