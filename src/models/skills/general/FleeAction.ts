import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
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
      let message = new CombatMessage(`${user.nickname} flees battle.`)
      message.keyFrames = [
         "🏃 ",
         "🏃 💨",
         "🏃 💨 💨 ",
         "🏃 💨 💨 💨 ",
         `${user.nickname} **flees** battle.`
      ];
      battle.display.addMessage(message);
   }
}