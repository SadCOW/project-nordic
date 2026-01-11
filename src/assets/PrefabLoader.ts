import { AssetContainer } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF";

export type GlbPrefab = {
    container: AssetContainer;
};

export class PrefabLoader {
    private cache = new Map<string, Promise<GlbPrefab>>();

    constructor(private scene: Scene) {}

    /**
     * Загружает GLB один раз и кеширует AssetContainer.
     * Повторные вызовы с тем же url вернут уже существующий Promise.
     */
    loadGLB(url: string): Promise<GlbPrefab> {
        if (!this.cache.has(url)) {
            const promise = SceneLoader.LoadAssetContainerAsync(url, "", this.scene)
                .then((container) => {
                    // ВАЖНО:
                    // НЕ делаем container.addAllToScene()
                    // AssetContainer используется как префаб-шаблон.
                    return { container };
                })
                .catch((err) => {
                    // если загрузка упала, убираем из кеша, чтобы можно было попробовать снова
                    this.cache.delete(url);
                    throw err;
                });

            this.cache.set(url, promise);
        }

        return this.cache.get(url)!;
    }

    /**
     * Очистка кеша (например при смене уровня)
     */
    clear() {
        this.cache.clear();
    }
}