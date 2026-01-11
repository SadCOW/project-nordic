import { World } from "./World";

export abstract class System {
    // dt в секундах, чтобы сразу было удобно
    abstract update(world: World, dt: number): void;
}