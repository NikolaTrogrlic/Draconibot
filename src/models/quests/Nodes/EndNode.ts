import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Player } from "../../Player";
import { QuestNode, QuestNodeType } from "../QuestNode";
import { Globals } from "../../../globals";
import { ReturnToMenu } from "../../../interactions/buttons/ReturnToMenu";

export class EndNode extends QuestNode{
    
    exp: number;
    jobexp: number;

    constructor(exp:number, jobexp: number){
        super(QuestNodeType.Completion)
        this.exp = exp;
        this.jobexp = jobexp;
    }

    async showNode(player: Player, globals: Globals | undefined): Promise<any> {

        if(player.quest){

            let expMessage = " ";

            if(player.party){
                for(let partyMember of player.party.partyMembers){
                    expMessage += partyMember.giveExp(this.exp, this.jobexp) + "\n";

                    partyMember.quest = undefined;
                }
            }
            else{
                expMessage = player.giveExp(this.exp,this.jobexp);
                player.quest = undefined;
            }

            let embed = new EmbedBuilder()
            .setColor(0xDC143C)
            .setDescription(`Quest complete ! \n${expMessage}`);

            let buttonList = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(ReturnToMenu.button())

            await player.menu.updateDisplay([embed], [buttonList]);
        }
    }
}