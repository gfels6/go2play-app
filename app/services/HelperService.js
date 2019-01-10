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
    This method calculates if the set mobility score is adequate or should be adjusted.
    If the step goal was surpassed every day of the last five days by factor of 2,
    a proposed new goal is returned.

    parameters  - the current mobility score
    returns     - a promise with a suggested goal
                  - the current goal if is adequate
                  - an adequate goal, if old goal was not adequate
    author      hessg1
    version     2019-01-10
    */
    checkMobilityAdequacy(mobility){
      var goal = this.calculateGoal(mobility); // calculate the current goal
      return health.query( // load step data from last days
        {
          startDate: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000), // 3 days ago
          endDate: new Date(), // now
          dataType: "steps", // equal to the 'name' property of 'HealthDataType'
          unit: "count", // make sure this is compatible with the 'dataType' (see below)
          aggregateBy: "day", // optional, one of: "hour", "day", "sourceAndDay"
        })
        .then(steps => {
          var total = 0;
          var overachieved = 0;
          // iterate through last three days (last is today and not complete)
          for(var i = 1; i < steps.length-1; i++){
            total = total + steps[i].value;
            // if we had more than double the steps of the goal, we add the overachieved counter
            if(steps[i].value > (goal * 2)) {
              overachieved++;
            }
          }
          var avg = total / 3; // calculate average
          // if every day was overachieved, calculate new goal
          var newMobility = Math.round((overachieved = 3) ? ((avg - 2000)/80) : ((goal - 2000)/80));
          //return the value (max. 100)
          return (newMobility > 100) ? 100 : newMobility;
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
