import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { Globals } from "../../../globals";
import { ButtonBase } from "../../base/ButtonBase";
import { Quest } from "../../../models/quests/Quest";
import { delay } from "../../../utils";

export abstract class QuestStartBase extends ButtonBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   async execute(interaction: ButtonInteraction, globals: Globals): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);

      if(player){

         if(player.quest || (player.party && player.party.partyMembers.findIndex(x => x.quest != undefined) > -1)){
            await interaction.reply({ephemeral: true, content: "Can not start a quest while in a battle or while already undertaking a quest"});
         }
         else if(player.party && player.party.partyLeader.userID != player.userID){
            await interaction.reply({ephemeral: true, content: "Only party leaders may start a quest."});
         }
         else{

            var quest = this.createQuest();
   
            if(player.party){
   
               if(player.party.getAverageLevel() >= quest.minimumLevel){

                  for(let partyMember of player!.party.partyMembers){
                     partyMember.quest = quest;
                  }
                  await interaction.update({fetchReply: false});
               }
               else{
                  await interaction.reply({ephemeral: true, content: `Party does not meed the minimum dungeon level of ${quest.minimumLevel}`});
                  return;
               }
            }
            else{
               if(player.level >= quest.minimumLevel){
                  player.quest = quest;
                  await interaction.update({fetchReply: false});
               }
               else{
                  await interaction.reply({ephemeral: true, content: `You hav not met the minimum level requirement for this dungeon of ${quest.minimumLevel}`});
                  return;
               }
            }

            if(player.menu){

               let embed = new EmbedBuilder()
               .setTitle(`Quests - ${quest.name}`)
               .setDescription("Starting quest...")
               .setColor(0x4974A5);

               await player.menu.updateDisplay([embed]);

               await delay(2000);

               quest.currentNode.showNode(player, globals);
            }
            else{
               await interaction.update({fetchReply: false});
            }
         }
      }
   }

   abstract createQuest(): Quest
}    