
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class DefendAction extends Skill{

   name: SkillName = SkillName.Defend;
   target: TargetType = TargetType.Self;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle){
      user.isDefending = true;
      let message = new CombatMessage("🛡️ Defends.");
      battle.display.addMessage(message);
   }
}