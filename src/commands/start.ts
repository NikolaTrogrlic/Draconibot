import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Player } from "../models/Player";
import { Globals } from "../globals";

export const data = new SlashCommandBuilder()
  .setName("start")
  .setDescription("Starts a new game. Warning: This will delete your previous character data.");

export async function execute(interaction: CommandInteraction, globals: Globals) {
  const player = new Player(interaction.user.displayName, interaction.user.id);


  const index = globals.players.findIndex(x => x.userID == player.userID);
  if(index == -1){
    globals.players.push(player);
  }
  else{
    globals.players[index] = player;
  }

  return interaction.reply(`Welcome to Draconica, ${interaction.user.displayName}. Current players: ${globals.players.length}`);
}