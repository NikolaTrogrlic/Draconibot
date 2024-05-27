
import { Party } from "./models/Party";
import { Player } from "./models/Player";
import { Battle } from "./models/battle/Battle";

export class Globals{

    players: Player[] = [];
    parties: Party[] = [];
    partyInvites: PartyInvite[] = [];
    battles: Battle[] = [];

    getPlayerById(id: string){
        return this.players.find(x => x.userID == id);
    }

    getPlayerParty(player: Player){
        if(player.partyID){
            return this.parties.find(x => x.id == player.partyID);
        }
        else{
            return undefined;
        }
    }

    getPlayerBattle(player: Player){
        if(player.battleID){
            return this.battles.find(x => x.id == player.battleID)
        }
        else{
            return undefined;
        }
    }

    

    removeStaleBattles(){
        const staleBattles = this.battles.filter(x => x.combatants.length == 0);
        for(const battle of staleBattles){
            const index = this.battles.indexOf(battle, 0);
            if (index > -1) {
                this.battles.splice(index, 1);
            }
        }
    }

    removeStaleParties(){
        const staleParties = this.parties.filter(x => x.partyMembers.length == 0);
        for(const party of staleParties){
            const index = this.parties.indexOf(party, 0);
            if (index > -1) {
                this.parties.splice(index, 1);
            }
        }
    }
}

export class PartyInvite{

    invitedUserID: string;
    partyID: string;
    inviteInteractionID: string;

    constructor(userID: string, partyID: string, inviteInteractionID: string){
        this.invitedUserID = userID;
        this.partyID = partyID;
        this.inviteInteractionID = inviteInteractionID
    }
}