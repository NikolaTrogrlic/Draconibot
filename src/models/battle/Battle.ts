import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, Embed, EmbedBuilder, Message, TextChannel, ThreadChannel } from "discord.js";
import { average, createID, delay } from "../../utils";
import { Combatant } from "../Combatant";
import { Player } from "../Player";
import { CombatLocation } from "../enums/Location";
import { Monster } from "../monsters/Monster";
import { BattleAgain } from "../../interactions/buttons/BattleAgain";
import { DeclineBattleAgain } from "../../interactions/buttons/DeclineBattleAgain";
import { getAverageMonsterLevel, getMonsters, getPlayers } from "./BattleUtils";
import { CombatUI } from "./CombatUI";
import { CombatMessage } from "./CombatMessage";

export class Battle {

    id: string;
    channel: TextChannel;
    combatants: Combatant[] = [];
    turn: number = 0;
    display: CombatUI = new CombatUI();
    bonusEXP: number = 0;
    combatLevel: number = 0;
    currentAction: Combatant | undefined;
    defeatedMonsterCount: number = 0;
    battleLost: boolean = true;
    currentTarget: number = -1;
    location: CombatLocation = CombatLocation.Plains;
    battleInProgress: boolean = false;

    constructor(channel: TextChannel, location: CombatLocation, ...combatants: Combatant[]) {
        this.channel = channel;
        this.id = createID();
        this.battleInProgress = false;
        this.newBattle(location, combatants);
    }

    newBattle(location: CombatLocation, newCombatants: Combatant[]) {
        this.combatants.push(...newCombatants);
        this.defeatedMonsterCount = 0;
        for (let combatant of this.combatants) {
            combatant.battleID = this.id;
            combatant.bp = 1;
            combatant.isDefeated = false;
            combatant.stats.HP = combatant.stats.maxHP;
            if(combatant instanceof Player){
                combatant.burst = 0;
            }
        }
        this.turn = 0;
        this.bonusEXP = 0;
        this.combatLevel = getAverageMonsterLevel(this.combatants);
        this.location = location;
        this.battleStart();
    }

    async battleStart() {

        if (getPlayers(this.combatants).length == 0) return;

        this.battleInProgress = true;
        this.display.clearDisplayData();
        this.display.title = `Encounter !`;
        this.display.addMessage(new CombatMessage(`- Enemies appear !`));
        this.display.color = 0xFF0000;
        this.display.location = this.location;
        const battleUI = this.display.getTurnDisplay(this.combatants);

        if (!this.display.mainDisplayMessage) {
            let message = await this.channel.send({embeds: [battleUI]});
            this.display.mainDisplayMessage = message;
        }
        else{
            this.display.updateDisplay(battleUI);
        }
        
        setTimeout(() => this.setNewTurn(),1000);
    }

    setNewTurn() {
        this.turn++;
        this.combatants.sort((x: Combatant, y: Combatant) => (y.stats.speed - x.stats.speed));
        for (let i = 0; i < this.combatants.length; i++) {
            if (i == 0 && this.combatants.length > 1) {
                if (this.combatants[0].stats.speed >= (2 * this.combatants[1].stats.speed)) {
                    this.combatants[0].actions = 2;
                }
                else {
                    this.combatants[0].actions = 1;
                }
            }
            else {
                this.combatants[i].actions = 1;
            }
            this.combatants[i].increaseBpBy(1);
            this.combatants[i].isDefending = false;
            this.combatants[i].isFleeing = false;
        }
        this.nextAction();
    }

    nextAction() {
        this.display.clearDisplayData();

        //Removes dead combatants from the battle
        const combatants = this.combatants.filter(x => x.isDefeated || x.isFleeing);
        for (let combatant of combatants) {
            let removeIndex = this.combatants.indexOf(combatant);
            if (combatant instanceof Monster) {
                if(combatant.isFleeing == false){
                    this.defeatedMonsterCount++;
                    if (combatant.bonusEXP > 0 && (this.combatLevel + 4 > combatant.level && this.combatLevel - 4 < combatant.level)) {
                        this.bonusEXP += combatant.bonusEXP;
                    }
                }
                this.combatants.splice(removeIndex, 1);
                if (getMonsters(this.combatants).length == 0) {
                    this.display.addMessage(new CombatMessage(`All enemies defeated.\n`));
                    this.battleLost = false;
                    this.battleEnd();
                    return;
                }
            }
            else if (combatant instanceof Player) {
                combatant.stats.HP = combatant.stats.maxHP;
                this.combatants.splice(removeIndex, 1);
                if (getPlayers(this.combatants).length == 0) {
                    this.display.addMessage(new CombatMessage(`Battle lost.`));
                    this.battleLost = true;
                    this.battleEnd();
                    return;
                }
            }
        }

        //Gives a turn to the next person in the turn order.
        for (const combatant of this.combatants) {
            if (combatant.actions > 0) {
                this.currentAction = combatant;
                if (combatant instanceof Player) {
                    this.playerTurn(combatant);
                    return;
                }
                else if (combatant instanceof Monster) {
                    this.monsterTurn(combatant);
                    return;
                }
            }
        }

        //When no combatants have actions left, start a new turn.
        this.setNewTurn();
        return;
    }

    async monsterTurn(monster: Monster) {

       monster.performCombatTurn(this);
       this.display.title = `${monster.nickname}'s turn.`;
       this.display.color = 16711680;
       monster.actions--;

       await this.showAndAnimateMessages();
    }

