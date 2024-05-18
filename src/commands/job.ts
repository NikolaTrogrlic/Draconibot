import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Globals } from "../globals";

enum JobOptions{
   List = "list",
   Set = "set",
   Skills = "skills"
}

export const data = new SlashCommandBuilder()
  .setName("job")
  .setDescription("Perform different battle actions.")
  .addSubcommand(option =>
    option.setName(JobOptions.List)
    .setDescription('Lists all currently unlocked jobs.')
  )
  .addSubcommand(option =>
   option.setName(JobOptions.Set)
   .setDescription('Set current job and subjob'))
 

export async function execute(interaction: CommandInteraction, globals: Globals) 
{

   return interaction.reply(``);
}