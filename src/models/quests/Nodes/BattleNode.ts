import { EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Battle } from "../../battle/Battle";
import { CombatLocation } from "../../enums/Location";
import { createMonsters, getRandomEncounterMonsterCount } from "../../monsters/Monsters";
import { Player } from "../../Player";
import { QuestNode, QuestNodeType } from "../QuestNode";
import { Globals } from "../../../globals";

export class BattleNode extends QuestNode{
    
    location: CombatLocation;
    battleFinished: boolean = false;
    battleCreated: boolean = false;
    postBattleDescription: string;

    constructor(location: CombatLocation, postBattleDescription: string){
        super(QuestNodeType.Battle)
        this.location = location;
        this.postBattleDescription = postBattleDescription;
    }

    startEncounter(initiator: Player, ...players: Player[]): Battle{

        return new Battle(
            initiator, 
            this.location,
            ...createMonsters(this.location, getRandomEncounterMonsterCount(players.length)),
            ...players);
    }

    async showNode(player: Player, globals: Globals | undefined): Promise<any> {

        let embed = new EmbedBuilder()
         .setColor(0xDC143C);

        if(this.battleFinished){
            embed.setDescription(this.postBattleDescription);

            let buttonList = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.getMovementButtons())

            await player.menu.updateDisplay([embed],[buttonList])
        }
        else if(globals && this.battleCreated == false){
            
            this.battleCreated = true;
            
            if(player.party?.partyMembers){
                globals.battles.push(this.startEncounter(player, ...player.party.partyMembers));
            }
            else{
                globals.battles.push(this.startEncounter(player, player));
            }
        }
    }
}