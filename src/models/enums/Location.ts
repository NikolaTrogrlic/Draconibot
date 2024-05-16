export enum CombatLocation{
    Plains = "Plains",
    Desert = "Desert"
}

export function randomLocation(): CombatLocation{
    const rand = Math.floor(Math.random() * Object.keys(CombatLocation).length);
    const key = Object.keys(CombatLocation)[rand] as keyof typeof CombatLocation;
    return CombatLocation[key];
}