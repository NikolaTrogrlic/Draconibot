import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class FleeAction extends Skill{

   name: SkillName = SkillName.Flee;
   target: TargetType = TargetType.Self;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle){
      
      battle.display.addMessage();
      user.actions = 0;
      user.isFleeing = true;
      battle.display.addMessage(`🏃 ${user.nickname} flees battle.`);
   }
}