    async displayAction(actionUser: Combatant) {

        if (actionUser instanceof Monster) {
            this.display.color = 16711680;
        }
        else{
            this.display.color = 235678;
        }

        actionUser.actions--;

        this.display.title = `${actionUser.nickname}'s turn.`;
        await this.showAndAnimateMessages();
    }

    async showAndAnimateMessages(){
        if(this.display.isShowingMessagesOneByOne){
            for(let i = 0; i < this.display.messages.length; i++){
                let currentlyDisplayedMessages = this.display.messages.slice(0, i + 1);
                let lastAddedMessageIndex = currentlyDisplayedMessages.length - 1;
                if(currentlyDisplayedMessages[lastAddedMessageIndex].keyFrames.length > 0){
                    for(let frame of currentlyDisplayedMessages[lastAddedMessageIndex].keyFrames){
                        let messagesToShow = currentlyDisplayedMessages;
                        let delayBetweenMessages = delay(messagesToShow[lastAddedMessageIndex].frameDuration);
                        messagesToShow[lastAddedMessageIndex].message = frame;
                        this.display.getTurnDisplay(this.combatants, messagesToShow);
                        
                        let embed= this.display.getTurnDisplay(this.combatants, currentlyDisplayedMessages);
                        await this.display.updateDisplay(embed);
                        await delayBetweenMessages;
                    }
                }
                else{
                    let embed= this.display.getTurnDisplay(this.combatants, currentlyDisplayedMessages);
                    await this.display.updateDisplay(embed);
                    await delay(250);
                }
            }
            setTimeout(() => this.nextAction(), (this.display.messages.length * this.display.messageDisplayDuration));
        }
        else{
            const embed= this.display.getTurnDisplay(this.combatants);
            await this.display.updateDisplay(embed);
            setTimeout(() => this.nextAction(), (this.display.messages.length * this.display.messageDisplayDuration));
        }
    }

    getTargetingRow(): ActionRowBuilder<ButtonBuilder>{
        const targetRow = new ActionRowBuilder<ButtonBuilder>();
        const monsters = getMonsters(this.combatants);
        let buttons = [];

        for (let i = 0; i < monsters.length; i++) {
            let button = new ButtonBuilder()
            .setCustomId(`${i}`)
            .setLabel(`${monsters[i].nickname}`);

            if(i == this.currentTarget){
                button.setStyle(ButtonStyle.Danger);
            }
            else{
                button.setStyle(ButtonStyle.Secondary);  
            }

            buttons.push(button);
        }
        targetRow.addComponents(...buttons);

        return targetRow;
    }

    async playerTurn(player: Player) {
        this.currentTarget = 0;
        this.display.title = `${player.nickname}'s turn`;
        let bpMessage = "BP: ";
        for(let i = 0;i  <  player.maxBP; i++){
            if(i < player.bp){
                bpMessage += " 🟠";
            }
            else{
                bpMessage += " ⚫";
            }
        }
        this.display.addMessage(new CombatMessage(bpMessage),new CombatMessage(`Burst: **${player.burst}%**`));
        const embed = this.display.getTurnDisplay(this.combatants);
        const targetRow = this.getTargetingRow();

        const generalSkillsRow = new ActionRowBuilder<ButtonBuilder>();
        for (let skill of player.generalSkills) {
            generalSkillsRow.addComponents(new ButtonBuilder()
                .setCustomId(skill.name)
                .setLabel(skill.name)
                .setStyle(ButtonStyle.Primary));
        }

        const classSkillsRow = new ActionRowBuilder<ButtonBuilder>();
        for (let skill of player.mainJob.skills) {
            classSkillsRow.addComponents(new ButtonBuilder()
            .setCustomId(skill.name)
            .setLabel(skill.name)
            .setStyle(ButtonStyle.Success));
        }

        const subclassSkillsRow = new ActionRowBuilder<ButtonBuilder>();
        for (let skill of player.subJob.skills) {
            subclassSkillsRow.addComponents(new ButtonBuilder()
                .setCustomId(skill.name)
                .setLabel(skill.name)
                .setStyle(ButtonStyle.Success));
        }

        let buttonRows: ActionRowBuilder<ButtonBuilder>[] = [targetRow, generalSkillsRow];
        if(classSkillsRow.components.length > 0){
            buttonRows.push(classSkillsRow);
        }

        if(subclassSkillsRow.components.length > 0){
            buttonRows.push(subclassSkillsRow);
        }

        await this.display.updateDisplay(embed, buttonRows);
    }

    async battleEnd() {

        this.battleInProgress = false;
        this.display.title = `Battle Ended`;
        let victoryMessage = " ";
        const players = getPlayers(this.combatants);
        for (let player of players) {
            if (this.battleLost == false) {
                victoryMessage += player.giveExp(this.combatLevel, this.defeatedMonsterCount, this.bonusEXP);
            }
            player.stats.HP = player.stats.maxHP;
        }
        this.display.addMessage(new CombatMessage(victoryMessage));
        const battleAgainOptions = new ActionRowBuilder<ButtonBuilder>().addComponents(DeclineBattleAgain.button(), BattleAgain.button());
        const embed = this.display.getTurnDisplay(this.combatants);
        await this.display.updateDisplay(embed, [battleAgainOptions]);
    }
}
