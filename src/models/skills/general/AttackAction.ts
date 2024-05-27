
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class AttackAction extends Skill{

   name: SkillName = SkillName.Attack;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle){
      for(let combatant of this.getTarget(user,battle)){
         battle.display.addMessage(combatant.takeDamage(user.stats.strength * 1.2));
      }
   }
}