import { ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType } from "discord.js";
import { Globals } from "../../globals";
import { ButtonBase } from "../base/ButtonBase";
import { ButtonType } from "../ButtonType";

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
      .setCustomId(ButtonType.ShowBattleStatus)
      .setLabel("Battle Status")
      .setStyle(ButtonStyle.Secondary);
    }
}    