// import { Engine } from "@babylonjs/core";
// import { MainScene } from "./scenes/MainScene";
//
// const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
// const engine = new Engine(canvas, true);
//
// new MainScene(engine);
//
// engine.runRenderLoop(() => {
//     engine.scenes[0].render();
// });
//
// window.addEventListener("resize", () => {
//     engine.resize();
// });
import { Engine } from "@babylonjs/core";
import { MainScene } from "./scenes/MainScene";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// 🔹 Mobile-friendly engine config
const engine = new Engine(canvas, false, {
    preserveDrawingBuffer: false,
    stencil: false,
    powerPreference: "high-performance",
    disableWebGL2Support: false
});

// 🔹 Ограничиваем DPI (очень важно)
engine.setHardwareScalingLevel(
    Math.min(1.5, window.devicePixelRatio)
);

// 🔹 Создаём сцену и сохраняем ссылку
const mainScene = new MainScene(engine);
const scene = mainScene.scene; // предполагаем, что ты её экспортируешь

// 🔹 Render loop без лишнего доступа
engine.runRenderLoop(() => {
    if (scene && scene.activeCamera) {
        scene.render();
    }
});

// 🔹 Resize с защитой
let resizeTimeout: number | undefined;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
        engine.resize();
    }, 100);
});
