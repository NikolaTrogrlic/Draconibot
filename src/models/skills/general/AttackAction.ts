import { Battle } from "../../Battle";
import { Player } from "../../Player";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class AttackAction extends Skill{

   name: SkillName = SkillName.Attack;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle): string{
      let message = "";
      for(let combatant of this.getTarget(user,battle)){
         message += combatant.takeDamage(user.stats.pAtk);
      }

      return message;
   }
}