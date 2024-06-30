import { TakeDamageResult } from "../../battle/ActionResults";
import { ElementalType } from "../../enums/ElementalType";
import { TriggerWhenHitEffect } from "./TriggerWhenHitEffect";

export class DefenseUp extends TriggerWhenHitEffect{

    trigger(data: TakeDamageResult): TakeDamageResult {

        if(data.damageElement == ElementalType.Physical){
            data.damageTaken = data.damageTaken * 0.8;
        }
        return data;
    }

    constructor(duration: number = 3) {
        super("Defense Up", duration, 5, 1);
        
    }
}