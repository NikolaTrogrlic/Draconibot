import { ButtonInteraction, ButtonBuilder, ButtonStyle } from "discord.js";
import { Globals } from "../../../globals";
import { ButtonBase } from "../../base/ButtonBase";
import { ButtonName } from "../../ButtonName";

export class BackwardButton extends ButtonBase{

    needsPlayerExistance: boolean = true;
    canOnlyPerformOutsideBattle: boolean = true;
    canOnlyPerformOnOwnTurn: boolean = false;
 
    async execute(interaction: ButtonInteraction, globals: Globals): Promise<any> {
 
       const player = globals.getPlayerById(interaction.user.id);
 
       if(interaction.replied == false){
          interaction.update({fetchReply: false});
       }
       if(player?.quest && player.isMoving == false){

        player.isMoving = true;

        if(player.party && player.party.partyLeader.userID == player.userID){
            player.quest.goBack();
            await player.quest.currentNode.showNode(player,globals);
        }
        else if(player.party == undefined){
            player.quest.goBack();
            await player.quest.currentNode.showNode(player,globals);
        }

        player.isMoving = false;

       }
    }
 
    static button(): ButtonBuilder {
       return new ButtonBuilder()
       .setCustomId(ButtonName.Backward)
       .setLabel('Backward')
       .setStyle(ButtonStyle.Primary);
     }
 }  