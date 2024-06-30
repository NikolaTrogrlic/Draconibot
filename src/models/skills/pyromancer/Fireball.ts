import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { Scorch } from "../../effects/Scorch";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { PassiveName } from "../../enums/PassiveName";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class Fireball extends Skill{

    name: SkillName = SkillName.Fireball;
    target: TargetType = TargetType.AllEnemies;
    bpCost: number = 3;
    description: string = "3 BP - Shoot a HEAVY **magic fire damage** flaming ball of fire, dealing damage to all enemies."
    
    skillEffect(user: Player, battle: Battle){

        let scorchTriggered: boolean = false;
        let message = new CombatMessage(`***Shoots a ball of fire.***`);
        message.keyFrames = [
         `🔥⚫⚫⚫⚫`,
         `⚫🔥⚫⚫⚫`,
         `⚫⚫🔥⚫⚫`,
         `⚫⚫💥⚫⚫`,
         `⚫💥⚫💥⚫`,
         `💥⚫⚫⚫💥`,
         '⚫⚫⚫⚫⚫'
        ]
        battle.display.addMessage(message);

       for(let combatant of this.getTarget(user,battle)){
          let result =  battle.dealDamageToCombatant(user,combatant,user.stats.magic * DamageModifier.Heavy, ElementalType.Fire);
          battle.display.addMessage(result.combatMessage);

          if(user.passives.find(x => x.name == PassiveName.HeatHaze)){
            result.damagedCharacter.giveEffect(new Scorch());
          }
          
          if(!scorchTriggered){
            scorchTriggered = Scorch.didEffectTrigger(result.damagedCharacter);
          }
       }

       if(scorchTriggered){
        let messageDisplayed = false;
        for(let combatant of this.getTarget(user,battle)){
          if(combatant.stats.HP > 0 && messageDisplayed == false){
            battle.display.addMessage(new CombatMessage("\n**[SCORCH] Doublecast! Nova flame!**"));
            messageDisplayed = true;
          }
            let result =  battle.dealDamageToCombatant(user,combatant,user.stats.magic * DamageModifier.Heavy, ElementalType.Fire);
            battle.display.addMessage(result.combatMessage);
        }
      }
    }
 }