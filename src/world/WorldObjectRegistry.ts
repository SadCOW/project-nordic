import {WorldObjectFactory} from "../factories/WorldObjectFactory";
import {World} from "../core/World";
import {Scene} from "@babylonjs/core";
import {PrefabLoader} from "../assets/PrefabLoader";
import {TreeFactory} from "../factories/TreeFactory";
import {Vector3} from "@babylonjs/core/Maths/math.vector";

export type WorldObjectType =
    | "tree"
    | "rock"
    | "resource";

export interface SpawnContext {
    position: Vector3;
    rotationY?: number;
    scale?: number;
}

export class WorldObjectRegistry {
    private factories: Map<WorldObjectType, WorldObjectFactory>;

    constructor(
        private world: World,
        private scene: Scene,
        prefabs: PrefabLoader
    ) {
        this.factories = new Map();

        this.factories.set(
            "tree",
            new TreeFactory(world, scene, prefabs)
        );
    }

    async spawn(type: WorldObjectType, ctx: SpawnContext) {
        const factory = this.factories.get(type);

        if (!factory) {
            throw new Error(`Unknown world object type: ${type}`);
        }
        await factory.spawn(ctx)
    }
}