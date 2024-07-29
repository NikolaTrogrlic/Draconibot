import { CommandBase } from "./base/CommandBase";
import { CommandType } from "./CommandType";
import { SelectMenuBase } from "./base/SelectMenuBase";
import { SelectMenuType } from "./SelectMenuType";
import { MainJobSelect } from "./menus/MainJobSelect";
import { SubJobSelect } from "./menus/SubJobSelect";
import { PartyCommand } from "./commands/PartyCommand";
import { ButtonBase } from "./base/ButtonBase";
import { ButtonName } from "./ButtonName";
import { BattleAgain } from "./buttons/BattleAgain";
import { DeclineBattleAgain } from "./buttons/DeclineBattleAgain";
import { DeclineParty } from "./buttons/DeclineParty";
import { JoinParty } from "./buttons/JoinParty";
import { TargetButton } from "./buttons/TargetButton";
import { SkillButton } from "./buttons/SkillButton";
import { PlayCommand } from "./commands/PlayCommand";
import { QuestsMenu } from "./buttons/QuestsMenu";
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
import { ForwardButton } from "./buttons/directionButtons/ForwardButton";
import { BackwardButton } from "./buttons/directionButtons/BackwardButton";
import { SlimeExtermination } from "./buttons/quests/SlimeExtirmination";

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
	[ButtonName.BattleAgain]: new BattleAgain(),
   [ButtonName.DeclineBattleAgain]: new DeclineBattleAgain(),
   [ButtonName.DeclineParty]: new DeclineParty(),
   [ButtonName.JoinParty]: new JoinParty(),
   [ButtonName.QuestsMenu]: new QuestsMenu(),
   [ButtonName.ReturnToMenu]: new ReturnToMenu(),
   [ButtonName.JobsMenu]: new JobsMenu(),
   [ButtonName.SetJob]: new SetJob(),
   [ButtonName.SetSubjob]: new SetSubjob(),
   [ButtonName.SkillList]: new SkillList(),
   [ButtonName.EquipMenu]: new EquipMenu(),
   [ButtonName.SetPassives]: new SetPassives(),
   [ButtonName.ShowBattleStatus]: new ShowBattleStatus(),
   [ButtonName.ShowTurnDisplay]: new ShowTurnDisplay(),
   [ButtonName.Forward]: new ForwardButton(),
   [ButtonName.Backward]: new BackwardButton(),
   [ButtonName.SlimeExtermination]: new SlimeExtermination()
};

export const targetButton = new TargetButton();
export const skillButton = new SkillButton();