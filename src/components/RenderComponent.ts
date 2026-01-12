import {ModelInstance} from "../assets/ModelInstance";
import {AbstractMesh} from "@babylonjs/core";

export type RenderComponent = {
    model: ModelInstance;
    collider?: AbstractMesh;
};