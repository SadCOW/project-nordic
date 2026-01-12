import {System} from "../core/System";
import {World} from "../core/World";
import {TransformComponent} from "../components/TransformComponent";
import {MovementComponent} from "../components/MovementComponent";

export class MovementSystem extends System {
    update(world: World, dt: number): void {
        const transforms = world.getComponents<TransformComponent>("Transform");
        const movements = world.getComponents<MovementComponent>("Movement");

        for (const [entity, movement] of movements) {
            const transform = transforms.get(entity);

            if (!transform) continue;

            if (movement.velocity.lengthSquared() === 0) continue;

            const direction = movement.velocity.clone().normalize();
            const delta = direction.scale(movement.speed * dt);
            transform.position.addInPlace(delta);
            const angleY = Math.atan2(direction.x, direction.z);
            transform.rotation.y = angleY;
        }
    }
}