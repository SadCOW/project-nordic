import {System} from "../core/System";
import {World} from "../core/World";
import {AttackComponent} from "../components/AttackComponent";
import {AnimationComponent} from "../components/AnimationComponent";
import {MovementComponent} from "../components/MovementComponent";
import {InputComponent} from "../components/InputComponent";

export class AttackSystem extends System {
    constructor(
        private readonly attackAnimations: string[],
        private readonly attackSpeed: number
    ) {
        super();
    }

    update(world: World, dt: number) {
        const attacks = world.getComponents<AttackComponent>("Attack");
        const animations = world.getComponents<AnimationComponent>("Animation");
        const movements = world.getComponents<MovementComponent>("Movement");
        const inputs = world.getComponents<InputComponent>("Input");

        for (const [entity, attack] of attacks) {
            const animation = animations.get(entity);
            const movement = movements.get(entity);
            const input = inputs.get(entity);

            if (!animation) continue;

            if (attack.isAttacking) {
                attack.timer -= dt;

                if (attack.timer <= 0) {
                    attack.isAttacking = false;
                    attack.currentAnimation = undefined;
                }

                if (movement) {
                    movement.velocity.set(0, 0, 0);
                }

            }

            if (input?.attack && !attack.isAttacking) {
                attack.isAttacking = true;
                attack.timer = attack.attackDuration;

                const index = Math.floor(
                    Math.random() * this.attackAnimations.length
                );

                attack.currentAnimation = this.attackAnimations[index];

                animation.current = attack.currentAnimation;
                animation.loop = false;
                animation.speed = this.attackSpeed;

                if (movement) {
                    movement.velocity.set(0, 0, 0);
                }
            }
        }
    }
}