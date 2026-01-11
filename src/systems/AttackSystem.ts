import {System} from "../core/System";
import {World} from "../core/World";
import {AttackComponent} from "../components/AttackComponent";
import {AnimationComponent} from "../components/AnimationComponent";
import {MovementComponent} from "../components/MovementComponent";
import {InputComponent} from "../components/InputComponent";

export class AttackSystem extends System {
    constructor(private attackAnimation: string, private attackSpeed: number) {
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
                }

                animation.current = this.attackAnimation;
                animation.loop = false;
                animation.speed = this.attackSpeed;

                if (movement) {
                    movement.velocity.set(0, 0, 0);
                }

                continue;
            }

            if (input?.attack) {
                attack.isAttacking = true;
                attack.timer = attack.attackDuration;

                animation.current = this.attackAnimation;
                animation.loop = false;
                animation.speed = this.attackSpeed;

                if (movement) {
                    movement.velocity.set(0, 0, 0);
                }
            }
        }
    }
}