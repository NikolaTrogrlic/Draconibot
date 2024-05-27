import { CommandBase } from "./base/CommandBase";
import { CommandType } from "./CommandType";
import { SelectMenuBase } from "./base/SelectMenuBase";
import { SelectMenuType } from "./SelectMenuType";
import { BattleCommand } from "./commands/BattleCommand";
import { MainJobSelect } from "./menus/MainJobSelect";
import { SubJobSelect } from "./menus/SubJobSelect";
import { JobCommand } from "./commands/JobCommand";
import { PartyCommand } from "./commands/PartyCommand";
import { StartCommand } from "./commands/StartCommand";
import { ButtonBase } from "./base/ButtonBase";
import { ButtonType } from "./ButtonType";
import { BattleAgain } from "./buttons/BattleAgain";
import { DeclineBattleAgain } from "./buttons/DeclineBattleAgain";
import { DeclineParty } from "./buttons/DeclineParty";
import { JoinParty } from "./buttons/JoinParty";
import { TargetButton } from "./buttons/TargetButton";
import { SkillButton } from "./buttons/SkillButton";
import { InfoCommand } from "./commands/InfoCommand";
import { SubJobCommand } from "./commands/SubJobCommand";

export const menus: { [key: string]: SelectMenuBase} = {
   [SelectMenuType.SetMainJobMenu] : new MainJobSelect(),
   [SelectMenuType.SetSubJobMenu] :  new SubJobSelect()
};

export const commands: { [key: string]: CommandBase} = {
   [CommandType.Battle] : new BattleCommand(),
   [CommandType.Job] : new JobCommand(),
   [CommandType.Party] : new PartyCommand(),
   [CommandType.Start] : new StartCommand(),
   [CommandType.Info] : new InfoCommand(),
   [CommandType.SubJob]: new SubJobCommand(),
};

//Excludes skill and targeting buttons
export const buttons: {[key: string]: ButtonBase} = {
	[ButtonType.BattleAgain]: new BattleAgain(),
   [ButtonType.DeclineBattleAgain]: new DeclineBattleAgain(),
   [ButtonType.DeclineParty]: new DeclineParty(),
   [ButtonType.JoinParty]: new JoinParty()
};

export const targetButton = new TargetButton();
export const skillButton = new SkillButton();