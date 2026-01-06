import { Scene } from "@babylonjs/core";
import { GameObject } from "./GameObject";

export abstract class Component {
    protected gameObject!: GameObject;
    protected scene!: Scene;

    init(gameObject: GameObject, scene: Scene) {
        this.gameObject = gameObject;
        this.scene = scene;
        this.start();
    }

    start(): void {}
    update(_dt: number): void {}
}
