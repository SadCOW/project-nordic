import {Scene, Vector3} from "@babylonjs/core";
import {World} from "../core/World";
import {spawnFromPrefab} from "../assets/spawnFromPrefab";
import {PrefabLoader} from "../assets/PrefabLoader";
import {CharacterAnimations} from "../components/animations/CharacterAnimations";

export class CharacterFactory {
    constructor(private world: World, private scene: Scene, private prefabs: PrefabLoader) {
    }

    async createCharacter(url: string, pos: Vector3) {
        const entity = this.world.createEntity();

        const prefab = await this.prefabs.loadGLB(url);
        const model = spawnFromPrefab(this.scene, prefab.container, "Character");

        // Transform
        this.world.addComponent(entity, "Transform", {
            position: pos.clone(),
            rotation: new Vector3(0, Math.PI, 0)
        });

        // Render
        this.world.addComponent(entity, "Render", {
            model
        });

        // Animation
        this.world.addComponent(entity, "Animation", {
            current: CharacterAnimations.Idle,
            loop: true,
            speed: 1
        });

        // Movement
        this.world.addComponent(entity, "Movement", {
            velocity: new Vector3(),
            speed: 3
        });

        // Input
        this.world.addComponent(entity, "Input", {
            forward: false,
            backward: false,
            left: false,
            right: false
        });

        // Camera target
        this.world.addComponent(entity, "CameraTarget", {});

        // Attack
        this.world.addComponent(entity, "Attack", {
            isAttacking: false,
            cooldown: 0,
            attackDuration: 0.6
        });

        return entity;
    }
}