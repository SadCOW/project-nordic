import {WorldObjectFactory} from "./WorldObjectFactory";
import {World} from "../core/World";
import {AssetContainer, MeshBuilder, Scene} from "@babylonjs/core";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {GlbPrefab, PrefabLoader} from "../assets/PrefabLoader";
import {SpawnContext} from "../world/WorldObjectRegistry";
import {spawnFromPrefab} from "../assets/spawnFromPrefab";
import {ModelInstance} from "../assets/ModelInstance";

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

        /* --------- коэффициент масштаба -------- */
        const SCALE_MIN = 1;
        const SCALE_MAX = 1.5;
        const scale = ctx.scale ?? (SCALE_MIN + Math.random() * (SCALE_MAX - SCALE_MIN));

        /* --------- коллайдер -------- */
        const colliderHeight = 2 * scale;
        const colliderRadius = 0.3 * scale;

        const collider = MeshBuilder.CreateBox(
            "treeCollider",
            { height: colliderHeight, width: colliderRadius, depth: colliderRadius },
            this.scene
        );
        collider.position.copyFrom(ctx.position);
        collider.isVisible = false;

        /* --------- модель дерева -------- */
        const model: ModelInstance = spawnFromPrefab(this.scene, this.prefab, "Tree");
        model.root.scaling.set(scale, scale, scale);

        /* --------- ECS -------- */
        const entity = this.world.createEntity();

        this.world.addComponent(entity, "Transform", {
            position: ctx.position.clone(),
            rotation: new Vector3(0, ctx.rotationY ?? 0, 0)
        });

        this.world.addComponent(entity, "Render", { model });

        this.world.addComponent(entity, "Collider", {
            mesh: collider,
            offset: Vector3.Zero()
        });
    }

}