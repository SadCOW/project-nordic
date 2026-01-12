import {WorldObjectFactory} from "./WorldObjectFactory";
import {World} from "../core/World";
import {AssetContainer, Scene} from "@babylonjs/core";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {GlbPrefab, PrefabLoader} from "../assets/PrefabLoader";
import {SpawnContext} from "../world/WorldObjectRegistry";
import {spawnFromPrefab} from "../assets/spawnFromPrefab";

export class TreeFactory implements WorldObjectFactory {
    private prefab?: AssetContainer;
    private prefabPromise: Promise<AssetContainer>;

    constructor(
        private world: World,
        private scene: Scene,
        prefabs: PrefabLoader
    ) {
        this.prefabPromise = prefabs
            .loadGLB("models/props/tree.glb")
            .then((asset: GlbPrefab) => asset.container);
    }

    async spawn(ctx: SpawnContext) {
        if (!this.prefab) {
            this.prefab = await this.prefabPromise;
        }

        const entity = this.world.createEntity();
        const model = spawnFromPrefab(this.scene, this.prefab, "Tree");

        this.world.addComponent(entity, "Transform", {
            position: ctx.position.clone(),
            rotation: new Vector3(0, ctx.rotationY ?? 0, 0)
        });

        this.world.addComponent(entity, "Render", {
            model
        });
        // collider, future, TreeComponent
    }
}