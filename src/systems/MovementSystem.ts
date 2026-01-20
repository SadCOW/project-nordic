import { System } from "../core/System";
import { World } from "../core/World";
import { TransformComponent } from "../components/TransformComponent";
import { MovementComponent } from "../components/MovementComponent";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { MoveIntentComponent } from "../components/MoveIntentComponent";

export class MovementSystem extends System {
    update(world: World, dt: number): void {
        const transforms = world.getComponents<TransformComponent>("Transform");
        const movements = world.getComponents<MovementComponent>("Movement");
        const intents = world.getComponents<MoveIntentComponent>("MoveIntent");

        for (const [entity, movement] of movements) {
            const transform = transforms.get(entity);
            if (!transform) continue;

            let intent = intents.get(entity);
            if (!intent) {
                intent = { delta: Vector3.Zero() };
                intents.set(entity, intent);
            }

            if (movement.velocity.lengthSquared() === 0) {
                intent.delta.setAll(0);
                continue;
            }

            const dir = movement.velocity.clone().normalize();
            intent.delta.copyFrom(dir).scaleInPlace(movement.speed * dt);

            // поворот оставляем здесь — это управление, не коллизии
            transform.rotation.y = Math.atan2(dir.x, dir.z);
        }
    }
}
