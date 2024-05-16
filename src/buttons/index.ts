import { DeclineParty } from "./DeclineParty";
import { JoinParty } from "./JoinParty";
import { ButtonBase } from "./ButtonBase";
import { BattleAgain } from "./BattleAgain";
import { DeclineBattleAgain } from "./DeclineBattleAgain";

export const buttons: ButtonBase[] = [
  new DeclineParty(),
  new JoinParty(),
  new BattleAgain(),
  new DeclineBattleAgain(),
]