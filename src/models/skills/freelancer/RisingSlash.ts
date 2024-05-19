import { Battle } from "../../Battle";
import { BlockType } from "../../Combatant";
import { Player } from "../../Player";
import { ElementalType } from "../../enums/ElementalType";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class RisingSlash extends Skill{

   name: SkillName = SkillName.RisingSlash;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 1;
   
   skillEffect(user: Player, battle: Battle): string[]{
      let messages: string[] = [`***Performs a soaring slash.\n***`];
      let damage = 0;
      if(battle.burst == ElementalType.Wind){
         damage = Math.round(user.stats.pAtk * 1.4);
      }
      else{
         damage = Math.round(user.stats.pAtk * 1.2);
      }

      for(let combatant of this.getTarget(user,battle)){
         messages.push(combatant.takeDamage(damage, BlockType.Armor, ElementalType.Wind));
      }

      return messages;
   }
}