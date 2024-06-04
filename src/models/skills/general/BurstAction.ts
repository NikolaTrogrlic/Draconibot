
import { Player } from "../../Player";
import { StatusEffect } from "../../StatusEffect";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { ElementalType } from "../../enums/ElementalType";
import { JobName } from "../../enums/JobName";
import { SkillName } from "../../enums/SkillName";
import { StatusEffectType } from "../../enums/StatusEffectType";
import { Job } from "../../jobs/Job";
import { Skill, TargetType } from "../Skill";
import { DefendAction } from "./DefendAction";

export class BurstAction extends Skill{

   name: SkillName = SkillName.Burst;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle){
      switch(user.mainJob.name){
         case JobName.Knight:
            {
               battle.display.addMessage(new CombatMessage(`🌪️ **A powerful storm is summoned beneath ${user.nickname}'s enemies!** 🌪️\n`));
               for(let combatant of this.getTarget(user,battle, TargetType.AllEnemies)){
                  
                  let result =  battle.dealDamageToCombatant(combatant,user.stats.strength * 1.8, ElementalType.Wind);
                  battle.display.addMessage(result.combatMessage);
               }

               if(user.mainJob.level >= 10){
                  battle.display.addMessage(new CombatMessage(`${user.nickname} starts automatically guarding incoming moves for 3 rounds.`));
                  let status = user.buffs.find(x => x.type == StatusEffectType.AutoGuard);
                  if(status){
                     status.duration += 3;
                  }
                  else{
                     user.buffs.push(new StatusEffect(StatusEffectType.AutoGuard, 3));
                  }
                  DefendAction.onDefendAction(user,battle);
               }
               break;
            }
      }
   }
}