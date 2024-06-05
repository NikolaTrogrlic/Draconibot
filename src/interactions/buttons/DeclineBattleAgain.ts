import {
   ButtonBuilder,
   ButtonInteraction,
   ButtonStyle,
   CacheType,
 } from "discord.js";
 import { Globals } from "../../globals";
import { ButtonType } from "../ButtonType";
import { ButtonBase } from "../base/ButtonBase";
import { PlayCommand } from "../commands/PlayCommand";
 
 export class DeclineBattleAgain extends ButtonBase {

  needsPlayerExistance = true;

   static button(): ButtonBuilder {
     return new ButtonBuilder()
       .setCustomId(ButtonType.DeclineBattleAgain)
       .setLabel("Stop Fighting")
       .setStyle(ButtonStyle.Danger);
   }

   async execute(
     interaction: ButtonInteraction<CacheType>,
     globals: Globals,
     originInteractionID: string
   ): Promise<any> {
     const player = globals.getPlayerById(interaction.user.id);
 
     if (player && player.battleID) {
       const previousBattle = globals.getPlayerBattle(player);

       if(previousBattle){
         if(player.partyID){
            const party = globals.getPlayerParty(player);
            if(party){
               for(let member of party.partyMembers){
                  member.battleID = undefined;
               }
            }
            else{
               await interaction.reply("Error occured.");
            }
         }
         else{
            player.battleID = undefined;
         }

        PlayCommand.generateMainMenu(player, interaction);

         const index = globals.battles.indexOf(previousBattle, 0);
         if (index > -1) {
            globals.battles.splice(index, 1);
         }
       }
       else{
         const reply = await interaction.reply("You are not even in a battle.");
         setTimeout(() => reply.delete(), 3000);
       }

     } else {
       const reply = await interaction.reply("Must be in a battle first.");
       setTimeout(() => reply.delete(), 3000);
     }
   }
 } 