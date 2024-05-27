import { BaseInteraction, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Globals } from "../../globals";
import { CommandBase } from "../base/CommandBase";

export class InfoCommand extends CommandBase {
   
   needsPlayerExistance: boolean = true;

  getSlashCommand() {
    return new SlashCommandBuilder()
      .setName("info")
      .setDescription(
        "Displays info about the current player."
      );
  }

  async execute(interaction: CommandInteraction, globals: Globals): Promise<any> {
    let player = globals.getPlayerById(interaction.user.id);
    if(player){
      let embed = new EmbedBuilder()
            .setTitle(player.nickname)
            .setDescription(`
            - Level: ${player.level} / 50\n - Exp: ${player.exp} / 100\n- Main Job: ${player.mainJob.name} [Level: ${player.mainJob.level}]\n - Sub Job: ${player.subJob.name} [Level: ${player.subJob.level}]\n\n --Characteristics--\n- **HEALTH**: ${player.stats.maxHP}/${player.stats.HP}\n- **STRENGTH**: ${player.stats.strength}\n- **MAGIC**: ${player.stats.magic}\n- **SPEED**: ${player.stats.speed}\n- **LUCK**: ${player.stats.luck}`);

      await interaction.reply({embeds: [embed]});
    }
    else{
      await interaction.reply(`Error`);
    }
  }
}
