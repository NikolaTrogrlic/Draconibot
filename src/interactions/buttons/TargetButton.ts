import { ButtonInteraction, ButtonStyle } from "discord.js";
import { Globals } from "../../globals";
import { IGameInteraction } from "../base/IGameInteraction";

export class TargetButton implements IGameInteraction{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = false;
   canOnlyPerformOnOwnTurn: boolean = true;

   async execute(interaction: ButtonInteraction, globals: Globals, targetString: string): Promise<any> {

      let target = Number(targetString);
      const player = globals.getPlayerById(interaction.user.id);
      const battle = globals.getPlayerBattle(player!);
      battle!.currentTarget = target;

      interaction.message.components.splice(0,1);
      await interaction.update({fetchReply: false, components: [battle!.display.getTargetingRow(battle!.monsters, battle!.currentTarget), ...interaction.message.components]});
   }
}    