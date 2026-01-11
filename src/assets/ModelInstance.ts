import {
    AbstractMesh,
    AnimationGroup,
    Skeleton,
    TransformNode
} from "@babylonjs/core";

export type ModelInstance = {
    root: TransformNode;
    meshes: AbstractMesh[];
    skeletons: Skeleton[];
    animationGroups: AnimationGroup[];

    getMesh: (name: string) => AbstractMesh | undefined;
    dispose: () => void;
};