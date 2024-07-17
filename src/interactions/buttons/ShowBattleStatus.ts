import { ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType } from "discord.js";
import { Globals } from "../../globals";
import { ButtonBase } from "../base/ButtonBase";
import { ButtonName } from "../ButtonName";

export class ShowBattleStatus extends ButtonBase{

    needsPlayerExistance: boolean = true;
    canOnlyPerformOutsideBattle: boolean = false;
    canOnlyPerformOnOwnTurn: boolean = true;

   async execute(interaction: ButtonInteraction<CacheType>, globals: Globals, originInteractionID: string): Promise<any> {
       
    const player = globals.getPlayerById(interaction.user.id);
    const battle = globals.getPlayerBattle(player!);

    await interaction.update({fetchReply: false});
    await battle?.display.showCurrentBattleStatus(player!,...battle.turnOrder);
   }


   static button(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(ButtonName.ShowBattleStatus)
      .setLabel("Battle Status")
      .setStyle(ButtonStyle.Secondary);
    }
}    