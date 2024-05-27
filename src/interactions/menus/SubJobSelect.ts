import { StringSelectMenuInteraction } from "discord.js";
import { Globals } from "../../globals";
import { SelectMenuBase } from "../base/SelectMenuBase";
import { JobName } from "../../models/enums/JobName";

export class SubJobSelect extends SelectMenuBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;
   
   onSelectionPerformed(interaction: StringSelectMenuInteraction, globals: Globals): Promise<any> {
      let player = globals.getPlayerById(interaction.user.id);
      if(player){
         player.changeSubJob(JobName[interaction.values[0] as keyof typeof JobName])
      }
      return interaction.reply({content: "Changed subjob to: " + interaction.values[0], ephemeral: true});
   }
   
}