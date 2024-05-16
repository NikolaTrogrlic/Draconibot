import { Battle } from "../../Battle";
import { Player } from "../../Player";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class DefendAction extends Skill{

   name: SkillName = SkillName.Defend;
   target: TargetType = TargetType.Self;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle): string{
      
      user.isDefending = true;

      return "Defends.";
   }
}