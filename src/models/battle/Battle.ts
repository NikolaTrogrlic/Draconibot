import { ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionResponse, Message, TextChannel } from "discord.js";
import { average, createID, delay } from "../../utils";
import { Combatant } from "../Combatant";
import { Player } from "../Player";
import { CombatLocation } from "../enums/Location";
import { Monster } from "../monsters/Monster";
import { BattleAgain } from "../../interactions/buttons/BattleAgain";
import { DeclineBattleAgain } from "../../interactions/buttons/DeclineBattleAgain";
import { CombatUI } from "./CombatUI";
import { TakeDamageResult } from "./ActionResults";
import { ElementalType } from "../enums/ElementalType";
import { PassiveName } from "../enums/PassiveName";
import { ResistUp } from "../effects/WhenHitEffects/ResistUp";
import { TriggerWhenAllyHitEffect } from "../effects/OnAllyHitEffects/TriggerWhenAllyHitEffect";
import { TriggerWhenHitEffect } from "../effects/WhenHitEffects/TriggerWhenHitEffect";
import { EffectBase } from "../effects/EffectBase";
import { TriggerWhenAttackingEffect } from "../effects/OnAttackingEffects/TriggerWhenAttackingEffect";
import { CounterAttackEffect } from "../effects/CounterAttackEffects/CounterAttackEffect";

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
            combatant.effects = [];
            
            if(combatant instanceof Player){
                combatant.burst = 0;
                for(var passive of combatant.passives){

                    let battleStartEffect: EffectBase | undefined;
                    switch (passive.name){
                        case PassiveName.AutoResistEarth:
                            battleStartEffect = new ResistUp("Auto-Resist Earth", 3, ElementalType.Earth);
                        break;
                        case PassiveName.AutoResistFire:
                            battleStartEffect = new ResistUp("Auto-Resist Fire", 3, ElementalType.Fire)
                        break;
                    }

                    if(battleStartEffect){
                        if(combatant.passives.find(x => x.name == PassiveName.TestOfWill)){
                            battleStartEffect.maxDuration++;
                            battleStartEffect.duration++;
                        }
                        combatant.giveEffect(battleStartEffect);
                    }
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
        this.display.addMessage(`- Enemies appear !`);
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
            this.display.addMessage(`All enemies defeated.\n`);
            this.battleLost = false;
            this.battleEnd();
            return;
        }
        else if (this.players.length == 0) {
            this.display.addMessage(`Battle lost.`);
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
                
                let startIndex = Math.floor(i / this.display.maximumMessageCount) * this.display.maximumMessageCount;
                let endIndex = startIndex + this.display.maximumMessageCount;
                if(endIndex > i){
                    endIndex = i;
                }

                let currentlyDisplayedMessages = this.display.messages.slice(startIndex, i + 1);

                let embed= this.display.getTurnDisplay(this.monsters,this.players, currentlyDisplayedMessages);
                await this.display.UI.updateDisplay([embed]);
                await delay(100);
            }
            let durationToWait = this.display.messages.length * this.display.messageDisplayDuration;
            setTimeout(() => this.nextAction(), (durationToWait));
        }
        else{
            const embed= this.display.getTurnDisplay(this.monsters,this.players);

            await this.display.UI.updateDisplay([embed]);
            setTimeout(() => this.nextAction(), (this.display.messages.length * this.display.messageDisplayDuration));
        }
    }

    async playerTurn(player: Player) {
        this.currentTarget = 0;
        player.tickStatus(1);
        await this.display.showPlayerTurn(player, this.players, this.monsters, this.currentTarget);
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
        this.display.addMessage(victoryMessage);
        const battleAgainOptions = new ActionRowBuilder<ButtonBuilder>().addComponents(DeclineBattleAgain.button(), BattleAgain.button());
        const embed = this.display.getTurnDisplay(this.monsters,this.players);
        await this.display.UI.updateDisplay([embed], [battleAgainOptions]);
    }

    dealDamageToCombatant(attacker:Combatant, defender: Combatant, baseDamage: number, damageType: ElementalType = ElementalType.Physical): TakeDamageResult{

        let result = new TakeDamageResult(attacker,baseDamage,damageType,defender);
        
        if(defender instanceof Player){
            for(let player of this.players){
                if(player.userID != defender.userID){
                    for(let effect of player.effects){
                        if(effect instanceof TriggerWhenAllyHitEffect){
                            result = effect.trigger(player, result);
                        }
                    }
                }
            }
        }

        for(let effect of result.attacker.effects){
            if(effect instanceof TriggerWhenAttackingEffect){
                result = effect.trigger(result);
            }
        }

        if(result.evaded){
            result.combatMessage = `\n - *${result.attacker.nickname} misses the attack !*`;
            result.damageTaken = 0;
            return result;
        }

        for(let effect of result.damagedCharacter.effects){
            if(effect instanceof TriggerWhenHitEffect){
                result = effect.trigger(result);
            }
        }

        if(result.damagedCharacter.resistances.find(x => x == damageType) && result.resistanceWasHit == false){
            result.damageTaken = result.damageTaken * 0.7;
            result.resistanceWasHit = true;
        }
        else if(result.damagedCharacter.weaknesses.find(x => x == damageType) && result.weaknessWasHit == false){
            result.damageTaken = result.damageTaken * 1.3;
            result.weaknessWasHit = true;
        }
        
        if(result.damagedCharacter.isDefending && (result.guarded == false)){
            result.damageTaken = result.damageTaken * 0.6;
            result.guarded = true;
        }
        else if(baseDamage <= 0){
            result.damageTaken = 1;
        }

        result.damageTaken = Math.round(result.damageTaken);

        if(result.damagedCharacter.stats.HP > 0){
            
            result.combatMessage += `Deals **${result.damageTaken}** ${damageType} damage to ${result.damagedCharacter.nickname}.`;
            result.damagedCharacter.stats.HP -= result.damageTaken;

            if(result.weaknessWasHit){
                result.combatMessage += `[${damageType} **WEAKNESS**]`;
            }
            else if(result.resistanceWasHit){
                result.combatMessage += `[${damageType} **RESIST**]`;
            }
            
            if(result.damagedCharacter.stats.HP <= 0 && result.damagedCharacter.isDefeated == false){
                let message = `\n - *${result.damagedCharacter.nickname} defeated !*`;
                result.combatMessage += message;
                result.wasDefeated = true;
                result.damagedCharacter.isDefeated = true;
            }
            else{
                for(let effect of result.damagedCharacter.effects){
                    if(effect instanceof CounterAttackEffect){
                        result = effect.trigger(result, this);
                    }
                }
            }
        }

        return result;
    }
}
