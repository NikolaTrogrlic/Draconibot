import { ButtonInteraction } from "discord.js";
import { Globals } from "../globals";

export class TargetButton{

   static async execute(interaction: ButtonInteraction, globals: Globals, target: number): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);
      if(player){
          let battle = globals.getPlayerBattle(player);
          if(battle && battle.currentActionOwner == player){
            battle.updateTarget(target)
            console.log(battle.currentTarget);
            interaction.reply({content: `Changed target on next skill use to ${target + 1} .`, ephemeral: true});
          }
          else{
            interaction.reply({content: `Must be in a battle and it must be your turn.`, ephemeral: true});
          }
      }
      else{
         interaction.reply({content: `Must be a participant to target creatures.`, ephemeral: true});
      }
   }
}    