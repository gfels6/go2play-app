import { AggregateBy, HealthData, HealthDataType } from "nativescript-health-data";
require( "nativescript-localstorage" );

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

    calculateSteps(steps) {
        console.log(steps);
    }

    checkForName() {
        let name = localStorage.getItem('name') || false;
        if(name != false){
        return true;
        } else {
        return false;
        }
    }


}