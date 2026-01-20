import { System } from "../core/System";
import { World } from "../core/World";
import { TransformComponent } from "../components/TransformComponent";
import type { MoveIntentComponent } from "../components/MoveIntentComponent";
import type { ColliderComponent } from "../components/ColliderComponent";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

type Aabb2 = { minX: number; maxX: number; minZ: number; maxZ: number };

const TMP_VEC = new Vector3(); // переиспользуемый вектор

function aabbXZ(center: Vector3, half: Vector3): Aabb2 {
    return {
        minX: center.x - half.x,
        maxX: center.x + half.x,
        minZ: center.z - half.z,
        maxZ: center.z + half.z,
    };
}

function intersects(a: Aabb2, b: Aabb2): boolean {
    return !(
        a.maxX <= b.minX ||
        a.minX >= b.maxX ||
        a.maxZ <= b.minZ ||
        a.minZ >= b.maxZ
    );
}

export class BoxCollisionSystem extends System {
    private static readonly EPS = 1e-4;

    update(world: World, dt: number): void {
        const transforms = world.getComponents<TransformComponent>("Transform");
        const intents = world.getComponents<MoveIntentComponent>("MoveIntent");
        const colliders = world.getComponents<ColliderComponent>("Collider");

        /* ---------- собираем статику раз-за-кадр ---------- */
        const staticAabbs: Aabb2[] = [];

        for (const [e, col] of colliders) {
            if (intents.has(e)) continue; // у динамики есть MoveIntent
            const t = transforms.get(e);
            if (!t) continue;

            const half = col.mesh.getBoundingInfo().boundingBox.extendSizeWorld;
            TMP_VEC.copyFrom(t.position).addInPlace(col.offset);
            staticAabbs.push(aabbXZ(TMP_VEC, half));
        }

        /* ---------- двигаем динамику ---------- */
        for (const [e, intent] of intents) {
            if (intent.delta.lengthSquared() === 0) continue;

            const t = transforms.get(e);
            const col = colliders.get(e);
            if (!t || !col) continue;

            const half = col.mesh.getBoundingInfo().boundingBox.extendSizeWorld;
            TMP_VEC.copyFrom(t.position).addInPlace(col.offset);
            const startCenter = TMP_VEC.clone(); // one alloc per entity

            /* ----- попытка X ----- */
            let centerX = startCenter.x + intent.delta.x;
            let centerZ = startCenter.z; // ещё без Z-сдвига

            let test = aabbXZ(new Vector3(centerX, 0, centerZ), half);
            for (const sb of staticAabbs) {
                if (!intersects(test, sb)) continue;
                centerX =
                    intent.delta.x > 0
                        ? sb.minX - half.x - BoxCollisionSystem.EPS
                        : sb.maxX + half.x + BoxCollisionSystem.EPS;
                test = aabbXZ(new Vector3(centerX, 0, centerZ), half);
            }

            /* ----- попытка Z ----- */
            centerZ = startCenter.z + intent.delta.z;
            test = aabbXZ(new Vector3(centerX, 0, centerZ), half);
            for (const sb of staticAabbs) {
                if (!intersects(test, sb)) continue;
                centerZ =
                    intent.delta.z > 0
                        ? sb.minZ - half.z - BoxCollisionSystem.EPS
                        : sb.maxZ + half.z + BoxCollisionSystem.EPS;
                test = aabbXZ(new Vector3(centerX, 0, centerZ), half);
            }

            /* ----- пишем результат в Transform ----- */
            t.position.x = centerX - col.offset.x;
            t.position.z = centerZ - col.offset.z;
        }
    }
}
