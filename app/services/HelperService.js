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
      // check when the steps where last checked, or set this date to a week ago if it never was checked
      let since = localStorage.getItem('lastCheckedSteps') || new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
      console.log("get steps since last check");
      console.log("since: " + since);

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

      parameters  - steps: the number of steps
      returns     a promise with the number of coins
      author      hessg1
      version     2019-01-02
    */
    calculateCoins(steps){
      console.log("we are here and calculate for " + steps + " steps");

      return backendService.getUser('Gabriel')

      .then(data => {
        let dailygoal = 80 * data.mobility + 2000;
        console.log("your goal: " + dailygoal + " - your steps: " + steps);
        return Math.round((steps / dailygoal) * 100);
      })
      .catch(err => console.log(err));


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
