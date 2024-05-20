import { ButtonInteraction } from "discord.js";
import { Globals } from "../../globals";
import { IGameInteraction } from "./IGameInteraction";

export abstract class ButtonBase implements IGameInteraction{

    needsPlayerExistance: boolean = false;
    canOnlyPerformOutsideBattle: boolean = false;
    canOnlyPerformOnOwnTurn: boolean = false;

    abstract execute(interaction: ButtonInteraction, globals: Globals, originInteractionID: string): Promise<any>;
}
