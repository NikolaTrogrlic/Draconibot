
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { ElementalType } from "../../enums/ElementalType";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class RisingSlash extends Skill{

   name: SkillName = SkillName.RisingSlash;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 2;
   
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
         battle.display.addMessage(combatant.takeDamage(user.stats.strength * 1.3, ElementalType.Wind));
      }
   }
}