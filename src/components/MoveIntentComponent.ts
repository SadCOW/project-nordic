import { Vector3 } from "@babylonjs/core/Maths/math.vector";

export type MoveIntentComponent = {
    delta: Vector3; // шаг за кадр в world-space
};
