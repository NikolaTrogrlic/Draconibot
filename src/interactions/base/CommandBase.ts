import { Globals } from "../../globals";
import { IGameInteraction } from "./IGameInteraction";

export abstract class CommandBase implements IGameInteraction{

   needsPlayerExistance: boolean = false;
   canOnlyPerformOutsideBattle: boolean = false;
   canOnlyPerformOnOwnTurn: boolean = false;

   abstract getSlashCommand(): any;
   abstract execute(interaction: any, globals: Globals): Promise<any>
}