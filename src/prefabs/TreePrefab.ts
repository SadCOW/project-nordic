import {Mesh, Scene} from "@babylonjs/core";
import {AssetLoader} from "../core/AssetLoader";

export class TreePrefab {
    private baseMesh?: Mesh;

    constructor(
        private assetLoader: AssetLoader,
        private assetKey: string,
        private scale = 1
    ) {
    }

    /**
     * Returns base mesh for instancing / thinInstances
     * GLB must be loaded beforehand
     */
    async getBaseMesh(scene: Scene): Promise<Mesh> {
        if (this.baseMesh) {
            return this.baseMesh;
        }

        // const mesh = this.assetLoader.instantiateMesh(this.assetKey);
        const {root, mesh} = this.assetLoader.instantiateModel(
            this.assetKey,
            // {
            //     name: "tree"
            // }
        );
        if (!(mesh instanceof Mesh)) {
            const name = (mesh as any)?.name ?? "<unknown>";
            throw new TypeError(`AssetLoader.instantiateMesh('${this.assetKey}') must return a Mesh` +
                `Returned: ${mesh?.constructor?.name ?? typeof mesh} (name: ${name}).`
            );
        }

        mesh.setEnabled(true);
        mesh.isPickable = false;
        mesh.checkCollisions = false;
        mesh.receiveShadows = false;

        mesh.scaling.setAll(this.scale);

        // mobile optimizations
        mesh.freezeWorldMatrix();

        if (mesh.material) {
            mesh.material.freeze();
        }

        this.baseMesh = mesh;
        return mesh;
    }
}
