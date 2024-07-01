
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { Scorch } from "../../effects/Scorch";
import { AutoGuard } from "../../effects/WhenHitEffects/AutoGuard";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { JobName } from "../../enums/JobName";
import { PassiveName } from "../../enums/PassiveName";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";
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
                  
                  let result =  battle.dealDamageToCombatant(user,combatant,user.stats.strength * DamageModifier.Massive, ElementalType.Wind);
                  battle.display.addMessage(result.combatMessage);
               }

               if(user.mainJob.level >= 10){
                  battle.display.addMessage(new CombatMessage(`${user.nickname} starts automatically guarding incoming moves for 3 rounds.`));
                  user.giveEffect(new AutoGuard());
                  DefendAction.onDefendAction(user,battle);
               }
               break;
            }
         case JobName.Pyromancer:
            {
               var message = new CombatMessage(`**Meteors rain across the battle field!**`);
               message.keyFrames = [
                  `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛☄️⬛⬛⬛\n
                   Meteors rain across the   battlefield!\n
                   ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`,
                  
                  `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n
                   Meteors rain across the ☄️ battlefield!\n
                   ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`,
                  
                  `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n
                   Meteors rain across the  battlefield!\n
                   ⬛⬛⬛⬛⬛⬛⬛☄️⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`,
                  
                  `⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛\n
                   Meteors rain across the  battlefield!\n
                   ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`
               ]
               battle.display.addMessage(message);

               let scorchTriggered: boolean = false;
               for(let i = 0; i < 3;i++){
                  for(let combatant of this.getTarget(user,battle, TargetType.RandomEnemy)){
                  
                     let result =  battle.dealDamageToCombatant(user,combatant,user.stats.magic * DamageModifier.Light, ElementalType.Fire);
                     battle.display.addMessage(result.combatMessage);

                     if(user.mainJob.level >= 10){
                        user.heal(result.damageTaken);
                     }
                     
                     if(!scorchTriggered){
                        scorchTriggered = Scorch.didEffectTrigger(result.damagedCharacter);
                     }
                  }
               }

               if(scorchTriggered){
                  let messageDisplayed = false;

                  for(let i = 0; i < 3;i++){
                     for(let combatant of this.getTarget(user,battle, TargetType.RandomEnemy)){
                     
                        if(combatant.stats.HP > 0 && messageDisplayed == false){
                           battle.display.clearScreenAndAddMessage(
                              new CombatMessage(
                                `🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥\n
                                       Doublecast! Calamity Storm!\n
                                 🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥`));
                              messageDisplayed = true;
                        }
                        let result =  battle.dealDamageToCombatant(user,combatant,user.stats.magic * DamageModifier.Light, ElementalType.Fire);
                        battle.display.addMessage(result.combatMessage);
   
                        if(user.mainJob.level >= 10){
                           user.heal(result.damageTaken);
                        }
                     }
                  }
               }
            }
      }

      user.burst = 0;
   }
}