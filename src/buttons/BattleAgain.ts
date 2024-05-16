import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
  TextChannel,
} from "discord.js";
import { Globals } from "../globals";
import { ButtonBase, ButtonKey } from "./ButtonBase";
import { Battle } from "../models/Battle";
import { Monsters } from "../models/monsters/Monsters";
import { Player } from "../models/Player";

export class BattleAgain extends ButtonBase {
  static button(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(ButtonKey.BattleAgain)
      .setLabel("Battle Again")
      .setStyle(ButtonStyle.Success);
  }

  constructor() {
    super(ButtonKey.BattleAgain);
  }

  async execute(
    interaction: ButtonInteraction<CacheType>,
    globals: Globals,
    originInteractionID: string
  ): Promise<any> {
    const player = globals.getPlayerById(interaction.user.id);

    if (player && player.battleID) {
      const previousBattle = globals.getPlayerBattle(player);
      const location = Monsters.getLocationForLevel(player.level);

      if (previousBattle && previousBattle.battleInProgress == false) {
      
         if(player.partyID){
            const party = globals.getPlayerParty(player);
            if(party){
               for(let partyMember of party.partyMembers){
                  let index = previousBattle.combatants.findIndex(x => x instanceof Player && x.userID == partyMember.userID);
                  if(index == -1){
                     previousBattle.combatants.push(partyMember);
                  }
               }
            }
         }

        await interaction.reply("Starting battle...");
        previousBattle.startSecondBattle(
          location,
          Monsters.getMonstersForLocation(location)
        );
      } else {
        return interaction.reply("Your party needs to be in a battle");
      }
    } else {
      return interaction.reply("Must be in a battle first.");
    }
  }
}
