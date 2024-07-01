import { ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType } from "discord.js";
import { Globals } from "../../globals";
import { ButtonBase } from "../base/ButtonBase";
import { ButtonType } from "../ButtonType";

export class ShowTurnDisplay extends ButtonBase{

    needsPlayerExistance: boolean = true;
    canOnlyPerformOutsideBattle: boolean = false;
    canOnlyPerformOnOwnTurn: boolean = true;

   async execute(interaction: ButtonInteraction<CacheType>, globals: Globals, originInteractionID: string): Promise<any> {
       
    const player = globals.getPlayerById(interaction.user.id);
    const battle = globals.getPlayerBattle(player!);

    await interaction.update({fetchReply: false});
    await battle?.display.showPlayerTurn(player!, battle.players, battle.monsters, battle.currentTarget);
   }


   static button(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(ButtonType.ShowTurnDisplay)
      .setLabel("Return")
      .setStyle(ButtonStyle.Secondary);
    }
}    