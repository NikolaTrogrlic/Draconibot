import { ButtonInteraction, StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActionRow } from "discord.js";
import { Globals } from "../../../globals";
import { ButtonName } from "../../ButtonName";
import { ButtonBase } from "../../base/ButtonBase";


export class SkillList extends ButtonBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   async execute(interaction: ButtonInteraction, globals: Globals): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);

      if(player?.menu){

         let mainJobDescription = "";
         for(let skill of player.mainJob.getUnlockedSkills()){
            mainJobDescription += `**${skill.name}** - ${skill.description}\n`;
         }

         if(mainJobDescription.length == 0){
            mainJobDescription = "No skills";
         }

         let mainJobEmbed = new EmbedBuilder()
         .setTitle(`${player.mainJob.name} skills`)
         .setDescription(mainJobDescription)
         .setColor(0x4974A5);

         let subJobDescription = "";
         for(let skill of player.subJob.getUnlockedSkills()){
            subJobDescription += `**${skill.name}** - ${skill.description}\n`;
         }

         if(subJobDescription.length == 0){
            subJobDescription = "No skills";
         }

         let subJobEmbed = new EmbedBuilder()
         .setTitle(`${player.subJob.name} skills`)
         .setDescription(subJobDescription)
         .setColor(0x4974A5);

         let components: ActionRow<any>[] = [];
         if(player.menu.message){
            components = [...player.menu.message.components];
         }

         player.menu.updateDisplay([mainJobEmbed,subJobEmbed], components, interaction)
      }
      else{
         await interaction.update({fetchReply: false});
      }
   }

   static button(): ButtonBuilder {
      return new ButtonBuilder()
      .setCustomId(ButtonName.SkillList)
      .setLabel('Skill List')
      .setStyle(ButtonStyle.Secondary);
    }
}    