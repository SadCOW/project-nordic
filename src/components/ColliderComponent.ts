import {AbstractMesh} from "@babylonjs/core";
import {Vector3} from "@babylonjs/core/Maths/math.vector";

export type ColliderComponent = {
    mesh: AbstractMesh;
    offset: Vector3;
}