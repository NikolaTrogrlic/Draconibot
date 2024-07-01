import { getRandomPercent } from "../../random";
import { Combatant } from "../Combatant";
import { EffectBase } from "./EffectBase";

export class Scorch extends EffectBase{

    static didEffectTrigger(target: Combatant): boolean{
        for(let effect of target.effects){
            if(effect instanceof Scorch && effect.duration > 0){
                let chance = 5 * effect.stacks;
                if(getRandomPercent() < chance){
                    effect.duration = 0;
                    effect.stacks = 0;
                    return true;
                }
            }
        }
        return false;
    }

    constructor(stacks: number = 1,duration: number = 2) {
        super("Scorch",duration,3,10,stacks);
    }
}