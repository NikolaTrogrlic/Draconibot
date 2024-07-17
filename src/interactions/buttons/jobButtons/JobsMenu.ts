import { ButtonInteraction, StringSelectMenuInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Globals } from "../../../globals";
import { Player } from "../../../models/Player";
import { Jobs } from "../../../models/jobs/Jobs";
import { ButtonName } from "../../ButtonName";
import { ButtonBase } from "../../base/ButtonBase";
import { ReturnToMenu } from "../ReturnToMenu";
import { SetJob } from "./SetJob";
import { SetSubjob } from "./SetSubjob";
import { SkillList } from "./SkillList";


export class JobsMenu extends ButtonBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   async execute(interaction: ButtonInteraction, globals: Globals): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);

      if(player){
         await JobsMenu.generateMenu(player, interaction);
      }
   }

   static async generateMenu(player: Player, interaction: StringSelectMenuInteraction | ButtonInteraction){
      let jobs = Jobs.getJobsForLevel(player.level);
      let message = `**Main:** ${player.mainJob.name}
      **Sub:** ${player.subJob.name}\n\n- **Available Jobs**\n`;
      for(let job of jobs){
         message += ` - ${job.name}\n`;
      }

      let embed = new EmbedBuilder()
      .setTitle(`${player.nickname} | Jobs`)
      .setDescription(message)
      .setColor(0x4974A5);

      let buttonList = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(SetJob.button(),SetSubjob.button(),SkillList.button(),ReturnToMenu.button())

      player.menu.updateDisplay([embed],[buttonList],interaction);
   }

   static button(): ButtonBuilder {
      return new ButtonBuilder()
      .setCustomId(ButtonName.JobsMenu)
      .setLabel('Jobs')
      .setStyle(ButtonStyle.Secondary);
    }
}    