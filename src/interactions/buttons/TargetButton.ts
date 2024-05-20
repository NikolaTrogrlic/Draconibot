import { ButtonInteraction, ButtonStyle } from "discord.js";
import { Globals } from "../../globals";
import { IGameInteraction } from "../base/IGameInteraction";

export class TargetButton implements IGameInteraction{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = false;
   canOnlyPerformOnOwnTurn: boolean = true;

   async execute(interaction: ButtonInteraction, globals: Globals, target: number): Promise<any> {

      const player = globals.getPlayerById(interaction.user.id);
      const battle = globals.getPlayerBattle(player!);
      battle!.updateTarget(target)

      interaction.message.components.splice(0,1);
      await interaction.update({fetchReply: false, components: [battle!.getTargetingRow(), ...interaction.message.components]});
   }
}    