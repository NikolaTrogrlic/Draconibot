import { ActionRowBuilder,  ButtonBuilder, ButtonInteraction, CommandInteraction, EmbedBuilder, SlashCommandBuilder, StringSelectMenuInteraction } from "discord.js";
import { Globals } from "../../globals";
import { CommandBase } from "../base/CommandBase";
import { Player } from "../../models/Player";
import { QuestsMenu } from "../buttons/QuestsMenu";
import { delay } from "../../utils";
import { JobsMenu } from "../buttons/jobButtons/JobsMenu";
import { EquipMenu } from "../buttons/equipButtons/EquipMenu";

export class PlayCommand extends CommandBase {
   
   needsPlayerExistance: boolean = false;
   canOnlyPerformOutsideBattle: boolean = true;

  getSlashCommand() {
    return new SlashCommandBuilder()
      .setName("play")
      .setDescription(
        "Opens up the main menu. Only available out of battle."
      );
  }

  async execute(interaction: CommandInteraction, globals: Globals): Promise<any> {
    let player = globals.getPlayerById(interaction.user.id);
    if(!player){
      player = new Player(interaction.user.displayName,interaction.user.id, interaction);
      const index = globals.players.findIndex((x) => x.userID == player!.userID);
      if (index == -1) {
         globals.players.push(player);
      } else {
         globals.players[index] = player;
      }
    }

    if(player.battleID){
      await interaction.reply({content: "Can't perform this action in battle", ephemeral: true})
    }
    else{
      if(interaction.replied == false){
         let response = await interaction.reply({content: "Opening menu..."});
         if(response){
            try{
               response.delete();
            }
            catch(err){
               console.log("Failed removing play command response");
            }
         }
       }
   
       await PlayCommand.generateMainMenu(player, interaction);
    }
  }

  static async generateMainMenu(player: Player, interaction: ButtonInteraction | CommandInteraction | StringSelectMenuInteraction){

   let embed = new EmbedBuilder()
   .setTitle(`${player.nickname} | Info`)
   .setDescription(`
   **Character Level**: ${player.level}
   **Exp**: ${player.exp} / ${player.requiredExpForLevel}
   **Job**: *${player.mainJob.name}/${player.subJob.name}*

   --Characteristics--
   **HEALTH**: ${player.stats.maxHP}
   **STRENGTH**: ${player.stats.strength}
   **MAGIC**: ${player.stats.magic}
   **SPEED**: ${player.stats.speed}
   **LUCK**: ${player.stats.luck}
   `)
   .setColor(0x4974A5);

   const buttonList = new ActionRowBuilder<ButtonBuilder>()
   .addComponents(QuestsMenu.button(),JobsMenu.button(),EquipMenu.button())

   if(interaction instanceof CommandInteraction){
      player.menu.deleteAndUpdate(interaction,[embed],[buttonList]);
   }
   else{
      player.menu.updateDisplay([embed],[buttonList],interaction);
   }
  }
}
