import { AggregateBy, HealthData, HealthDataType } from "nativescript-health-data";
require( "nativescript-localstorage" );

import BackendService from '@/services/BackendService';
const backendService = new BackendService();

let health = new HealthData();


export default class HelperService {

    getSteps() {
        return health.query(
            {
            startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            endDate: new Date(), // now
            dataType: "steps", // equal to the 'name' property of 'HealthDataType'
            unit: "count", // make sure this is compatible with the 'dataType' (see below)
            aggregateBy: "day", // optional, one of: "hour", "day", "sourceAndDay"
            sortOrder: "desc" // optional, default "asc"
            })
            .then(result => {
                console.log(JSON.stringify(result));
                this.calculateSteps(result[0].value)
                return result;
            })
            .catch(error => this.resultToShow = error);
      }


      /*
        Calculates the amount of steps since the last time this calculation was done.


        parameters  none
        returns     a promise with the number of steps
        author      hessg1
        version     2019-01-02
      */
    getStepsSinceLastCheck(){
      // check when the steps where last checked, or set this date to five days ago if it never was checked
      let since = localStorage.getItem('lastCheckedSteps') || new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000);

      return health.query(
          {
          startDate: new Date(since),
          endDate: new Date(), // now
          dataType: "steps", // equal to the 'name' property of 'HealthDataType'
          unit: "count", // make sure this is compatible with the 'dataType' (see below)
          sortOrder: "desc" // optional, default "asc"
          })
          .then(result => {
              // set last checked date to now, since we just checked
              localStorage.setItem('lastCheckedSteps', new Date());
              let totalsteps = 0;
              for(let i = 0; i < result.length; i++){
                totalsteps = totalsteps + result[i].value;
              }
              return totalsteps;
          })
          .catch(error => console.log(error));



    }

    calculateSteps(steps) {
        localStorage.setItem('steps', steps);
    }


    /*
      Calculates the value in coins of a certain number of steps, considering the users mobility.
      As of now, the calculation is done with a linear function.

      TODO: implement a non-linear number, that constrains the maximum number of coins one can collect in one day
      (workaround: limited the maximum number of coins to 500 per calculation)

      parameters  - steps: the number of steps
      returns     a promise with the number of coins
      author      hessg1
      version     2019-01-03
    */
    calculateCoins(steps){


      return backendService.getUser(localStorage.getItem('name'))
      .then(data => {
        let dailygoal = this.calculateGoal(data.mobility);
        dailygoal = dailygoal > 0 ? dailygoal : 2000; // so we don't run into division by zero if mobility couldn't be loaded
        steps = steps === undefined ? 0 : steps
        let coins = Math.round((steps / dailygoal) * 100);
        // limit number of coins aquired in one round to 500
        coins = coins > 500 ? 500 : coins;
        return coins;
      })
      .catch(err => console.log(err));


    }

    /*
      Calculates the daily step goal, depending on the mobility of an user

      parameters  - fitness: the mobility (0-100)
      returns     - the daily goal for the given mobility (2000-10000)
      author      hessg1
      version     2019-01-09
    */
    calculateGoal(fitness){
      return 80 * fitness + 2000;
    }

    /*
      Does some funny things with TRUEs and FALSEs.
    */
    checkForName() {
        let name = localStorage.getItem('name') || false;
        if(name != false){
          return true;
        } else {
          return false;
        }
    }


}
