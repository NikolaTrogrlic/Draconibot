import { StringSelectMenuInteraction } from "discord.js";
import { IGameInteraction } from "./IGameInteraction";
import { Globals } from "../../globals";

export abstract class SelectMenuBase implements IGameInteraction{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   abstract onSelectionPerformed(interaction: StringSelectMenuInteraction, globals: Globals): Promise<any>

}