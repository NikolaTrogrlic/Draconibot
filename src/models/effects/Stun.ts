import { EffectBase } from "./EffectBase";

export class Stun extends EffectBase{

    constructor(duration: number = 1) {
        super("Stunned",duration,2,1,1,false);
    }
}