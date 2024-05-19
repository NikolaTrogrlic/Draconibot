import { ButtonInteraction } from "discord.js";
import { Globals } from "../globals";

export class TargetButton{

   static async execute(interaction: ButtonInteraction, globals: Globals, target: number): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);
      if(player){
          let battle = globals.getPlayerBattle(player);
          if(battle && battle.currentActionOwner == player){
            battle.updateTarget(target)
            const reply = await interaction.reply({content: `Changed target on next skill use to ${target + 1} .`, ephemeral: true});
            setTimeout(() => reply.delete(), 300);
          }
          else{
            const reply = await interaction.reply({content: `Must be in a battle and it must be your turn.`, ephemeral: true});
            setTimeout(() => reply.delete(), 800);
          }
      }
      else{
         const reply = await interaction.reply({content: `Must be a participant to target creatures.`, ephemeral: true});
            setTimeout(() => reply.delete(), 800);
      }
   }
}    