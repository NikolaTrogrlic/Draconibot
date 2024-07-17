import {
   ActionRowBuilder,
   ButtonBuilder,
   ButtonInteraction,
   ButtonStyle,
   EmbedBuilder,
   StringSelectMenuBuilder,
   StringSelectMenuOptionBuilder,
 } from "discord.js";
import { Globals } from "../../../globals";
import { ButtonName } from "../../ButtonName";
import { SelectMenuType } from "../../SelectMenuType";
import { ButtonBase } from "../../base/ButtonBase";
 
 export class SetSubjob extends ButtonBase {
   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;
 
   async execute(
     interaction: ButtonInteraction,
     globals: Globals
   ): Promise<any> {
     const player = globals.getPlayerById(interaction.user.id);
     await interaction.update({fetchReply: false});
 
     if (player) {
       let jobSelect: StringSelectMenuOptionBuilder[] = [];
       for (let job of player.jobs) {
         jobSelect.push(
           new StringSelectMenuOptionBuilder()
             .setLabel(`${job.name} [Level: ${job.level} | Exp: ${job.exp}]`)
             .setValue(job.name)
         );
       }
 
       const select = new StringSelectMenuBuilder()
         .setCustomId(SelectMenuType.SetSubJobMenu)
         .setPlaceholder("Select a sub job to change to.")
         .addOptions(jobSelect);
 
       const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
       player.menu.appendToDisplay(interaction, [row]);
     }
     else{
       interaction.update({fetchReply: false});
     }
   }
 
   static button(): ButtonBuilder {
     return new ButtonBuilder()
       .setCustomId(ButtonName.SetSubjob)
       .setLabel("Set Sub")
       .setStyle(ButtonStyle.Secondary);
   }
 }