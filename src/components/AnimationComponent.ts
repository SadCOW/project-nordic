export type AnimationComponent = {
    current: string;      // имя AnimationGroup, которая должна играть
    loop: boolean;        // зацикливать или нет
    speed: number;        // speedRatio
};