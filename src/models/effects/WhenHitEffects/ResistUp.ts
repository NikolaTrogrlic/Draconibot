import { TakeDamageResult } from "../../battle/ActionResults";
import { ElementalType } from "../../enums/ElementalType";
import { TriggerWhenHitEffect } from "./TriggerWhenHitEffect";

export class ResistUp extends TriggerWhenHitEffect{

    resistance: ElementalType;

    trigger(data: TakeDamageResult): TakeDamageResult {
        if(data.damageElement == this.resistance){
            data.resistanceWasHit = true;
            data.damageTaken *= 0.7;
        }
        return data;
    }

    constructor(name: string, duration: number, resistance: ElementalType) {
        super(name,duration,3,1);
        this.resistance = resistance;
    }
}