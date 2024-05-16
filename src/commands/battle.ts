import { CommandInteraction, SlashCommandBuilder, TextBasedChannelMixin, TextChannel } from "discord.js";
import { Globals } from "../globals";
import { Player } from "../models/Player";
import { Battle } from "../models/Battle";
import { Monsters } from "../models/monsters/Monsters";
import { Monster } from "../models/monsters/Monster";
import { randomNumberFromOneTo} from "../utils";

export function makeMonsters(): Monster[]{
    const monsters: Monster[] = [];
    for(let i = 0; i < randomNumberFromOneTo(3);i++){
        monsters.push(Monsters.createPlainsMonster());
    }

    return monsters;
}

export enum BattleOptions{
    Start = "start"
}

export const data = new SlashCommandBuilder()
  .setName("battle")
  .setDescription("Perform different battle actions.")
  .addSubcommand(option =>
    option.setName(BattleOptions.Start)
    .setDescription('Starts a new battle')
  )

  export async function execute(interaction: CommandInteraction, globals: Globals) {
    
    const player = globals.getPlayerById(interaction.user.id);
  
    if(player){
        if(interaction.channel && (interaction.channel instanceof TextChannel)){
            await interaction.reply("Starting battle...");
            let location = Monsters.getLocationForLevel(player.level);
            
            if(player.partyID){
                const party = globals.getPlayerParty(player);
                if(party){
                    const battle = new Battle(interaction.channel, location, ...party.partyMembers, ...Monsters.getMonstersForLocation(location)  );
                    battle.battleStart();
                    globals.battles.push(battle)
                }
            }
            else{
                const battle = new Battle(interaction.channel, location, player, ...Monsters.getMonstersForLocation(location)  );
                battle.battleStart();
                globals.battles.push(battle);
            }
        }
        else{
            console.log(typeof interaction.channel);
        }
    }
    else{
        return interaction.reply("Please start the game first using /start");
    }
  }