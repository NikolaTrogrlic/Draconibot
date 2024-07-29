import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import { Globals } from "../../globals";
import { ButtonName } from "../ButtonName";
import { ButtonBase } from "../base/ButtonBase";
import { ReturnToMenu } from "./ReturnToMenu";
import { SlimeExtermination } from "./quests/SlimeExtirmination";

export class QuestsMenu extends ButtonBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   async execute(interaction: ButtonInteraction, globals: Globals): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);
      await interaction.update({fetchReply: false});

      if(player?.menu){

         let embed = new EmbedBuilder()
         .setTitle(`${player.nickname} | Quests`)
         .setDescription(`Select a quest`)
         .setColor(0x4974A5);

         let buttonList = new ActionRowBuilder<ButtonBuilder>()
         .addComponents(ReturnToMenu.button());

         let questList = new ActionRowBuilder<ButtonBuilder>()
         .addComponents(SlimeExtermination.button());

         player.menu.updateDisplay([embed],[buttonList,questList],interaction);
      }
   }

   static button(): ButtonBuilder {
      return new ButtonBuilder()
      .setCustomId(ButtonName.QuestsMenu)
      .setLabel('Quests')
      .setStyle(ButtonStyle.Secondary);
    }
}    