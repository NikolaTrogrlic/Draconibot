import { ButtonInteraction, StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Globals } from "../../../globals";
import { Player } from "../../../models/Player";
import { ButtonType } from "../../ButtonType";
import { ButtonBase } from "../../base/ButtonBase";
import { ReturnToMenu } from "../ReturnToMenu";
import { SetPassives } from "./SetPassives";


export class EquipMenu extends ButtonBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   async execute(interaction: ButtonInteraction, globals: Globals): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);

      if(player){
         await EquipMenu.generateMenu(player, interaction);
      }
   }

   static async generateMenu(player: Player, interaction: StringSelectMenuInteraction | ButtonInteraction){
      
      let message = `**--Equipped Passives--**\n\n`;

      if(player.passives.length == 0){
         message += `No Passives Equipped\n\n`;
      }
      else{
         for(let passive of player.passives){
            message += `**${passive.name}** - ${passive.description}\n`;
         }
         message += `\n`;
      }

      message += `- **Artifact:** None\n`;
      message += `- **Crystal:** None\n`;

      let embed = new EmbedBuilder()
      .setTitle(`${player.nickname} | Equipment`)
      .setDescription(message)
      .setColor(0x4974A5);

      let buttonList = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(SetPassives.button(),ReturnToMenu.button())

      player.menu.updateDisplay([embed],[buttonList],interaction);
   }

   static button(): ButtonBuilder {
      return new ButtonBuilder()
      .setCustomId(ButtonType.EquipMenu)
      .setLabel('Equip')
      .setStyle(ButtonStyle.Secondary);
    }
}    