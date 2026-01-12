import {SpawnContext} from "../world/WorldObjectRegistry";

export interface WorldObjectFactory {
    spawn(ctx: SpawnContext): Promise<void>;
}