import {System} from "../core/System";
import {World} from "../core/World";
import {TransformComponent} from "../components/TransformComponent";
import {MovementComponent} from "../components/MovementComponent";
import {RenderComponent} from "../components/RenderComponent";

export class MovementSystem extends System {
    update(world: World, dt: number): void {
        const transforms = world.getComponents<TransformComponent>("Transform");
        const movements = world.getComponents<MovementComponent>("Movement");
        const renders = world.getComponents<RenderComponent>("Render");

        for (const [entity, movement] of movements) {
            const transform = transforms.get(entity);
            const render = renders.get(entity);

            if (!transform || !render) continue;

            const collider = render.collider;

            if (movement.velocity.lengthSquared() === 0) continue;

            const direction = movement.velocity.clone().normalize();
            const delta = direction.scale(movement.speed * dt);
            const angleY = Math.atan2(direction.x, direction.z);

            if (collider) {
                collider.moveWithCollisions(delta);
                collider.rotation.y = angleY;

                transform.position.copyFrom(collider.position);
                transform.rotation.y = angleY;
            } else {
                transform.position.addInPlace(delta)
                transform.rotation.y = angleY;
            }
        }
    }
}