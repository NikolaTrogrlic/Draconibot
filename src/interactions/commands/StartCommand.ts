import { SlashCommandBuilder } from "discord.js";
import { Globals } from "../../globals";
import { CommandBase } from "../base/CommandBase";
import { Player } from "../../models/Player";

export class StartCommand extends CommandBase {
   
   needsPlayerExistance: boolean = false;

  getSlashCommand() {
    return new SlashCommandBuilder()
      .setName("start")
      .setDescription(
        "Starts a new game. Warning: This will delete your previous character data."
      );
  }

  execute(interaction: any, globals: Globals): Promise<any> {
    const player = new Player(
      interaction.user.displayName,
      interaction.user.id
    );
    const index = globals.players.findIndex((x) => x.userID == player.userID);
    if (index == -1) {
      globals.players.push(player);
    } else {
      globals.players[index] = player;
    }

    return interaction.reply(
      `Welcome to Draconica, ${interaction.user.displayName}. Current players: ${globals.players.length}`
    );
  }
}
