import {
   ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";
import { Monster } from "../monsters/Monster";
import { Player } from "../Player";
import { MenuHandler } from "../MenuHandler";
import { Combatant } from "../Combatant";
import { BurstAction } from "../skills/general/BurstAction";
import { ShowBattleStatus } from "../../interactions/buttons/ShowBattleStatus";
import { ShowTurnDisplay } from "../../interactions/buttons/ShowTurnDisplay";

export class CombatUI {

  UI: MenuHandler;
  title: string = "";
  messages: string[] = [];
  color: ColorResolvable = 0x884dff;
  location: string = "Battle.";
  maximumMessageCount = 6;
  messageDisplayDuration: number = 1250;
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

  addMessage(...messages: string[]) {
    this.messages.push(...messages);
  }

  clearScreenAndAddMessage(...messages: string[]) {
    if(this.messages.length < this.maximumMessageCount){
      for(let i = this.messages.length;i < this.maximumMessageCount;i++){
        this.messages.push("\n");
      }
    }
    this.messages.push(...messages);
  }

  getBPInformation(combatant: Combatant){
    let bpMessage = "";
    for(let i = 0;i  <  combatant.maxBP; i++){
      if(i < combatant.bp){
          bpMessage += " 🟠";
      }
      else{
          bpMessage += " ⚫";
      }
    }

    return bpMessage;
  }

  async showCurrentBattleStatus(currentTurn: Combatant, ...combatants: Combatant[]){

    this.clearDisplayData();
    let display = " ";

    for(let combatant of combatants){
      let combatantBP = ``;
      if(currentTurn.nickname == combatant.nickname){
        combatantBP = `➡️ ${this.getBPInformation(combatant)} | **${combatant.nickname}**`;
      }
      else{
        combatantBP = `${this.getBPInformation(combatant)} | **${combatant.nickname}**`;
      }
      display += `${combatantBP}\n`;
      for(let effect of combatant.effects){
        if(effect.lastsInfinitely){
          display += `- **${effect.name}** x${effect.stacks}\n`
        }
        else{
          display += `- [Duration: ${effect.duration}] **${effect.name}** x${effect.stacks}\n`
        }
      }
      display += `\n`;
    }


    let embed = new EmbedBuilder()
      .setTitle(`-Turn Order-`)
      .setDescription(display)
      .setColor(0xB65FCF);

    const targetRow = new ActionRowBuilder<ButtonBuilder>().addComponents(ShowTurnDisplay.button());

    await this.UI.updateDisplay([embed], [targetRow]);
  }

  getTargetingRow(monsters: Monster[], currentTarget: number): ActionRowBuilder<ButtonBuilder>{
    const targetRow = new ActionRowBuilder<ButtonBuilder>();
    let buttons = [];

    for (let i = 0; i < monsters.length; i++) {
        let button = new ButtonBuilder()
        .setCustomId(`${i}`)
        .setLabel(`${monsters[i].nickname}`);

        if(i == currentTarget){
            button.setStyle(ButtonStyle.Danger);
        }
        else{
            button.setStyle(ButtonStyle.Secondary);  
        }

        buttons.push(button);
    }

    targetRow.addComponents(...buttons,ShowBattleStatus.button());

    return targetRow;
}

  async showPlayerTurn(player:Player, players: Player[], monsters: Monster[], targetedEnemyIndex: number){
    
    this.clearDisplayData();

    this.title = `${player.nickname}'s turn`;
    this.addMessage("BP: " + this.getBPInformation(player),`Burst: **${player.burst}%**`);
    let embed = this.getTurnDisplay(monsters,players);
    let targetRow = this.getTargetingRow(monsters,targetedEnemyIndex);

    const generalSkillsRow = new ActionRowBuilder<ButtonBuilder>();
    for (let skill of player.generalSkills) {

        let button = new ButtonBuilder()
        .setCustomId(skill.name)
        .setLabel(skill.name)

        if(skill instanceof BurstAction && player.burst >= player.maxBurst){
            button.setStyle(ButtonStyle.Danger);
        }
        else{
            button.setStyle(ButtonStyle.Primary);
        }

        generalSkillsRow.addComponents(button);
    }

    const classSkillsRow = new ActionRowBuilder<ButtonBuilder>();
    for (let skill of player.mainJob.skills) {

        let button = new ButtonBuilder()
        .setCustomId(skill.name)
        .setLabel(skill.name)
        .setStyle(ButtonStyle.Secondary);

        if(skill.bpCost > player.bp){
            button.setDisabled(true);
        }

        classSkillsRow.addComponents(button);
    }

    const subclassSkillsRow = new ActionRowBuilder<ButtonBuilder>();
    for (let skill of player.subJob.skills) {

        let button = new ButtonBuilder()
            .setCustomId(skill.name)
            .setLabel(skill.name)
            .setStyle(ButtonStyle.Secondary)

        if(skill.bpCost > player.bp){
            button.setDisabled(true);
        }

        subclassSkillsRow.addComponents(button);
    }

    let buttonRows: ActionRowBuilder<ButtonBuilder>[] = [targetRow, generalSkillsRow];
    if(classSkillsRow.components.length > 0){
        buttonRows.push(classSkillsRow);
    }

    if(subclassSkillsRow.components.length > 0){
        buttonRows.push(subclassSkillsRow);
    }

    await this.UI.updateDisplay([embed], buttonRows);
  }

  getTurnDisplay(monsters: Monster[], players: Player[], messages: string[] = this.messages): EmbedBuilder {
    let description = "";
    for (let i = 0; i < this.maximumMessageCount; i++) {
      if (i < messages.length) {
        description += messages[i] + "\n";
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
