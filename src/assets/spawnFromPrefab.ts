import {
    AbstractMesh,
    AssetContainer,
    AnimationGroup,
    Skeleton,
    TransformNode,
    Scene
} from "@babylonjs/core";
import { ModelInstance } from "./ModelInstance";

export function spawnFromPrefab(
    scene: Scene,
    prefab: AssetContainer,
    name: string
): ModelInstance {
    const inst = prefab.instantiateModelsToScene(
        (sourceName) => `${name}::${sourceName}`,
        false
    );

    const root = new TransformNode(name, scene);
    inst.rootNodes.forEach((n) => (n.parent = root));

    const meshes: AbstractMesh[] = [];
    inst.rootNodes.forEach((n) => {
        meshes.push(...n.getChildMeshes(false));
    });

    const skeletons: Skeleton[] = inst.skeletons ?? [];
    const animationGroups: AnimationGroup[] = inst.animationGroups ?? [];
    // console.log(
    //     `[Prefab] ${name} animations:`,
    //     animationGroups.map(a => a.name)
    // );

    const getMesh = (meshName: string) => {
        return meshes.find(
            (m) =>
                m.name === meshName ||
                m.name.endsWith(`::${meshName}`) ||
                m.name.endsWith(meshName)
        );
    };

    const dispose = () => {
        animationGroups.forEach((ag) => ag.dispose());
        skeletons.forEach((s) => s.dispose());
        meshes.forEach((m) => m.dispose(false, true));
        inst.rootNodes.forEach((n) => n.dispose(false, true));
        root.dispose();
    };

    return {
        root,
        meshes,
        skeletons,
        animationGroups,
        getMesh,
        dispose
    };
}