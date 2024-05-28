
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class CrossCut extends Skill{

   name: SkillName = SkillName.CrossCut;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 2;
   description: string = "2 BP - Perform a [1.2 x STR] and [0.8 x STR] physical attack. Both attacks benefit from any passive bonuses for the 'Attack' command.";
   
   skillEffect(user: Player, battle: Battle){
      battle.display.addMessage(new CombatMessage(`***Slashes twice !\n***`));
      for(let combatant of this.getTarget(user,battle)){

         let result = combatant.takeDamage(user.stats.strength * 1.2);
         battle.display.addMessage(result.combatMessage);
         
         //Second hit only if enemy is still alive
         if(combatant.stats.HP > 0){
            let result2 = combatant.takeDamage(user.stats.strength * 0.8);
            battle.display.addMessage(result2.combatMessage);
         }
      }
   }
}