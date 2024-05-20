import {
  ActionRowBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Globals } from "../../globals";
import { CommandBase } from "../base/CommandBase";
import { Player } from "../../models/Player";
import { SelectMenuType } from "../SelectMenuType";

enum JobOptions {
  List = "list",
  Set = "set",
  Skills = "skills",
}

export class JobCommand extends CommandBase {

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   
  getSlashCommand() {
    return new SlashCommandBuilder()
      .setName("job")
      .setDescription("Perform different battle actions.")
      .addSubcommand((option) =>
        option.setName(JobOptions.List).setDescription("Lists all jobs.")
      )
      .addSubcommand((option) =>
        option
          .setName(JobOptions.Set)
          .setDescription("Allows you to pick a job from a list.")
      );
  }

  async execute(interaction: any, globals: Globals): Promise<any> {
    var subcommand = interaction.options.getSubcommand();
    const player = globals.getPlayerById(interaction.user.id);
    if(player){
      switch (subcommand) {
         case JobOptions.List: {
           break;
         }
         case JobOptions.Set: {
           this.setJob(interaction, player);
           break;
         }
       }
    }
  }

  async setJob(interaction: any, player: Player) {
    let jobSelect: StringSelectMenuOptionBuilder[] = [];
    for (let job of player.jobs) {
      jobSelect.push(
        new StringSelectMenuOptionBuilder()
          .setLabel(`${job.name} [Level: ${job.level} | Exp: ${job.exp}]`)
          .setValue(job.name)
      );
    }

    const select = new StringSelectMenuBuilder()
      .setCustomId(SelectMenuType.SetMainJobMenu)
      .setPlaceholder("Select a main job to change to.")
      .addOptions(jobSelect);

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({
      components: [row],
      ephemeral: true,
    });
  }
}
