import { System } from "../core/System";
import { World } from "../core/World";
import { TransformComponent } from "../components/TransformComponent";
import { RenderComponent } from "../components/RenderComponent";

export class RenderSyncSystem extends System {
    update(world: World, dt: number): void {
        const transforms = world.getComponents<TransformComponent>("Transform");
        const renders = world.getComponents<RenderComponent>("Render");

        for (const [entity, render] of renders) {
            const transform = transforms.get(entity);

            if (!transform) continue;

            if (render.collider) {
                const collider = render.collider;
                transform.position.copyFrom(collider.position);
            } else {
                const root = render.model.root;
                root.position.copyFrom(transform.position);
                root.rotation.copyFrom(transform.rotation);
            }
        }
    }
}