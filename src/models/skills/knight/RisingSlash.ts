
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class RisingSlash extends Skill{

   name: SkillName = SkillName.RisingSlash;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 2;
   description: string = "1 BP - Deal MEDIUM **strength based** wind damage."
   
   skillEffect(user: Player, battle: Battle){
      
      let message = new CombatMessage(`***Performs a soaring slash.***`);
      message.keyFrames = [
         `⏫\n⏫\n⏫ ***Performs a soaring slash.***`,
         `⏫\n⏫ ***Performs a soaring slash.***\n⏫`,
         `⏫ ***Performs a soaring slash.***\n⏫\n⏫`,
         `⏫ ***Performs a soaring slash.***\n⏫`,
         `⏫ ***Performs a soaring slash.***`,
      ]

      battle.display.addMessage(message);

      for(let combatant of this.getTarget(user,battle)){

         let result =  battle.dealDamageToCombatant(user,combatant,user.stats.strength * DamageModifier.Medium, ElementalType.Wind);
         battle.display.addMessage(result.combatMessage);
      }
   }
}