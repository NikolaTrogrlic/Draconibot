import { SlashCommandBuilder, TextChannel } from "discord.js";
import { Globals } from "../../globals";
import { CommandBase } from "../base/CommandBase";
import { createMonsters, getLocationForLevel, getRandomEncounterMonsterCount } from "../../models/monsters/Monsters";
import { Battle } from "../../models/battle/Battle";

export enum BattleOptions {
  Start = "start",
}

export class BattleCommand extends CommandBase {
   
  needsPlayerExistance: boolean = true;
  canOnlyPerformOutsideBattle: boolean = true;

  getSlashCommand(): any {
    return new SlashCommandBuilder()
      .setName("battle")
      .setDescription("Perform different battle actions.")
      .addSubcommand((option) =>
        option
          .setName(BattleOptions.Start)
          .setDescription("Starts a new battle")
      );
  }

  async execute(interaction: any, globals: Globals): Promise<any> {
    const player = globals.getPlayerById(interaction.user.id);

    if (interaction.channel && interaction.channel instanceof TextChannel) {
      const reply = await interaction.reply("Starting battle...");
      setTimeout(() => reply.delete(), 3000);
      let location = getLocationForLevel(player!.level);

      if (player!.partyID) {
        const party = globals.getPlayerParty(player!);
        if (party) {
          const battle = new Battle(
            interaction.channel,
            location,
            ...party.partyMembers,
            ...createMonsters(location, getRandomEncounterMonsterCount(party.partyMembers.length))
          );
          globals.battles.push(battle);
        }
      } else {
        const battle = new Battle(
          interaction.channel,
          location,
          player!,
          ...createMonsters(location, getRandomEncounterMonsterCount(1))
        );
        globals.battles.push(battle);
      }
    }
  }
}
