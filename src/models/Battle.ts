import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel, ThreadChannel } from "discord.js";
import { average, createID } from "../utils";
import { Combatant } from "./Combatant";
import { ElementalType, nextElement, randomElement } from "./enums/ElementalType";
import { Player } from "./Player";
import { CombatLocation } from "./enums/Location";
import { Monster } from "./monsters/Monster";
import { BattleAgain } from "../buttons/BattleAgain";
import { DeclineBattleAgain } from "../buttons/DeclineBattleAgain";

export class Battle {

    id: string;
    channel: TextChannel;
    combatants: Combatant[];
    turn: number;
    burst: ElementalType;
    thread: ThreadChannel | undefined;
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
                    this.burst = nextElement(this.burst);
                    this.playerTurn(combatant);
                    return;
                }
                else if (combatant instanceof Monster) {
                    if (this.thread) {
                        await this.thread.send({ embeds: [this.monsterTurn(combatant)] });
                    }
                    this.nextAction();
                    return;
                }
            }
        }

        this.setNewTurn();
        return;
    }



    monsterTurn(monster: Monster): EmbedBuilder {

        let battleEmbed = new EmbedBuilder()
            .setColor(16711680)
            .setTitle(`${monster.name}'s turn.`);

        let actionReport = monster.performCombatTurn(this);
        monster.actions--;

        return battleEmbed.setDescription(actionReport);
    }

    async sendActionMessage(message: string, actionUser: Combatant, moveToNextAction: boolean = true) {

        let battleEmbed = new EmbedBuilder()
            .setTitle(`${actionUser.name}'s turn.`)
            .setDescription(message);

        if (actionUser instanceof Monster) {
            battleEmbed.setColor(16711680);
        }
        else if (actionUser instanceof Player) {
            battleEmbed.setColor(235678);
        }

        if (this.thread) {
            this.thread.send({ embeds: [battleEmbed] });
        }

        if (moveToNextAction) {
            actionUser.actions--;
            this.nextAction();
        }
    }

    updateTarget(number: number) {
        this.currentTarget = number;
    }

    async playerTurn(player: Player) {

        this.currentActionOwner = player;
        this.currentTarget = -1;
        let turnColor = 26316;

        if (player.mainJob.jobElement == this.burst) {
            turnColor = 16766720;
        }

        let battleEmbed = new EmbedBuilder()
            .setColor(turnColor)
            .setTitle(`▶️ ${player.name}`)
            .setDescription(`${player.stats.HP}/${player.stats.maxHP} HP | ${player.bp} BP\nElemental Field:  ${this.burst}\nBlock: ${player.blockMeter}/200`);

        for (let monster of this.getMonsters()) {
            battleEmbed.addFields({ name: `${monster.name}`, value: `${monster.stats.HP}/${monster.stats.maxHP} HP`, inline: true });
        }

        const players = this.getPlayers();

        if (players.length > 1) {
            battleEmbed.addFields({ name: '\u200B', value: '\u200B' });
            for (let partyMember of players) {
                if (partyMember.name != player.name) {
                    battleEmbed.addFields({ name: `${partyMember.name}`, value: `${partyMember.stats.HP}/${partyMember.stats.maxHP} HP`, inline: true });
                }
            }
        }

        let buttons = [];
        const monsters = this.getMonsters();
        const targetRow = new ActionRowBuilder<ButtonBuilder>();

        for (let i = 0; i < monsters.length; i++) {
            buttons.push(new ButtonBuilder()
                .setCustomId(`${i}`)
                .setLabel(`[${i + 1}] Target ${monsters[i].name}`)
                .setStyle(ButtonStyle.Danger));
        }
        targetRow.addComponents(...buttons);

        buttons = [];
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
                .setStyle(ButtonStyle.Danger));
        }

        for (let skill of player.subJob.skills) {
            buttons.push(new ButtonBuilder()
                .setCustomId(skill.name)
                .setLabel(skill.name)
                .setStyle(ButtonStyle.Danger));
        }

        const chunkSize = 5;
        const skillRow = new ActionRowBuilder<ButtonBuilder>();
        for (let i = 0; (i < buttons.length && i < 25); i += chunkSize) {
            const buttonsForRow = buttons.slice(i, i + chunkSize);
            skillRow.addComponents(...buttonsForRow);
        }

        if (this.thread) {
            await this.thread.send({ embeds: [battleEmbed], components: [targetRow, skillRow] });
        }
    }

    async battleStart() {

        if (!this.hasPlayers()) {
            return;
        }

        this.battleInProgress = true;

        if (!this.thread) {
            this.thread = await this.channel.threads.create({
                name: 'Battle at the ' + this.location,
                reason: 'Draconibot battle instance.'
            });
        }

        if (this.thread.joinable) await this.thread.join();

        this.setNewTurn();
    }

    async battleEnd(actionReport: string | undefined = undefined) {

        this.battleInProgress = false;
        const players = this.getPlayers();
        let victoryMessage = " ";

        for (let player of players) {
            if (this.battleLost == false) {
                victoryMessage += player.giveExp(this.combatLevel, this.defeatedMonsterCount, this.bonusEXP);
            }
            player.stats.HP = player.stats.maxHP;
        }

        if (this.thread) {

            let message = "";

            const targetRow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(DeclineBattleAgain.button(), BattleAgain.button());

            if (actionReport && actionReport !== "") {
                message += actionReport;
            }
            if (this.battleLost == false) {
                message += "\n" + victoryMessage;
            }

            await this.thread.send({ content: message, components: [targetRow] });
        }
    }
}
