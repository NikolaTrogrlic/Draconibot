import { StringSelectMenuInteraction } from "discord.js";
import { Globals } from "../../globals";
import { SelectMenuBase } from "../base/SelectMenuBase";

export class SubJobSelect extends SelectMenuBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;
   
   onSelectionPerformed(interaction: StringSelectMenuInteraction, globals: Globals): Promise<any> {
      return interaction.reply("Nice");
   }
   
}