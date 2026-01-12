export type TileType = "ground" | "wall" | "water";

export type Tile = {
    type: TileType;
    walkable: boolean;
};

export type LevelMap = {
    width: number;
    height: number;
    // tiles: Tile[][];
};