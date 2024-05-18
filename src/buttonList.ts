import { BattleAgain } from "./buttons/BattleAgain";
import { ButtonBase } from "./buttons/ButtonBase";
import { DeclineBattleAgain } from "./buttons/DeclineBattleAgain";
import { DeclineParty } from "./buttons/DeclineParty";
import { JoinParty } from "./buttons/JoinParty";

export const buttons: ButtonBase[] = [
	new DeclineParty(),
	new JoinParty(),
	new BattleAgain(),
	new DeclineBattleAgain(),
];