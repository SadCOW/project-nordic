import { Component } from "../core/Component";

export class TreeComponent extends Component {
    hp = 50;

    chop(damage: number) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.gameObject.mesh.dispose();
        }
    }
}
