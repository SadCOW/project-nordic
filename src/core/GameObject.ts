import {Mesh, Nullable, Scene, TransformNode} from "@babylonjs/core";
import { Component } from "./Component";

export class GameObject {
    private components: Component[] = [];

    constructor(
        public mesh: Mesh,
        private scene: Scene
    ) {}

    addComponent<T extends Component>(component: T): T {
        component.init(this, this.scene);
        this.components.push(component);
        return component;
    }

    update(dt: number) {
        for (const component of this.components) {
            component.update(dt);
        }
    }
}
