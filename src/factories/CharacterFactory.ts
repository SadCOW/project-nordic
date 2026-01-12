import {MeshBuilder, Scene, Vector3} from "@babylonjs/core";
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

        const colliderHeight = 2
        const collider = MeshBuilder.CreateBox("playerCollider", {
            height: colliderHeight,
            width: 0.3,
            depth: 0.3
        }, this.scene);

        collider.position.copyFrom(pos);
        // collider.position.y = colliderHeight * 0.5;
        collider.rotation.set(0, 0, 0);

        collider.isVisible = false;
        collider.checkCollisions = true;

        // Transform
        this.world.addComponent(entity, "Transform", {
            position: pos.clone(),
            rotation: new Vector3(0, colliderHeight / 2, 0)
        });

        // Render
        this.world.addComponent(entity, "Render", {
            model
        });

        // Collider
        this.world.addComponent(entity, "Collider", {
            mesh: collider,
            offset: new Vector3(0, 1, 0)
        })

        // Animation
        this.world.addComponent(entity, "Animation", {
            current: CharacterAnimations.Idle,
            loop: true,
            speed: 1
        });

        // Movement
        this.world.addComponent(entity, "Movement", {
            velocity: new Vector3(),
            speed: 4
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