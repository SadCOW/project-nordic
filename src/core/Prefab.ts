import {Scene} from "@babylonjs/core";
import {GameObject} from "./GameObject";
import {AssetLoader} from "./AssetLoader";

export abstract class Prefab {
    abstract create(scene: Scene): GameObject;

    instantiate(scene: Scene): GameObject {
        return this.create(scene);
    }
}
