import { JobName } from "./models/enums/JobName";
import { Player } from "./models/Player";

export class Tests{

    static setMaxLevelMainJob(player:Player,job: JobName){
        let mainJob = player.jobs.find(x => x.name == job);
        if(mainJob){
          mainJob.level = 10;
          player.changeMainJob(mainJob.name);
        }
    }
}