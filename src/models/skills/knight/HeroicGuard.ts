import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { GuardAllies } from "../../effects/OnAllyHitEffects/GuardAllies";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class HeroicGuard extends Skill{

   name: SkillName = SkillName.HeroicGuard;
   target: TargetType = TargetType.Self;
   bpCost: number = 1;
   description: string = "1 BP - Take damage for all allies until your next turn.";
   
   skillEffect(user: Player, battle: Battle){
      battle.display.addMessage(new CombatMessage(`***Defends allies!***`));
      user.giveEffect(new GuardAllies());
   }
}