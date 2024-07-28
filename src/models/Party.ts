import { createID } from "../utils";
import { Player } from "./Player";

export class Party{
    
    id: string;
    partyLeader: Player;
    partyMembers: Player[] = [];
    isBattling: boolean = false;

    constructor(partyLeader: Player,...players: Player[]){
        this.id = createID();
        this.partyLeader = partyLeader;
        if(players){
            this.partyMembers = players;
        }
        else{
            this.partyMembers = [];
        }
        if(this.partyMembers.findIndex(x => x.userID == partyLeader.userID) == -1){
            this.partyMembers.push(this.partyLeader);
        }

        this.partyMembers.forEach(player => {
            player.party = this;
        });
    }

    getAverageLevel(): number{
        let sum = 0;
        this.partyMembers.forEach(x => sum += x.level)
        return Math.round(sum / this.partyMembers.length);
    }

    removeFromParty(player: Player): boolean{

        const removeIndex = this.partyMembers.findIndex(x => x.userID == player.userID);

        if(removeIndex > -1){
           
            this.partyMembers.splice(removeIndex,1)
            player.party = undefined;

            if(this.partyLeader.userID == player.userID){
                if(this.partyMembers.length > 0){
                    this.partyLeader = this.partyMembers[0];
                }
            }

            return true;
        }

        return false;
    }
}