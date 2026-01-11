import {Engine} from "@babylonjs/core/Engines/engine";
import {Scene} from "@babylonjs/core/scene";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {HemisphericLight} from "@babylonjs/core/Lights/hemisphericLight";
import "@babylonjs/loaders/glTF";

import {World} from "./core/World";
import {PrefabLoader} from "./assets/PrefabLoader";

import {IsometricCamera} from "./rendering/IsometricCamera";

import {CharacterAnimations} from "./components/animations/CharacterAnimations";
// import {MovementComponent} from "./components/MovementComponent";

import {MovementSystem} from "./systems/MovementSystem";
import {AnimationStateSystem} from "./systems/AnimationStateSystem";
import {AnimationSystem} from "./systems/AnimationSystem";
import {RenderSyncSystem} from "./systems/RenderSyncSystem";
import {CharacterFactory} from "./gameplay/CharacterFactory";
import {InputSystem} from "./systems/InputSystem";
import {CameraFollowSystem} from "./systems/CameraFollowSystem";
import {AttackSystem} from "./systems/AttackSystem";

// ----------------------------------------------------------------
// CANVAS
// ----------------------------------------------------------------
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// ----------------------------------------------------------------
// ENGINE + SCENE
// ----------------------------------------------------------------
const engine = new Engine(canvas, true);
const scene = new Scene(engine);

// ----------------------------------------------------------------
// LIGHT
// ----------------------------------------------------------------
const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
light.intensity = 1.1;

// ----------------------------------------------------------------
// CAMERA (ISOMETRIC)
// ----------------------------------------------------------------
const isoCamera = new IsometricCamera(scene, Vector3.Zero());

// ----------------------------------------------------------------
// ECS WORLD
// ----------------------------------------------------------------
const world = new World();

// ----------------------------------------------------------------
// SYSTEMS (ВАЖЕН ПОРЯДОК)
// 1. InputSystem           > отслеживания нажатых клавиш
// 2. MovementSystem        > двигает Transform
// 2. AnimationStateSystem  > решает Idle или Run
// 3. AnimationSystem       > реально включает нужную анимацию
// 4. CameraFollowSystem    > привязка камеры к Персонажу
// 5. RenderSyncSystem      > копирует Transform → Babylon
// ----------------------------------------------------------------
const systems = [
    new InputSystem(),
    new MovementSystem(),
    new AnimationStateSystem(
        CharacterAnimations.Idle,
        CharacterAnimations.Run_forward
    ),
    new AttackSystem(CharacterAnimations.Attack, 1.6),
    new AnimationSystem(),
    new CameraFollowSystem(isoCamera),
    new RenderSyncSystem()
];

// ----------------------------------------------------------------
// PREFAB LOADER
// ----------------------------------------------------------------
const prefabLoader = new PrefabLoader(scene);

// ----------------------------------------------------------------
// SPAWN CHARACTER
// ----------------------------------------------------------------
async function spawnCharacter() {
    const factory = new CharacterFactory(world, scene, prefabLoader);
    const playerEntity = await factory.createCharacter("/models/player/player.glb", new Vector3(0, 0, 0));

    // const movement = world.getComponent<MovementComponent>(playerEntity, "Movement")
}

await spawnCharacter();

// ----------------------------------------------------------------
// MAIN LOOP
// ----------------------------------------------------------------
engine.runRenderLoop(() => {
    const dt = engine.getDeltaTime() * 0.001;

    for (const system of systems) {
        system.update(world, dt);
    }

    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});