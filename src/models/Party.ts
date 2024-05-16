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
            player.partyID = this.id;
        });
    }

    removeFromParty(player: Player, removerID: string | undefined){
        if(removerID && this.partyLeader.userID !== removerID){
            return "Must be party leader to remove from party";
        }

        if(this.partyLeader.battleID){
            return "Can not kick people while in a battle or a battle thread.";
        }

        const removeIndex = this.partyMembers.findIndex(x => x.userID == player.userID);
        if(removeIndex > -1){
            let result = `Removed ${player.name} from party.`;
            if(removerID && player.userID == removerID){
                result = `${player.name} left the party.`;
            }
            this.partyMembers.splice(removeIndex,1)
            player.partyID = undefined;

            if(this.partyLeader.userID == player.partyID){
                if(this.partyMembers.length > 0){
                    this.partyLeader = this.partyMembers[0];
                    result += ` Changed party leader to ${this.partyLeader.name}`;
                }
                else{
                    result += `Party disbanded.`;
                }
            }

            return result;
        }
        else{
            return `Tried kicking ${player.name}, but they were not found in the party.`
        }
    }
}