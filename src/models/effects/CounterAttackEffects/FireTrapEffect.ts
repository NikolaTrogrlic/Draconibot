import { TakeDamageResult } from "../../battle/ActionResults";
import { Battle } from "../../battle/Battle";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { CounterAttackEffect } from "./CounterAttackEffect";

export class FireTrapEffect extends CounterAttackEffect{

    trigger(data: TakeDamageResult, battle: Battle): TakeDamageResult {

        if(data.damageElement == ElementalType.Physical && this.stacks > 0){
            let counterResult = battle.dealDamageToCombatant(data.damagedCharacter, data.attacker, data.damagedCharacter.stats.magic * DamageModifier.Weak, ElementalType.Fire);
            data.combatMessage += `\n\n${data.attacker.nickname} **triggers a trap ♨️**\n${counterResult.combatMessage}`;
            this.stacks--;
        }
        return data;
    }

    constructor(duration: number = 2) {
        super("Fire Trap", duration, 2, 5, 2);
    }
}