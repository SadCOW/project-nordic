import { System } from "../core/System";
import { World } from "../core/World";
import { AnimationComponent } from "../components/AnimationComponent";
import { RenderComponent } from "../components/RenderComponent";

export class AnimationSystem extends System {
    update(world: World, dt: number): void {
        const animations = world.getComponents<AnimationComponent>("Animation");
        const renders = world.getComponents<RenderComponent>("Render");

        for (const [entity, anim] of animations) {
            const render = renders.get(entity);
            if (!render) continue;

            const groups = render.model.animationGroups;
            if (!groups || groups.length === 0) {
                console.warn("No animation groups on model");
                continue;
            }

            const target = groups.find(g => g.name === anim.current);
            if (!target) {
                console.warn(
                    "Animation not found:",
                    anim.current,
                    "Available:",
                    groups.map(g => g.name)
                );
                continue;
            }

            // если уже играет — просто обновляем параметры
            if (target.isPlaying) {
                target.speedRatio = anim.speed;
                target.loopAnimation = anim.loop;
                continue;
            }

            // Останавливаем всё остальное
            for (const g of groups) {
                if (g !== target) {
                    g.stop();
                    g.reset(); // ВАЖНО
                }
            }

            // Подготовка и запуск
            target.reset();               // <=== ключевой момент
            target.speedRatio = anim.speed;
            target.loopAnimation = anim.loop;

            // Иногда Babylon не стартует без явного from/to
            if (target.from !== undefined && target.to !== undefined) {
                target.start(anim.loop, anim.speed, target.from, target.to);
            } else {
                target.start(anim.loop);
            }

            // console.log("Started animation:", target.name);
        }
    }
}