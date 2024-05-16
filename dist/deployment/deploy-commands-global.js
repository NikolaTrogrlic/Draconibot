"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCommands = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const commands_1 = require("../commands");
const commandsData = Object.values(commands_1.commands).map((command) => command.data);
const rest = new discord_js_1.REST({ version: "10" }).setToken(config_1.config.DISCORD_TOKEN);
async function deployCommands() {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(discord_js_1.Routes.applicationCommands(config_1.config.DISCORD_CLIENT_ID), {
            body: commandsData,
        });
        console.log("Successfully reloaded application (/) commands.");
    }
    catch (error) {
        console.error(error);
    }
}
exports.deployCommands = deployCommands;
