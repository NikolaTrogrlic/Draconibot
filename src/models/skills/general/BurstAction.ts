
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { ElementalType } from "../../enums/ElementalType";
import { JobName } from "../../enums/JobName";
import { SkillName } from "../../enums/SkillName";
import { Job } from "../../jobs/Job";
import { Skill, TargetType } from "../Skill";

export class BurstAction extends Skill{

   name: SkillName = SkillName.Burst;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle){
      switch(user.mainJob.name){
         case JobName.Freelancer:
            {
               battle.display.addMessage(new CombatMessage(`🌪️ **A powerful storm is summoned beneath ${user.nickname}'s enemies!** 🌪️\n`));
               for(let combatant of this.getTarget(user,battle, TargetType.AllEnemies)){
                  battle.display.addMessage(combatant.takeDamage(user.stats.strength * 2, ElementalType.Wind));
               }
               break;
            }
      }
   }
}