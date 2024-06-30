
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { Scorch } from "../../effects/Scorch";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { PassiveName } from "../../enums/PassiveName";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class Flicker extends Skill{

   name: SkillName = SkillName.Flicker;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 0;
   description: string = "0 BP - Deal **LIGHT magic fire damage** to a single enemy. Raises burst by 10%. Does not trigger Scorch."
   
   skillEffect(user: Player, battle: Battle){
      for(let combatant of this.getTarget(user,battle)){
        user.burst += 10;
        let result =  battle.dealDamageToCombatant(user,combatant,user.stats.magic * DamageModifier.Light, ElementalType.Fire);
        battle.display.addMessage(result.combatMessage);

        if(user.passives.find(x => x.name == PassiveName.HeatHaze)){
            result.damagedCharacter.giveEffect(new Scorch());
        }
      }
   }
}