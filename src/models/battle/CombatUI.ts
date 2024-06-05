import {
   ActionRowBuilder,
  ButtonBuilder,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import { CombatMessage } from "./CombatMessage";
import { Monster } from "../monsters/Monster";
import { Player } from "../Player";
import { MenuHandler } from "../MenuHandler";

export class CombatUI {

  UI: MenuHandler;
  title: string = "";
  messages: CombatMessage[] = [];
  color: ColorResolvable = 0x884dff;
  location: string = "Battle.";
  maximumMessageCount = 5;
  messageDisplayDuration: number = 1500;
  isShowingMessagesOneByOne: boolean = false;
  isAnimatingFirstRow: boolean = false;

  constructor(handler: MenuHandler) {
    this.UI = handler;
  }

  clearDisplayData() {
    this.title = "";
    this.messages = [];
    this.color = 0x884dff;
    this.messageDisplayDuration = 1500;
    this.isShowingMessagesOneByOne = false;
    this.isAnimatingFirstRow = true;
  }

  addMessage(...messages: CombatMessage[]) {
    this.messages.push(...messages);
  }

  getTurnDisplay(monsters: Monster[], players: Player[], messages: CombatMessage[] = this.messages): EmbedBuilder {
    let description = "";
    for (let i = 0; i < this.maximumMessageCount; i++) {
      if (i < messages.length) {
        description += messages[i].message + "\n";
      } else {
        description += "\u200B\n";
      }
    }

    let embed = new EmbedBuilder()
      .setTitle(this.title)
      .setDescription(description)
      .setColor(this.color);

    for (let partyMember of players) {
      embed.addFields({
        name: `${partyMember.nickname}`,
        value: `${partyMember.stats.HP}/${partyMember.stats.maxHP} HP`,
        inline: true,
      });
    }

    embed.addFields({ name: " ", value: " " });

    for (let monster of monsters) {
      if (monster.stats.HP > 0) {
        embed.addFields({
          name: `${monster.nickname}`,
          value: `${monster.stats.HP}/${monster.stats.maxHP} HP`,
          inline: true,
        });
      }
    }

    return embed;
  }
}
