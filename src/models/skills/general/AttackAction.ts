import { Battle } from "../../Battle";
import { Player } from "../../Player";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class AttackAction extends Skill{

   name: SkillName = SkillName.Attack;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle): string[] {
      let messages: string[] = [];
      for(let combatant of this.getTarget(user,battle)){
         messages.push(combatant.takeDamage(user.stats.pAtk));
      }
      return messages;
   }
}