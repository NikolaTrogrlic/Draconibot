import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import { Globals } from "../../globals";
import { ButtonType } from "../ButtonType";
import { ButtonBase } from "../base/ButtonBase";
import { AdventureButton } from "./AdventureButton";
import { ReturnToMenu } from "./ReturnToMenu";

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
         .setDescription(`**Adventure** - Set out on a series of battles resulting in experience gained at the end.\n**Hunt** - Battle a powerful monster. Power of the monster depends on difficulty. It is recommended to bring allies for higher difficulties.`)
         .setColor(0x4974A5);

         let buttonList = new ActionRowBuilder<ButtonBuilder>()
         .addComponents(AdventureButton.button())
         .addComponents(ReturnToMenu.button())

         player.menu.updateDisplay([embed],[buttonList],interaction);
      }
   }

   static button(): ButtonBuilder {
      return new ButtonBuilder()
      .setCustomId(ButtonType.QuestsMenu)
      .setLabel('Quests')
      .setStyle(ButtonStyle.Secondary);
    }
}    