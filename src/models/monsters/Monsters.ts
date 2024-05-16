import { Monster } from "./Monster";
import { Slime } from "./plains/Slime";
import { randomNumberFromOneTo, randomNumberFromZeroTo } from "../../utils";
import { CombatLocation } from "../enums/Location";
import { GoldenSlime } from "./plains/GoldenSlime";

export class Monsters{

    static createPlainsMonster(): Monster{
        
        const randomNumber = randomNumberFromZeroTo(10);

        switch(randomNumber){
            case 0:{
                return new GoldenSlime();
            }
            default:
                return new Slime();
        }
    }

    static createDesertMonster(): Monster{
        
        const randomNumber = randomNumberFromZeroTo(6);

        switch(randomNumber){
            case 0:{
                return new GoldenSlime();
            }
            default:
                return new Slime();
        }
    }

    static getLocationForLevel(number: number): CombatLocation{
        if(number < 5){
            return CombatLocation.Plains;
        }
        else{
            return CombatLocation.Desert;
        }
    }

    static getMonstersForLocation(location: CombatLocation): Monster[]{
        const randomNumber = randomNumberFromOneTo(3);
        console.log("Generating monsters:" + randomNumber)
        let monsters = [];

        for(let i=0;i < randomNumber;i++){

            switch(location){
                case CombatLocation.Plains:
                    monsters.push(this.createPlainsMonster());
                    break;
                case CombatLocation.Desert:
                    monsters.push(this.createDesertMonster());
                    break;
            }
        }
        return monsters;
    }
}