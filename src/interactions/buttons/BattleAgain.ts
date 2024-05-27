import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  TextChannel,
} from "discord.js";
import { Globals } from "../../globals";
import { Monsters } from "../../models/monsters/Monsters";
import { Player } from "../../models/Player";
import { ButtonType } from "../ButtonType";
import { ButtonBase } from "../base/ButtonBase";
import { Combatant } from "../../models/Combatant";

export class BattleAgain extends ButtonBase {
  
  needsPlayerExistance: boolean = true;

  static button(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(ButtonType.BattleAgain)
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
      const location = Monsters.getLocationForLevel(player!.level);

      if (previousBattle && previousBattle.battleInProgress == false) {
        previousBattle.combatants = [];
        if (player!.partyID) {
          const party = globals.getPlayerParty(player!);
          if (party) {
            for (let partyMember of party.partyMembers) {
              previousBattle.combatants.push(partyMember);
            }
          }
        } else {
          previousBattle.combatants.push(player!);
        }

        const reply = await interaction.reply("Starting battle...");
        reply.delete();
        previousBattle.newBattle(
          location,
          Monsters.getMonstersForLocation(location)
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
