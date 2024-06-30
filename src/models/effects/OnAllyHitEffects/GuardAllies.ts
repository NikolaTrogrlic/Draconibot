import { Combatant } from "../../Combatant";
import { TakeDamageResult } from "../../battle/ActionResults";
import { TriggerWhenAllyHitEffect } from "./TriggerWhenAllyHitEffect";

export class GuardAllies extends TriggerWhenAllyHitEffect{
    
    trigger(owner: Combatant ,data: TakeDamageResult): TakeDamageResult {
        if(owner.stats.HP > 0){
            data.combatMessage.message += `**${owner.nickname} blocks the hit for ${data.damagedCharacter.nickname}**\n`;
            data.damagedCharacter = owner;
        }
        return data; 
    }
    
    constructor(duration: number = 1) {
        super("Guarding Allies", duration, 2, 1, 1);
    }

}