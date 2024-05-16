import { commands } from "./commands";
import { config } from "./config";
import { deployCommands } from "./deployment/deploy-commands";
import { Client, GatewayIntentBits } from 'discord.js';
import { Globals } from "./globals";
import { buttons } from "./buttons";
import { ButtonActionInfo } from "./buttons/ButtonBase";
import { SkillButton } from "./buttons/SkillButton";
import { TargetButton } from "./buttons/TargetButton";

const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages] });
const globals: Globals = new Globals();

client.once("ready", () => {
	console.log("Discord bot is ready! 🤖");
	deployCommands();
})

client.on("guildCreate", async () => {
	await deployCommands();
});

client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		const { commandName } = interaction;
		if (commands[commandName as keyof typeof commands]) {
		  commands[commandName as keyof typeof commands].execute(interaction,globals);
		}
	}
	else if(interaction.isButton()){
		const actionInfo = ButtonActionInfo.getButtonActionName(interaction.customId);

		if(actionInfo.targetNumber != -1){
			TargetButton.execute(interaction, globals, actionInfo.targetNumber);
		}
		else if(actionInfo.isSkill == false){

			const button = buttons.find(x => x.key == actionInfo.key);
			if(button){
	
				button.execute(interaction,globals,actionInfo.previousInteractionID);
			}
			else{
	
				interaction.reply({content: "Button interaction not found.", ephemeral: true});
			}
		}
		else{
			SkillButton.execute(interaction,globals, actionInfo.key);
		}
	}
	else{
		return;
	}
});

client.login(config.DISCORD_TOKEN);
