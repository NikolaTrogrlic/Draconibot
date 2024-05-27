import {  StringSelectMenuInteraction } from "discord.js";
import { Globals } from "../../globals";
import { SelectMenuBase } from "../base/SelectMenuBase";
import { JobName } from "../../models/enums/JobName";

export class MainJobSelect extends SelectMenuBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   onSelectionPerformed(interaction: StringSelectMenuInteraction, globals: Globals): Promise<any> {
      let player = globals.getPlayerById(interaction.user.id);
      if(player){
         player.changeMainJob(JobName[interaction.values[0] as keyof typeof JobName])
      }
      return interaction.reply({content: "Changed job to: " + interaction.values[0], ephemeral: true});
   }
   
}