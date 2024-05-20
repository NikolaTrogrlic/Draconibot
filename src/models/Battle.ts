import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, Embed, EmbedBuilder, Message, TextChannel, ThreadChannel } from "discord.js";
import { average, createID } from "../utils";
import { Combatant } from "./Combatant";
import { ElementalType, nextElement, randomElement } from "./enums/ElementalType";
import { Player } from "./Player";
import { CombatLocation } from "./enums/Location";
import { Monster } from "./monsters/Monster";
import { BattleAgain } from "../interactions/buttons/BattleAgain";
import { DeclineBattleAgain } from "../interactions/buttons/DeclineBattleAgain";

export class Battle {

    id: string;
    channel: TextChannel;
    combatants: Combatant[];
    turn: number;
    burst: ElementalType;
    battleUI: Message<any> | undefined;
    bonusEXP: number;
    combatLevel: number;
    currentAction: Combatant | undefined;
    defeatedMonsterCount: number;
    battleLost: boolean = true;
    currentActionOwner: Combatant | undefined;
    currentTarget: number = -1;
    location: CombatLocation;
    battleInProgress: boolean;

    constructor(channel: TextChannel, location: CombatLocation, ...combatants: Combatant[]) {
        this.channel = channel;
        this.id = createID();
        this.combatants = combatants;
        this.defeatedMonsterCount = 0;
        for (let combatant of combatants) {
            combatant.battleID = this.id;
            combatant.bp = 0;
            combatant.blockMeter = 0;
        }
        this.turn = 0;
        this.bonusEXP = 0;
        this.combatLevel = this.getAverageMonsterLevel();
        this.burst = randomElement();
        this.location = location;
        this.battleInProgress = false;
    }

    startSecondBattle(location: CombatLocation, newMonsters: Monster[]) {

        this.combatants.push(...newMonsters);
        this.defeatedMonsterCount = 0;
        for (let combatant of this.combatants) {
            combatant.battleID = this.id;
            combatant.bp = 0;
            combatant.stats.HP = combatant.stats.maxHP;
            combatant.blockMeter = 0;
        }
        this.turn = 0;
        this.bonusEXP = 0;
        this.combatLevel = this.getAverageMonsterLevel();
        this.burst = randomElement();
        this.location = location;

        this.battleStart();
    }

    getPlayers(): Player[] {
        return this.combatants.filter(x => x instanceof Player).map(x => x as Player);
    }

    getMonsters(): Monster[] {
        return this.combatants.filter(x => x instanceof Monster).map(x => x as Monster);
    }

    hasPlayers() {
        return this.combatants.find(x => x instanceof Player);
    }

    hasMonsters() {
        return this.combatants.find(x => x instanceof Monster);
    }

    getAverageMonsterLevel() {
        return average(this.getMonsters().map(x => x.level));
    }

