import { StringSelectMenuInteraction } from "discord.js";
import { Globals } from "../../globals";
import { SelectMenuBase } from "../base/SelectMenuBase";
import { JobName } from "../../models/enums/JobName";
import { JobsMenu } from "../buttons/jobButtons/JobsMenu";

export class SubJobSelect extends SelectMenuBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;
   
   async onSelectionPerformed(interaction: StringSelectMenuInteraction, globals: Globals): Promise<any> {
      let player = globals.getPlayerById(interaction.user.id);
      if(player){
         player.changeSubJob(JobName[interaction.values[0] as keyof typeof JobName])
         await JobsMenu.generateMenu(player, interaction);
      }
      else{
         interaction.update({fetchReply: false});
      }
   }
   
}