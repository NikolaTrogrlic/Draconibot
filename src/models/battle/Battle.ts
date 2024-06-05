import { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionResponse, Message, TextChannel } from "discord.js";
import { average, createID, delay } from "../../utils";
import { Combatant } from "../Combatant";
import { Player } from "../Player";
import { CombatLocation } from "../enums/Location";
import { Monster } from "../monsters/Monster";
import { BattleAgain } from "../../interactions/buttons/BattleAgain";
import { DeclineBattleAgain } from "../../interactions/buttons/DeclineBattleAgain";
import { CombatUI } from "./CombatUI";
import { CombatMessage } from "./CombatMessage";
import { TakeDamageResult } from "./ActionResults";
import { ElementalType } from "../enums/ElementalType";
import { StatusEffectType } from "../enums/StatusEffectType";
import { PassiveName } from "../enums/PassiveName";
import { StatusEffect } from "../StatusEffect";
import { BurstAction } from "../skills/general/BurstAction";
import { MenuHandler } from "../MenuHandler";

export class Battle {

    id: string;
    turnOrder: Combatant[] = [];
    monsters: Monster[] = [];
    players: Player[] = [];
    round: number = 0;
    display: CombatUI;
    bonusEXP: number = 0;
    combatLevel: number = 0;
    defeatedMonsterCount: number = 0;
    currentAction: Combatant | undefined;
    battleLost: boolean = true;
    currentTarget: number = -1;
    location: CombatLocation = CombatLocation.Plains;
    battleInProgress: boolean = false;

    constructor(battleInitiator: Player, location: CombatLocation, ...combatants: Combatant[]) {
        this.display = new CombatUI(battleInitiator.menu);
        this.id = createID();
        this.battleInProgress = false;
        this.newBattle(location, combatants);
    }

    getAverageMonsterLevel(monsters: Monster[]) {
        return average(monsters.map(x => x.level));
    }

    async newBattle(location: CombatLocation, newCombatants: Combatant[]) {
        
        this.turnOrder = [];
        this.monsters = [];
        this.players = [];

        this.turnOrder.push(...newCombatants);
        for (let combatant of this.turnOrder) {
            combatant.battleID = this.id;
            combatant.bp = 1;
            combatant.stats.HP = combatant.stats.maxHP;
            combatant.isDefeated = false;
            combatant.buffs = [];
            combatant.debuffs = [];
            
            if(combatant instanceof Player){
                combatant.burst = 0;
                if(combatant.passives.find(x => x.name == PassiveName.AutoEarthResist)){
                    combatant.buffs.push(new StatusEffect(StatusEffectType.AutoResistEarth, 3));
                }
                this.players.push(combatant);
            }
            if(combatant instanceof Monster){
                this.monsters.push(combatant);
            }
        }
        if (this.players.length == 0) return;

        this.defeatedMonsterCount = 0;
        this.round = 0;
        this.bonusEXP = 0;
        this.combatLevel = this.getAverageMonsterLevel(this.monsters);
        this.location = location;
        this.battleInProgress = true;

        //Setup the initial display
        this.display.clearDisplayData();
        this.display.title = `Encounter !`;
        this.display.addMessage(new CombatMessage(`- Enemies appear !`));
        this.display.color = 0xFF0000;
        this.display.location = this.location;
        const battleUI = this.display.getTurnDisplay(this.monsters,this.players);
        this.display.UI.updateDisplay([battleUI]);
        
        //Start the first round of combat
        setTimeout(() => this.newRound(),1000);
    }

    newRound() {
        this.round++;
        this.turnOrder.sort((x: Combatant, y: Combatant) => (y.stats.speed - x.stats.speed));
        for (let i = 0; i < this.turnOrder.length; i++) {
            if (i == 0 && this.turnOrder.length > 1) {
                if (this.turnOrder[0].stats.speed >= (2 * this.turnOrder[1].stats.speed)) {
                    this.turnOrder[0].actions = 2;
                }
                else {
                    this.turnOrder[0].actions = 1;
                }
            }
            else {
                this.turnOrder[i].actions = 1;
            }
            this.turnOrder[i].increaseBpBy(1);
            this.turnOrder[i].isDefending = false;
            this.turnOrder[i].isFleeing = false;
        }
        this.nextAction();
    }

    removeDefeatedOrFleeingCombatant(combatant: Combatant){

        if((combatant.isFleeing || combatant.isDefeated) == false) return;

        let removeIndex = this.turnOrder.indexOf(combatant);
        
        if(removeIndex != -1){
            this.turnOrder.splice(removeIndex, 1);
        }

        if(combatant instanceof Monster){
            let removeMonsterIndex = this.monsters.indexOf(combatant);
            if(removeMonsterIndex != -1){
                this.monsters.splice(removeMonsterIndex, 1);
            }
            if(combatant.isFleeing == false){
                this.defeatedMonsterCount++;
                if (combatant.bonusEXP > 0 && (this.combatLevel + 4 > combatant.level && this.combatLevel - 4 < combatant.level)) {
                    this.bonusEXP += combatant.bonusEXP;
                }
            }
        }
        else if(combatant instanceof Player){
            let removePlayerIndex = this.players.indexOf(combatant);
            if(removePlayerIndex != -1){
                this.players.splice(removePlayerIndex, 1);
            }
            combatant.stats.HP = combatant.stats.maxHP;
        }
    }