    setNewTurn() {
        this.turn++;
        this.combatants.sort((x: Combatant, y: Combatant) => (y.stats.speed - x.stats.speed));
        this.burst = nextElement(this.burst);

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
        }
        this.nextAction();
    }

    async nextAction() {
        let actionReport = "";

        const combatants = this.combatants.filter(x => x.stats.HP <= 0);
        for (const combatant of combatants) {
            const index = this.combatants.indexOf(combatant, 0);
            if (index > -1) {
                if (combatant instanceof Monster) {
                    this.defeatedMonsterCount++;
                    if (combatant.bonusEXP > 0 && (this.combatLevel + 4 > combatant.level && this.combatLevel - 4 < combatant.level)) {
                        this.bonusEXP += combatant.bonusEXP;
                    }
                }
                if (combatant instanceof Player) {
                    combatant.stats.HP = combatant.stats.maxHP;
                }
                actionReport += `${combatant.name} defeated!\n`;
                this.combatants.splice(index, 1);
            }
        }

        if (!this.hasPlayers()) {
            actionReport += `Battle lost.\n`;
            this.battleEnd(actionReport);
            return;
        }
        else if (!this.hasMonsters()) {
            actionReport += `All enemies defeated.\n`;
            this.battleLost = false;
            this.battleEnd(actionReport);
            return;
        }

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

        this.setNewTurn();
        return;
    }



    async monsterTurn(monster: Monster) {
       let messages = monster.performCombatTurn(this);
       let embed = this.getBattleEmbed(`${monster.nickname}'s turn.`, messages, 16711680);
       monster.actions--;
       if(this.battleUI){
        await this.battleUI.edit({ embeds: [embed], components: [] });
        setTimeout(() => this.nextAction(),messages.length * 1600);
       }
    }

    getBattleEmbed(title: string, messages: string[], color: ColorResolvable = 0x884DFF){

        let message = "";
        
        for(let i = 0; i < 5;i++){
            if(i < messages.length){
                message += messages[i] + "\n";
            }
            else{
                message += "\u200B\n";
            }
        }

        let embed = new EmbedBuilder()
            .setAuthor({name: `${this.location} Battle.`})
            .setTitle(`${title}`)
            .setDescription(message)
            .setColor(color)

        for (let partyMember of this.getPlayers()) {
            embed.addFields({ name: `${partyMember.nickname}`, value: `${partyMember.stats.HP}/${partyMember.stats.maxHP} HP`, inline: true });
        }

        embed.addFields({ name: ' ', value: ' ' });

        for (let monster of this.getMonsters()) {
            embed.addFields({ name: `${monster.nickname}`, value: `${monster.stats.HP}/${monster.stats.maxHP} HP`, inline: true });
        }

        return embed;
    }

    async displayAction(messages: string[], actionUser: Combatant, moveToNextAction: boolean = true) {

        let color = 235678;
        if (actionUser instanceof Monster) {
            color = 16711680;
        }

        let embed = this.getBattleEmbed(`${actionUser.nickname}'s turn.`, messages, color);
        if (this.battleUI) {
            this.battleUI.edit({ embeds: [embed], components: [] });
        }

        if (moveToNextAction) {
            actionUser.actions--;
            setTimeout(() => this.nextAction(), messages.length * 1600);
        }
    }

    updateTarget(number: number) {
        this.currentTarget = number;
    }

    getTargetingRow(): ActionRowBuilder<ButtonBuilder>{
        const targetRow = new ActionRowBuilder<ButtonBuilder>();
        const monsters = this.getMonsters();
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

        this.currentActionOwner = player;
        this.currentTarget = 0;

        let turnColor = 26316;
        if (player.mainJob.jobElement == this.burst) {
            turnColor = 16766720;
        }

        let embed = this.getBattleEmbed(`${player.nickname}'s turn`,[`BP: ${player.bp} | Block: ${player.blockMeter}/200`,`Elemental Field:  ${this.burst}`]);
        const targetRow = this.getTargetingRow();

        let buttons = [];
        for (let skill of player.generalSkills) {
            buttons.push(new ButtonBuilder()
                .setCustomId(skill.name)
                .setLabel(skill.name)
                .setStyle(ButtonStyle.Primary));
        }

        for (let skill of player.mainJob.skills) {
            buttons.push(new ButtonBuilder()
                .setCustomId(skill.name)
                .setLabel(skill.name)
                .setStyle(ButtonStyle.Success));
        }

        for (let skill of player.subJob.skills) {
            buttons.push(new ButtonBuilder()
                .setCustomId(skill.name)
                .setLabel(skill.name)
                .setStyle(ButtonStyle.Success));
        }

        const chunkSize = 5;
        const skillRow = new ActionRowBuilder<ButtonBuilder>();
        for (let i = 0; (i < buttons.length && i < 25); i += chunkSize) {
            const buttonsForRow = buttons.slice(i, i + chunkSize);
            skillRow.addComponents(...buttonsForRow);
        }

        if (this.battleUI) {
            await this.battleUI.edit({ embeds: [embed], components: [targetRow, skillRow] });
        }
    }

    async battleStart() {

        if (!this.hasPlayers()) {
            return;
        }

        this.battleInProgress = true;
        const battleUI = this.getBattleEmbed(`Encounter !`, [`- Enemies appear !`], 0xFF0000);

        if (!this.battleUI) {
            this.battleUI = await this.channel.send({embeds: [battleUI], components: []});
        }
        else{
            this.battleUI.edit({embeds: [battleUI], components: []});
        }

        setTimeout(() => this.setNewTurn(),1000);
    }

    async battleEnd(actionReport: string | undefined = undefined) {

        this.battleInProgress = false;
        const players = this.getPlayers();
        let victoryMessage = " ";
        let embed = this.getBattleEmbed(`Battle Ended`, []);

        for (let player of players) {
            if (this.battleLost == false) {
                victoryMessage += player.giveExp(this.combatLevel, this.defeatedMonsterCount, this.bonusEXP);
            }
            player.stats.HP = player.stats.maxHP;
        }

        if (this.battleUI) {

            let message = "";

            const targetRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(DeclineBattleAgain.button(), BattleAgain.button());

            if (actionReport && actionReport !== "") {
                message += actionReport;
            }
            if (this.battleLost == false) {
                message += "\n" + victoryMessage;
            }

            embed.setDescription(message);

            await this.battleUI.edit({ embeds: [embed], components: [targetRow] });
        }
    }
}
