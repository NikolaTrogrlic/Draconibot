import { REST, Routes } from "discord.js";
import { config } from "../config";
import { commands } from "../interactions/InteractionList";

const commandsData = Object.values(commands).map((command) => command.getSlashCommand());

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

export async function deployCommands() {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.DISCORD_TEST_GUILD_ID),
      {
        body: commandsData,
      }
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

