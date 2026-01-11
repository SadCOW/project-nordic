import {System} from "../core/System";
import {World} from "../core/World";
import {AnimationComponent} from "../components/AnimationComponent";
import {MovementComponent} from "../components/MovementComponent";
import {AttackComponent} from "../components/AttackComponent";

export class AnimationStateSystem extends System {
    constructor(
        private idleAnimation: string,
        private runAnimation: string
    ) {
        super();
    }

    update(world: World, dt: number): void {
        const animations = world.getComponents<AnimationComponent>("Animation");
        const movements = world.getComponents<MovementComponent>("Movement");
        const attacks = world.getComponents<AttackComponent>("Attack");

        for (const [entity, animation] of animations) {
            const movement = movements.get(entity);
            const attack = attacks.get(entity);

            if (attack?.isAttacking) continue;

            if (!movement) continue;

            const isMoving = movement.velocity.lengthSquared() > 0.0001;
            const target = isMoving ? this.runAnimation : this.idleAnimation;

            if (animation.current !== target) {
                animation.current = target;
                animation.loop = true;
                animation.speed = 1;
            }
        }
    }
}