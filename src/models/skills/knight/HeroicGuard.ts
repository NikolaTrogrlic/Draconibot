import { getRandomPercent } from "../../../random";
import { Player } from "../../Player";
import { StatusEffect } from "../../StatusEffect";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { SkillName } from "../../enums/SkillName";
import { StatusEffectType } from "../../enums/StatusEffectType";
import { Skill, TargetType } from "../Skill";

export class HeroicGuard extends Skill{

   name: SkillName = SkillName.HeroicGuard;
   target: TargetType = TargetType.Self;
   bpCost: number = 1;
   description: string = "1 BP - Take damage for all allies until your next turn.";
   
   skillEffect(user: Player, battle: Battle){
      battle.display.addMessage(new CombatMessage(`***Defends allies!***`));
      let buffIndex = user.buffs.findIndex(x => x.type == StatusEffectType.HeroicGuard);
      if(buffIndex == -1){
         user.buffs.push(new StatusEffect(StatusEffectType.HeroicGuard, 1));
      }
      else{
         user.buffs[buffIndex].duration++;
      }
   }
}