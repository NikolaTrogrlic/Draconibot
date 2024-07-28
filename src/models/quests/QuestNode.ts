import { ButtonBuilder, EmbedBuilder } from "discord.js";
import { MenuHandler } from "../MenuHandler";
import { Player } from "../Player";
import { Globals } from "../../globals";
import { ForwardButton } from "../../interactions/buttons/directionButtons/ForwardButton";
import { BackwardButton } from "../../interactions/buttons/directionButtons/BackwardButton";

export enum QuestNodeType{
    Battle,
    Job,
    Choice,
    Treasure,
    Completion
};


export abstract class QuestNode{

    type: QuestNodeType;
    leftNode?: QuestNode;
    rightNode?: QuestNode;
    forwardNode?: QuestNode;
    previousNode?: QuestNode;
    
    constructor(type: QuestNodeType){
        this.type = type;
    }

    setLeft(node: QuestNode): QuestNode{
        this.leftNode = node;
        node.previousNode = this;
        return node;
    }


    setRight(node: QuestNode): QuestNode{
        this.rightNode = node;
        node.previousNode = this;
        return node;
    }

    setForward(node: QuestNode): QuestNode{
        this.forwardNode = node;
        node.previousNode = this;
        return node;
    }

    abstract showNode(player: Player, globals: Globals | undefined): Promise<any>

    getMovementButtons(): ButtonBuilder[]
    {
        let movementButtons: ButtonBuilder[] = [];

        if(this.leftNode){
            //GET LEFT BUTTON
        }

        if(this.rightNode){
            //GET RIGHT NODE
        }

        if(this.forwardNode){
            movementButtons.push(ForwardButton.button());
        }

        if(this.previousNode){
            movementButtons.push(BackwardButton.button());
        }

        return movementButtons;
    }
}