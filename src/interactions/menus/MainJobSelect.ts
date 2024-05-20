import {  StringSelectMenuInteraction } from "discord.js";
import { Globals } from "../../globals";
import { SelectMenuBase } from "../base/SelectMenuBase";

export class MainJobSelect extends SelectMenuBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   onSelectionPerformed(interaction: StringSelectMenuInteraction, globals: Globals): Promise<any> {
      console.log(interaction);
      return interaction.reply("Nice");
   }
   
}