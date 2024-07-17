import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  TextChannel,
} from "discord.js";
import { Globals } from "../../globals";
import { createMonsters, getLocationForLevel, getRandomEncounterMonsterCount } from "../../models/monsters/Monsters";
import { ButtonName } from "../ButtonName";
import { ButtonBase } from "../base/ButtonBase";

export class BattleAgain extends ButtonBase {
  
  needsPlayerExistance: boolean = true;

  static button(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(ButtonName.BattleAgain)
      .setLabel("Battle Again")
      .setStyle(ButtonStyle.Success);
  }

  async execute(
    interaction: ButtonInteraction<CacheType>,
    globals: Globals,
    originInteractionID: string
  ): Promise<any> {
    const player = globals.getPlayerById(interaction.user.id);

    if (player!.battleID) {
      const previousBattle = globals.getPlayerBattle(player!);
      const location = getLocationForLevel(player!.level);

      if (previousBattle && previousBattle.battleInProgress == false) {
        let combatants = [];
        if (player!.partyID) {
          const party = globals.getPlayerParty(player!);
          if (party) {
            for (let partyMember of party.partyMembers) {
              combatants.push(partyMember);
            }
          }
        } else {
          combatants.push(player!);
        }

        const reply = await interaction.reply("Starting battle...");
        reply.delete();

        combatants.push(...createMonsters(location, getRandomEncounterMonsterCount(combatants.length)));

        previousBattle.newBattle(
          location,
          combatants
        );
        
      } else {
        const reply = await interaction.reply(
          "Your party needs to be in a battle"
        );
        setTimeout(() => reply.delete(), 3000);
      }
    } else {
      const reply = await interaction.reply("Must be in a battle first.");
      setTimeout(() => reply.delete(), 3000);
    }
  }
}
