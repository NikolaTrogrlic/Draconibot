import { getRandomPercent } from "../../../random";
import { TakeDamageResult } from "../../battle/ActionResults";
import { ElementalType } from "../../enums/ElementalType";
import { TriggerWhenAttackingEffect } from "./TriggerWhenAttackingEffect";

export class Blinded extends TriggerWhenAttackingEffect{

     trigger(data: TakeDamageResult): TakeDamageResult{

        if(data.damageElement == ElementalType.Physical){
            if(getRandomPercent() < 10){
                data.evaded = true;
            }
        }

        return data;
     }

     constructor(duration: number = 2) {
        super("Blinded",duration,5,1,1);
     }
}