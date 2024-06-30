import { TakeDamageResult } from "../../battle/ActionResults";
import { Battle } from "../../battle/Battle";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { CounterAttackEffect } from "./CounterAttackEffect";

export class FireTrapEffect extends CounterAttackEffect{

    trigger(data: TakeDamageResult, battle: Battle): TakeDamageResult {
        if(data.damageElement == ElementalType.Physical){
           let counterResult = battle.dealDamageToCombatant(data.damagedCharacter, data.attacker, data.damagedCharacter.stats.magic * DamageModifier.Weak, ElementalType.Fire);
           data.combatMessage.message += `\n${data.damagedCharacter.nickname} **counterattacks**\n ${counterResult.combatMessage}`;
        }
        return data;
    }

    constructor(duration: number = 3) {
        super("Fire Trap", duration, 5, 1);
    }
}