import { EmbedBuilder } from "discord.js";
import { Player } from "../Player";
import { QuestNode } from "./QuestNode";

export class Quest{

    name: string;
    minimumLevel: number;
    recommendedLevel: number;
    recommendedCharacters: number = 1;
    currentNode: QuestNode;

    constructor(name: string, minLevel: number, recLevel: number, startNode: QuestNode){
        this.name = name;
        this.minimumLevel = minLevel;
        this.recommendedLevel = recLevel;
        this.currentNode = startNode;
    }

    goLeft(){
        if(this.currentNode.leftNode){
            this.currentNode = this.currentNode.leftNode;
        }
    }

    goForward(){
        if(this.currentNode.forwardNode){
            this.currentNode = this.currentNode.forwardNode;
        }
    }

    goRight(){
        if(this.currentNode.rightNode){
            this.currentNode = this.currentNode.rightNode;
        }
    }

    goBack(){
        if(this.currentNode.previousNode){
            this.currentNode = this.currentNode.previousNode;
        }
    }

    kickOutOfDungeon(players: Player[]){
        for(var player of players){
            player.battleID = undefined;
            player.quest = undefined;

            let embed = new EmbedBuilder()
            .setColor(0xDC143C)
            .setDescription("Exiting dungeon...");

            player.menu.updateDisplay([embed])
        }
    }
}