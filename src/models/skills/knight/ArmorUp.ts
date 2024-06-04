import { Status } from "discord.js";
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { SkillName } from "../../enums/SkillName";
import { StatusEffectType } from "../../enums/StatusEffectType";
import { Skill, TargetType } from "../Skill";
import { StatusEffect } from "../../StatusEffect";

export class ArmorUp extends Skill{

   name: SkillName = SkillName.ArmorUp;
   target: TargetType = TargetType.Party;
   bpCost: number = 2;
   description: string = "2 BP - Grant a buff to all allies reducing **physical** damage taken by 20%. Lasts 3 rounds. Stacking increases the duration.";
   
   skillEffect(user: Player, battle: Battle){
      battle.display.addMessage(new CombatMessage(`**Raises the party's ⚔️ defense !**`));
      
      for(let ally of this.getTarget(user,battle)){
         let status = ally.buffs.find(x => x.type == StatusEffectType.ArmorUp);
         if(status){
            status.duration += 3;
         }
         else{
            ally.buffs.push(new StatusEffect(StatusEffectType.ArmorUp, 3));
         }
      }
   }
}