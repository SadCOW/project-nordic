import {AbstractMesh, AssetContainer, Scene, TransformNode, Vector3} from "@babylonjs/core";
import {SceneLoader} from "@babylonjs/core/Loading/sceneLoader";

import "@babylonjs/loaders/glTF";

export class AssetLoader {
    private scene: Scene;
    private containers = new Map<string, AssetContainer>();
    private loading = new Map<string, Promise<void>>();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Load GLB-model
     * @param key
     * @param rootUrl
     * @param filename
     */
    async load(
        key: string,
        rootUrl: string,
        filename: string
    ): Promise<void> {

        if (this.containers.has(key)) {
            return;
        }

        if (this.loading.has(key)) {
            return this.loading.get(key)!;
        }

        if (!filename.endsWith(".glb")) {
            throw new Error("Not allowed file extension");
        }

        const promise = SceneLoader
            .LoadAssetContainerAsync(rootUrl, filename, this.scene)
            .then(container => {
            this.containers.set(key, container);
            this.loading.delete(key);
            // console.log(container);
        });

        this.loading.set(key, promise);

        return promise;
    }

    /**
     * Create instance of loaded GBL-model
     * @param key
     * @param options
     */
    instantiate(
        key: string,
        options?: {
            name?: string;
            parent?: AbstractMesh | null;
            position?: Vector3;
        }
    ): TransformNode[] {
        const container = this.containers.get(key);
        if (!container) {
            throw new Error(`GLB "${key}" not loaded`);
        }

        const result = container.instantiateModelsToScene(
            name => options?.name ?? name,
            false
        )

        if (options?.parent) {
            result.rootNodes.forEach(n => n.parent = options.parent!);
        }

        if (options?.position) {
            result.rootNodes.forEach(n => {
                if (n instanceof TransformNode) {
                    n.position.copyFrom(options.position!);
                }
            });
        }

        return result.rootNodes as TransformNode[];
    }

    instantiateMesh(key: string): AbstractMesh {
        const container = this.containers.get(key);
        if (!container) {
            throw new Error(`GLB "${key}" not loaded`);
        }

        const result = container.instantiateModelsToScene();

        const meshes = result.rootNodes.flatMap(n => n.getChildMeshes(false));

        if (meshes.length === 0) {
            throw new Error(`GLB "${key}" does not contain meshes`);
        }

        return meshes[0];
    }

    /**
     * Unload GBL-model
     * @param key
     */
    dispose(key: string): void {
        const container = this.containers.get(key);
        if (!container) return;

        container.dispose();
        this.containers.delete(key);
    }

    /**
     * Full cleaning
     */
    disposeAll(): void {
        this.containers.forEach(c => c.dispose());
        this.containers.clear();
    }
}
