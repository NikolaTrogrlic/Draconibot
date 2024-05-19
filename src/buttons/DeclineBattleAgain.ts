import {
   ButtonBuilder,
   ButtonInteraction,
   ButtonStyle,
   CacheType,
 } from "discord.js";
 import { Globals } from "../globals";
 import { ButtonBase, ButtonKey } from "./ButtonBase";
 
 export class DeclineBattleAgain extends ButtonBase {
   static button(): ButtonBuilder {
     return new ButtonBuilder()
       .setCustomId(ButtonKey.DeclineBattleAgain)
       .setLabel("Stop Fighting")
       .setStyle(ButtonStyle.Danger);
   }
 
   constructor() {
     super(ButtonKey.DeclineBattleAgain);
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
               return interaction.reply("Error occured.");
            }
         }
         else{
            player.battleID = undefined;
         }
        await previousBattle.battleUI?.delete();

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