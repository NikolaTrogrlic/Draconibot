import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from "discord.js";
import { Globals } from "../../globals";
import { ButtonName } from "../ButtonName";
import { ButtonBase } from "../base/ButtonBase";
import { AdventureButton } from "./AdventureButton";
import { PlayCommand } from "../commands/PlayCommand";

export class ReturnToMenu extends ButtonBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   async execute(interaction: ButtonInteraction, globals: Globals): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);

      if(player){
         await PlayCommand.generateMainMenu(player, interaction);
      }
   }

   static button(): ButtonBuilder {
      return new ButtonBuilder()
      .setCustomId(ButtonName.ReturnToMenu)
      .setLabel('Return')
      .setStyle(ButtonStyle.Danger);
    }
}    