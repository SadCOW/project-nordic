import {Vector3, KeyboardEventTypes, PointerEventTypes} from "@babylonjs/core";
import {Component} from "../core/Component";

export class PlayerMovement extends Component {
    speed = 6;
    input: Record<string, boolean> = {};
    targetPosition: Vector3 | null = null;

    start() {
        this.scene.onKeyboardObservable.add((kb) => {
            const key = kb.event.key.toLowerCase();
            this.input[key] = kb.type === KeyboardEventTypes.KEYDOWN;
        });

        // this.scene.onPointerObservable.add((pointerInfo) => {
        //     if (pointerInfo.type !== PointerEventTypes.POINTERDOWN) return;
        //
        //     const event = pointerInfo.event as PointerEvent;
        //     if (event.button !== 0) return; // только ЛКМ
        //
        //     const pickResult = this.scene.pick(
        //         this.scene.pointerX,
        //         this.scene.pointerY
        //     );
        //
        //     if (pickResult?.hit && pickResult.pickedPoint) {
        //         this.targetPosition = pickResult.pickedPoint.clone();
        //         this.targetPosition.y = this.gameObject.mesh.position.y;
        //         // console.log(this.targetPosition);
        //     }
        // });
    }

    update(dt: number) {
        // if (!this.targetPosition || (!this.input["w"] && !this.input["a"] && !this.input["s"] && !this.input["d"])) return;
        //
        // const current = this.gameObject.mesh.position;
        // const direction = this.targetPosition.subtract(current);
        // const distance = direction.length();
        //
        // if (distance < 0.1) {
        //     this.targetPosition = null;
        //     return;
        // }
        //
        // direction.normalize();
        //
        // this.gameObject.mesh.moveWithCollisions(
        //     direction.scale(this.speed * dt)
        // );
        //
        // // Поворот в сторону движения (как в Unity NavMesh)
        // this.gameObject.mesh.lookAt(
        //     this.targetPosition,
        //     Math.PI,
        //     0,
        //     0
        // );

        let move = Vector3.Zero();

        if (this.input["w"]) move.x -= 1;
        if (this.input["s"]) move.x += 1;
        if (this.input["a"]) move.z -= 1;
        if (this.input["d"]) move.z += 1;

        move.normalize();

        this.gameObject.mesh.moveWithCollisions(
            move.scale(this.speed * dt)
        );

    }
}
