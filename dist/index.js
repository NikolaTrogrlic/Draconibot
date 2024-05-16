"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
const config_1 = require("./config");
const deploy_commands_1 = require("./deployment/deploy-commands");
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages] });
client.once("ready", () => {
    console.log("Discord bot is ready! 🤖");
});
client.on("guildCreate", async () => {
    await (0, deploy_commands_1.deployCommands)();
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands_1.commands[commandName]) {
        commands_1.commands[commandName].execute(interaction);
    }
});
client.login(config_1.config.DISCORD_TOKEN);
