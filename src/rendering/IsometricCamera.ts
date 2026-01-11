import {
    ArcRotateCamera,
    Scene,
    Vector3
} from "@babylonjs/core";

export class IsometricCamera {
    readonly camera: ArcRotateCamera;

    constructor(scene: Scene, target: Vector3 = Vector3.Zero()) {
        // классический изометрический угол
        const alpha = Math.PI / -4;     // 45°
        const beta = Math.PI / 3;      // ~60°
        const radius = 20;

        const camera = new ArcRotateCamera(
            "IsoCamera",
            alpha,
            beta,
            radius,
            target,
            scene
        );

        // настоящая изометрия = ортографическая камера
        // camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

        // размеры “окна” камеры (чем больше – тем дальше "зум")
        // const size = 10;
        // camera.orthoLeft = -size;
        // camera.orthoRight = size;
        // camera.orthoTop = size;
        // camera.orthoBottom = -size;

        camera.lowerRadiusLimit = radius;
        camera.upperRadiusLimit = radius;
        camera.allowUpsideDown = false;
        camera.panningSensibility = 0;

        // camera.attachControl(true);

        this.camera = camera;
    }
}