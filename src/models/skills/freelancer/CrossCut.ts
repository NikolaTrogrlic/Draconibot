import { Battle } from "../../Battle";
import { Player } from "../../Player";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class CrossCut extends Skill{

   name: SkillName = SkillName.CrossCut;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 2;
   
   skillEffect(user: Player, battle: Battle): string[] {
      let messages: string[] = [`***Slashes twice !\n***`];
      for(let combatant of this.getTarget(user,battle)){
         messages.push(combatant.takeDamage(user.stats.pAtk));
         messages.push(combatant.takeDamage(user.stats.pAtk));
      }
      return messages;
   }
}