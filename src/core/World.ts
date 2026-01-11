export type Entity = number;

export class World {
    private nextEntityId = 1;

    // Map<ComponentName, Map<Entity, ComponentData>>
    private components = new Map<string, Map<Entity, any>>();

    createEntity(): Entity {
        return this.nextEntityId++;
    }

    addComponent<T>(entity: Entity, componentName: string, data: T): void {
        if (!this.components.has(componentName)) {
            this.components.set(componentName, new Map());
        }
        this.components.get(componentName)!.set(entity, data);
    }

    removeComponent(entity: Entity, componentName: string): void {
        const pool = this.components.get(componentName);
        if (!pool) return;
        pool.delete(entity);
    }

    getComponent<T>(entity: Entity, componentName: string): T | undefined {
        return this.components.get(componentName)?.get(entity);
    }

    getComponents<T>(componentName: string): Map<Entity, T> {
        if (!this.components.has(componentName)) {
            this.components.set(componentName, new Map());
        }
        return this.components.get(componentName)! as Map<Entity, T>;
    }

    removeEntity(entity: Entity): void {
        for (const pool of this.components.values()) {
            pool.delete(entity);
        }
    }
}