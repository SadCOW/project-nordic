import { Component } from "../core/Component";
import {KeyboardEventTypes, Vector3} from "@babylonjs/core";

export class JumpComponent extends Component {
    verticalVelocity = 0;
    gravity = -9.8;
    jumpForce = 5;
    isGrounded = false;
    input: Record<string, boolean> = {};

    start() {
        this.scene.onKeyboardObservable.add((kb) => {
            const key = kb.event.key.toLowerCase();
            this.input[key] = kb.type === KeyboardEventTypes.KEYDOWN;
        });
    }

    update(dt: number) {

        // DEBUG
        // console.log(this.input)
        // console.log("isGrounded " + this.isGrounded)
        // console.log("verticalVelocity " + this.verticalVelocity)
        // console.log("position.y " + this.gameObject.mesh.position.y)

        if (!this.isGrounded) {
            this.verticalVelocity += this.gravity * dt;
        }

        this.gameObject.mesh.moveWithCollisions(new Vector3(0, this.verticalVelocity * dt, 0));

        if (this.gameObject.mesh.position.y <= 1.02) {
            this.isGrounded = true;
            this.verticalVelocity = 0;
            this.gameObject.mesh.position.y = 1.01;
        }

        if (this.scene.getEngine().getInputElement()?.ownerDocument?.pointerLockElement) {
            if (this.input[" "]) {
                if (this.isGrounded) {
                    this.verticalVelocity = this.jumpForce;
                    this.isGrounded = false;
                }
            }
        }
    }
}