import { System } from "../core/System";
import { World } from "../core/World";
import { TransformComponent } from "../components/TransformComponent";
import { RenderComponent } from "../components/RenderComponent";
import {ColliderComponent} from "../components/ColliderComponent";

export class RenderSyncSystem extends System {
    update(world: World, dt: number): void {
        const transforms = world.getComponents<TransformComponent>("Transform");
        const renders = world.getComponents<RenderComponent>("Render");
        const colliders = world.getComponents<ColliderComponent>("Collider");

        for (const [entity, render] of renders) {
            const transform = transforms.get(entity);

            if (!transform) continue;

            const root = render.model.root;
            root.position.copyFrom(transform.position);
            root.rotation.copyFrom(transform.rotation);

            const collider = colliders.get(entity);
            if (collider) {
                collider.mesh.position.set(
                    transform.position.x + collider.offset.x,
                    transform.position.y + collider.offset.y,
                    transform.position.z + collider.offset.z
                );
                collider.mesh.rotation.copyFrom(transform.rotation);
            }
        }
    }
}