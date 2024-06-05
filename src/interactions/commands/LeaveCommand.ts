import { ActionRowBuilder,  ButtonBuilder, ButtonInteraction, CommandInteraction, EmbedBuilder, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { Globals } from "../../globals";
import { CommandBase } from "../base/CommandBase";

export class LeaveCommand extends CommandBase {
   
   needsPlayerExistance: boolean = true;

  getSlashCommand() {
    return new SlashCommandBuilder()
      .setName("leave")
      .setDescription(
        "Forcefully leaves battle and party. 5 minute cooldown. Use when stuck."
      );
  }

  async execute(interaction: CommandInteraction, globals: Globals): Promise<any> {
    let player = globals.getPlayerById(interaction.user.id);
    if(player && player.battleID){
      if(new Date().getTime() >= (player.lastLeaveCommandUse.getTime() + (1000 * 60 * 5))){
         player.lastLeaveCommandUse = new Date();
         let battle = globals.getPlayerBattle(player);
         if(battle){
            if(battle.currentAction == player){
               player.isDefeated = true;
               player.isFleeing = true;
               battle.nextAction();
               if(player.partyID){
                  let party = globals.getPlayerParty(player);
                  if(party){
                     const removeIndex = party.partyMembers.findIndex(x => x.userID == player.userID);
                     if(removeIndex > -1){
                        party.partyMembers.splice(removeIndex,1)
                        player.partyID = undefined;

                        if(party.partyLeader.userID == player.userID){
                            if(party.partyMembers.length > 0){
                              party.partyLeader = party.partyMembers[0];
                            }
                        }
                    }
                  }
               }

               await interaction.reply(`${player.nickname} forcefully left combat.`);
            }
         }
      }
      else{
      await interaction.reply(`Command is still on cooldown. Please wait: ${Math.round(((player.lastLeaveCommandUse.getTime() + (1000 * 60 * 5))- new Date().getTime()) / 1000)}s`);
      }
    }
    else{
      await interaction.reply("May only be performed while in battle.");
    }

  }
}
