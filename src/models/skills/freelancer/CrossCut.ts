
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class CrossCut extends Skill{

   name: SkillName = SkillName.CrossCut;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 2;
   
   skillEffect(user: Player, battle: Battle){
      battle.display.addMessage(new CombatMessage(`***Slashes twice !\n***`));
      for(let combatant of this.getTarget(user,battle)){
         battle.display.addMessage(combatant.takeDamage(user.stats.strength * 1.2));
         battle.display.addMessage(combatant.takeDamage(user.stats.strength * 0.8));
      }
   }
}