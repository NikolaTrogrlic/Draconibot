import { config } from "./config";
import { deployCommands } from "./deployment/deploy-commands";
import { BaseInteraction, Client, GatewayIntentBits } from "discord.js";
import { Globals } from "./globals";
import {
  IGameInteraction,
  canPerformInteraction,
  isGameInteraction,
} from "./interactions/base/IGameInteraction";
import { buttons, commands, menus, skillButton, targetButton } from "./interactions/InteractionList";
import { TargetButton } from "./interactions/buttons/TargetButton";
import { ButtonActionInfo } from "./interactions/base/ButtonActionInfo";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
const globals: Globals = new Globals();

client.once("ready", () => {
  console.log("Discord bot is ready! 🤖");
  //deployCommands();
});

client.on("guildCreate", async () => {
  await deployCommands();
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isCommand()) {
      const command = commands[interaction.commandName];
      if (command) {
        if (isGameInteraction(command)) {
          if (await canPerformInteraction(command, interaction, globals)) {
            command.execute(interaction, globals);
          }
			 return;
        } 
      }
    }
	 else if(interaction.isButton()){
      const actionInfo = ButtonActionInfo.getButtonActionName(
        interaction.customId
      );

      if (actionInfo.targetNumber != -1) {
			if (await canPerformInteraction(targetButton, interaction, globals)) {
            targetButton.execute(interaction, globals, actionInfo.targetNumber);
         }
			return;
      }
		else if(actionInfo.isSkill){
			if (await canPerformInteraction(skillButton, interaction, globals)) {
            skillButton.execute(interaction, globals, actionInfo.key);
         }
			return;
		}
		else{
			const button = buttons[actionInfo.key];
			if (await canPerformInteraction(button, interaction, globals)) {
            button.execute(interaction, globals, actionInfo.previousInteractionID);
         }
			return;
      }
    } else if (interaction.isStringSelectMenu()) {
      menus[interaction.customId].onSelectionPerformed(interaction, globals);
    } else {
      await interaction.channel?.send({ content: "Error." });
      return;
    }
  } catch (e) {
    await interaction.channel?.send({ content: "Error." });
    console.log(e);
  }
});

client.login(config.DISCORD_TOKEN);
