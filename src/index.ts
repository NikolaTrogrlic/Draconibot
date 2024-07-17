import { config } from "./config";
import { deployCommands } from "./deployment/deploy-commands";
import { Client, GatewayIntentBits } from "discord.js";
import { Globals } from "./globals"; 
import { IGameInteraction, canPerformInteraction} from "./interactions/base/IGameInteraction";
import { buttons, commands, menus, skillButton, targetButton } from "./interactions/InteractionList";
import { ButtonActionInfo, ButtonType } from "./interactions/base/ButtonActionInfo";

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

    let gameInteraction: IGameInteraction | undefined = undefined;
    let extraData = "";

    if(interaction.isCommand())
    {
      gameInteraction = commands[interaction.commandName];
    }
    else if(interaction.isButton())
    {
      let buttonInfo = ButtonActionInfo.getButtonInfo(interaction.customId);
      if(buttonInfo){
        extraData = buttonInfo.extraData;
        switch(buttonInfo.type){
          case ButtonType.GeneralButton:
            {
              gameInteraction = buttons[buttonInfo.key];
              break;
            }
          case ButtonType.TargetingButton:
            {
              gameInteraction = targetButton;
              break;
            }
          case ButtonType.SkillButton:
            {
              gameInteraction = skillButton;
              break;
            }
        }
      }
    }
    else if(interaction.isStringSelectMenu())
    {
      gameInteraction = menus[interaction.customId];
    }
    else{
      await interaction.channel?.send({ content: "Error." });
      return;
    }

    if(gameInteraction && await canPerformInteraction(gameInteraction, interaction, globals))
    {
      gameInteraction.execute(interaction,globals,extraData);
    }

  }
  catch (e)
  {
    await interaction.channel?.send({ content: "Unspecified error occured." });
    console.log(e);
  }
});

client.login(config.DISCORD_TOKEN);
