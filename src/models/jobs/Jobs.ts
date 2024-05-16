import { Job } from "./Job";
import { JobName } from "../enums/JobName";
import { Cleric } from "./Cleric";
import { Freelancer } from "./Freelancer";
import { Knight } from "./Knight";
import { Pyromancer } from "./Pyromancer";

export class Jobs {

    //Insert unlock levels here
    static jobUnlockLevels: Record<number, JobName[]> = {
      1 : [JobName.Freelancer, JobName.Knight, JobName.Cleric, JobName.Pyromancer],
      5 : [JobName.Gunslinger]
    }
  
    //Allocate 40% to stat modifiers.
    static makeJob(name: JobName): Job | undefined {
      switch (name) {
        case JobName.Freelancer: {
            return new Freelancer();
        }
        case JobName.Knight: {
          return new Knight();
        }
        case JobName.Pyromancer: {
          return new Pyromancer();
        }
        case JobName.Cleric: {
          return new Cleric();
        }
      }
    }
  
    //Fetches all jobs that should be unlocked for the specified level
    static getJobsForLevel(level: number): Job[] {
      let jobs: Job[] = [];
  
      if(level <= 0){
          level = 1;
      }
      
      for(let i = level;i > 0;i--){
          const jobNames = this.jobUnlockLevels[level];
          if(jobNames){
              for(const name of jobNames){
                  const job = this.makeJob(name); 
                  if(job){
                    jobs.push(job);
                  }
              }
          }
      }
  
      return jobs;
    }
  }
  