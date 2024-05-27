import { average } from "../../utils";
import { Combatant } from "../Combatant";
import { Player } from "../Player";
import { Monster } from "../monsters/Monster";

export function getPlayers(combatants: Combatant[]): Player[] {
   return combatants.filter(x => x instanceof Player).map(x => x as Player);
}

export function getMonsters(combatants: Combatant[]): Monster[] {
   return combatants.filter(x => x instanceof Monster).map(x => x as Monster);
}

export function getAverageMonsterLevel(combatants: Combatant[]) {
   return average(getMonsters(combatants).map(x => x.level));
}