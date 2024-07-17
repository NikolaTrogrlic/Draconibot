import { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";
import { Globals } from "../../globals";
import { ButtonName } from "../ButtonName";
import { ButtonBase } from "../base/ButtonBase";
import { Battle } from "../../models/battle/Battle";
import { getLocationForLevel, createMonsters, getRandomEncounterMonsterCount } from "../../models/monsters/Monsters";

export class AdventureButton extends ButtonBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   async execute(interaction: ButtonInteraction, globals: Globals): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);

      if(interaction.replied == false){
         interaction.update({fetchReply: false});
      }

      if(player?.menu){
         let location = getLocationForLevel(player.level);
            if (player.partyID) {
              const party = globals.getPlayerParty(player!);
              if (party) {
                const battle = new Battle(player,location,
                  ...party.partyMembers,
                  ...createMonsters(location, getRandomEncounterMonsterCount(party.partyMembers.length))
                );
                globals.battles.push(battle);
              }
            } else {
              const battle = new Battle(
                player,
                location,
                player!,
                ...createMonsters(location, getRandomEncounterMonsterCount(1))
              );
              globals.battles.push(battle);
            }
      }
   }

   static button(): ButtonBuilder {
      return new ButtonBuilder()
      .setCustomId(ButtonName.Adventure)
      .setLabel('Adventure')
      .setStyle(ButtonStyle.Secondary);
    }
}  