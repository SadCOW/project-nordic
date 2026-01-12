import { LevelMap, Tile } from "./types";

export class MapGenerator {
    generate(width: number, height: number): LevelMap {
        return { width, height };
    }
}