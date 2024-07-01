import { CommandBase } from "./base/CommandBase";
import { CommandType } from "./CommandType";
import { SelectMenuBase } from "./base/SelectMenuBase";
import { SelectMenuType } from "./SelectMenuType";
import { MainJobSelect } from "./menus/MainJobSelect";
import { SubJobSelect } from "./menus/SubJobSelect";
import { PartyCommand } from "./commands/PartyCommand";
import { ButtonBase } from "./base/ButtonBase";
import { ButtonType } from "./ButtonType";
import { BattleAgain } from "./buttons/BattleAgain";
import { DeclineBattleAgain } from "./buttons/DeclineBattleAgain";
import { DeclineParty } from "./buttons/DeclineParty";
import { JoinParty } from "./buttons/JoinParty";
import { TargetButton } from "./buttons/TargetButton";
import { SkillButton } from "./buttons/SkillButton";
import { PlayCommand } from "./commands/PlayCommand";
import { QuestsMenu } from "./buttons/QuestsMenu";
import { AdventureButton } from "./buttons/AdventureButton";
import { ReturnToMenu } from "./buttons/ReturnToMenu";
import { JobsMenu } from "./buttons/jobButtons/JobsMenu";
import { SetJob } from "./buttons/jobButtons/SetJob";
import { SetSubjob } from "./buttons/jobButtons/SetSubjob";
import { SkillList } from "./buttons/jobButtons/SkillList";
import { EquipMenu } from "./buttons/equipButtons/EquipMenu";
import { PassivesSelect } from "./menus/PassivesSelect";
import { SetPassives } from "./buttons/equipButtons/SetPassives";
import { LeaveCommand } from "./commands/LeaveCommand";
import { ShowBattleStatus } from "./buttons/ShowBattleStatus";
import { ShowTurnDisplay } from "./buttons/ShowTurnDisplay";

export const menus: { [key: string]: SelectMenuBase} = {
   [SelectMenuType.SetMainJobMenu] : new MainJobSelect(),
   [SelectMenuType.SetSubJobMenu] :  new SubJobSelect(),
   [SelectMenuType.SetPassivesMenu]: new PassivesSelect()
};

export const commands: { [key: string]: CommandBase} = {
   [CommandType.Party] : new PartyCommand(),
   [CommandType.Play] : new PlayCommand(),
   [CommandType.Leave]: new LeaveCommand()
};

//Excludes skill and targeting buttons
export const buttons: {[key: string]: ButtonBase} = {
	[ButtonType.BattleAgain]: new BattleAgain(),
   [ButtonType.DeclineBattleAgain]: new DeclineBattleAgain(),
   [ButtonType.DeclineParty]: new DeclineParty(),
   [ButtonType.JoinParty]: new JoinParty(),
   [ButtonType.QuestsMenu]: new QuestsMenu(),
   [ButtonType.Adventure]: new AdventureButton(),
   [ButtonType.ReturnToMenu]: new ReturnToMenu(),
   [ButtonType.JobsMenu]: new JobsMenu(),
   [ButtonType.SetJob]: new SetJob(),
   [ButtonType.SetSubjob]: new SetSubjob(),
   [ButtonType.SkillList]: new SkillList(),
   [ButtonType.EquipMenu]: new EquipMenu(),
   [ButtonType.SetPassives]: new SetPassives(),
   [ButtonType.ShowBattleStatus]: new ShowBattleStatus(),
   [ButtonType.ShowTurnDisplay]: new ShowTurnDisplay()
};

export const targetButton = new TargetButton();
export const skillButton = new SkillButton();