    nextAction() {

        this.display.clearDisplayData();

        for (let i = this.turnOrder.length - 1;i >= 0;i--) {
            this.removeDefeatedOrFleeingCombatant(this.turnOrder[i]);
        }

        if (this.monsters.length == 0) {
            this.display.addMessage(new CombatMessage(`All enemies defeated.\n`));
            this.battleLost = false;
            this.battleEnd();
            return;
        }
        else if (this.players.length == 0) {
            this.display.addMessage(new CombatMessage(`Battle lost.`));
            this.battleLost = true;
            this.battleEnd();
            return;
        }

        for (const combatant of this.turnOrder) {
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

        this.newRound();
        return;
    }

    async monsterTurn(monster: Monster) {

       monster.tickStatus(1);
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
                        this.display.getTurnDisplay(this.monsters,this.players, messagesToShow);
                        
                        let embed= this.display.getTurnDisplay(this.monsters,this.players, currentlyDisplayedMessages);
                        await this.display.UI.updateDisplay([embed]);
                        await delayBetweenMessages;
                    }
                }
                else{
                    let embed= this.display.getTurnDisplay(this.monsters,this.players, currentlyDisplayedMessages);
                    await this.display.UI.updateDisplay([embed]);
                    await delay(250);
                }
            }
            setTimeout(() => this.nextAction(), (this.display.messages.length * this.display.messageDisplayDuration));
        }
        else{
            const embed= this.display.getTurnDisplay(this.monsters,this.players);
            await this.display.UI.updateDisplay([embed]);
            setTimeout(() => this.nextAction(), (this.display.messages.length * this.display.messageDisplayDuration));
        }
    }

    getTargetingRow(): ActionRowBuilder<ButtonBuilder>{
        const targetRow = new ActionRowBuilder<ButtonBuilder>();
        let buttons = [];

        for (let i = 0; i < this.monsters.length; i++) {
            let button = new ButtonBuilder()
            .setCustomId(`${i}`)
            .setLabel(`${this.monsters[i].nickname}`);

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
        player.tickStatus(1);
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
        const embed = this.display.getTurnDisplay(this.monsters,this.players);
        const targetRow = this.getTargetingRow();

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

        await this.display.UI.updateDisplay([embed], buttonRows);
    }

    async battleEnd() {

        this.battleInProgress = false;
        this.display.title = `Battle Ended`;
        let victoryMessage = " ";
        for (let player of this.players) {
            if (this.battleLost == false) {
                victoryMessage += player.giveExp(this.combatLevel, this.defeatedMonsterCount, this.bonusEXP);
            }
            player.stats.HP = player.stats.maxHP;
        }
        this.display.addMessage(new CombatMessage(victoryMessage));
        const battleAgainOptions = new ActionRowBuilder<ButtonBuilder>().addComponents(DeclineBattleAgain.button(), BattleAgain.button());
        const embed = this.display.getTurnDisplay(this.monsters,this.players);
        await this.display.UI.updateDisplay([embed], [battleAgainOptions]);
    }

    dealDamageToCombatant(combatant: Combatant, damageTaken: number, damageType: ElementalType = ElementalType.Physical): TakeDamageResult{

        let result = new TakeDamageResult(combatant);
        
        if(combatant instanceof Player){
            for(let player of this.players){
                if(player.userID != combatant.userID){
                    for(let buff of player.buffs){
                        if(player.stats.HP > 0 && buff.type == StatusEffectType.HeroicGuard){
                            result.damagedCharacter = player;
                            result.combatMessage.message += `**${player.nickname} blocks the hit for ${combatant.nickname}**\n`;
                            break;
                        }
                    }
                }
            }
        }

        if(damageType == ElementalType.Physical){
            let status = result.damagedCharacter.buffs.find(x => x.type == StatusEffectType.ArmorUp);
            if(status){
                damageTaken = damageTaken * 0.8;
            }
        }

        let resistances = [...result.damagedCharacter.resistances];
        if(result.damagedCharacter.buffs.find(x => x.type == StatusEffectType.AutoResistEarth)){
            resistances.push(ElementalType.Earth);
        }

        if(resistances.find(x => x == damageType)){
            damageTaken = damageTaken * 0.7;
            result.resistanceWasHit = true;
        }
        else if(result.damagedCharacter.weaknesses.findIndex(x => x == damageType) != -1){
            damageTaken = damageTaken * 1.3;
            result.weaknessWasHit = true;
        }
        
        if(result.damagedCharacter.isDefending || result.damagedCharacter.buffs.find(x => x.type == StatusEffectType.AutoGuard)){
            damageTaken = damageTaken * 0.6;
        }
        else if(damageTaken <= 0){
            damageTaken = 1;
        }

        damageTaken = Math.round(damageTaken);

        result.damageTaken = damageTaken;

        if(result.damagedCharacter.stats.HP > 0){
            
            result.combatMessage.message += `Deals **${result.damageTaken}** ${damageType} damage to ${result.damagedCharacter.nickname}.`;
            result.damagedCharacter.stats.HP -= result.damageTaken;

            if(result.weaknessWasHit){
                result.combatMessage.message += `[${damageType} **WEAKNESS**]`;
            }
            else if(result.resistanceWasHit){
                result.combatMessage.message += `[${damageType} **RESIST**]`;
            }
            
            if(result.damagedCharacter.stats.HP <= 0 && result.damagedCharacter.isDefeated == false){
                let message = `\n - *${result.damagedCharacter.nickname} defeated !*`;
                result.combatMessage.message += message;
                result.wasDefeated = true;
                result.damagedCharacter.isDefeated = true;
            }
        }

        return result;
    }
}
