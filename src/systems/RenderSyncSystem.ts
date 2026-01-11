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

            const root = render.model.root;
            // console.log(root.position)

            root.position.copyFrom(transform.position);
            root.rotation.copyFrom(transform.rotation);
        }
    }
}