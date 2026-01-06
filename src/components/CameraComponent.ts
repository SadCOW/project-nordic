import {
    ArcRotateCamera,
} from "@babylonjs/core";
import { Component } from "../core/Component";

export class CameraComponent extends Component {
    start() {
        const canvas = this.scene.getEngine().getRenderingCanvas()!;

        const camera = new ArcRotateCamera(
            "ArcCamera",
            0,      // alpha
            Math.PI / 3.5,      // beta
            25,               // radius
            this.gameObject.mesh.position,
            this.scene
        );

        camera.attachControl(canvas, true);

        camera.lowerBetaLimit = 0.3;
        camera.upperBetaLimit = 1.4;
        camera.wheelDeltaPercentage = 0.01;

        // Камера всегда смотрит на игрока
        this.scene.onBeforeRenderObservable.add(() => {
            camera.target = this.gameObject.mesh.position;
        });

        // canvas.addEventListener("click", () => {
        //     canvas.requestPointerLock();
        // });
    }
}
