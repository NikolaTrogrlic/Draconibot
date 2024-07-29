import { getRandomPercent } from "../../../random";
import { TakeDamageResult } from "../../battle/ActionResults";
import { Battle } from "../../battle/Battle";
import { Stun } from "../Stun";
import { CounterAttackEffect } from "./CounterAttackEffect";

export class Jumping extends CounterAttackEffect{

    jumpingHigh: boolean;

    trigger(data: TakeDamageResult, battle: Battle): TakeDamageResult {

        if(this.jumpingHigh){
            data.combatMessage += "\n Is thrown off balance by the attack!";
            if(getRandomPercent() <= data.attacker.stats.luck){
                data.combatMessage +="\n **Homerun !** Slime flies off, never to be seen again.";
                data.damagedCharacter.stats.HP = 0;
            }
            else{
                data.combatMessage +="\n **Slime is stunned**";
                data.damagedCharacter.giveEffect(new Stun());
            }
        }
        return data;
    }

    constructor(jumpingHigh: boolean) {
        if(jumpingHigh){
            super("Jumping High", 1, 1, 1, 1, false);
        }
        else{
            super("Jumping Low", 1, 1, 1, 1, false);
        }
        this.jumpingHigh = jumpingHigh;
    }
}