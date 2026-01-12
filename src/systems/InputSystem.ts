import {System} from "../core/System";
import {World} from "../core/World";
import {InputComponent} from "../components/InputComponent";
import {MovementComponent} from "../components/MovementComponent";
import {Vector3} from "@babylonjs/core/Maths/math.vector";

export class InputSystem extends System {
    private keys = new Set<string | number>();

    constructor() {
        super();

        window.addEventListener("keydown", (e) => {
            this.keys.add(e.code);
        });

        window.addEventListener("keyup", (e) => {
            this.keys.delete(e.code);
        });

        window.addEventListener("pointerdown", (e) => {
            this.keys.add(e.button);
        })

        window.addEventListener("pointerup", (e) => {
            this.keys.delete(e.button);
        })
    }

    update(world: World, dt: number) {
        const inputs = world.getComponents<InputComponent>("Input");
        const movements = world.getComponents<MovementComponent>("Movement");

        for (const [entity, input] of inputs) {
            const movement = movements.get(entity);
            if (!movement) continue;

            // Обновляем InputComponent из текущего состояния клавиш
            input.forward = this.keys.has("KeyW");
            input.backward = this.keys.has("KeyS");
            input.left = this.keys.has("KeyA");
            input.right = this.keys.has("KeyD");
            input.attack = this.keys.has("Space");
            // console.log(this.keys);

            // Превращаем input в вектор движения
            const direction = new Vector3(0, 0, 0);

            if (input.forward) direction.z += 1;
            if (input.backward) direction.z -= 1;
            if (input.left) direction.x -= 1;
            if (input.right) direction.x += 1;

            // Движение по осям мира со смещением 45°
            if (direction.lengthSquared() > 0) {
                direction.normalize();

                // Поворот на 45 градусов
                const angle = Math.PI / 4;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                const x = direction.x;
                const z = direction.z;

                direction.x = x * cos - z * sin;
                direction.z = x * sin + z * cos;
            }

            movement.velocity.copyFrom(direction);
        }
    }
}