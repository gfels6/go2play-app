<template>
  <Page class="page">
    <ActionBar title="Schrittzähler">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

        <Button class='btn' text="Fitbit" @tap="addCounter('fitbit')" />
        <Button :class="[{ inactive: !isAndroid }, 'btn']" text="Google Fit" @tap="addCounter('googleFit')" />
        <Button :class="[{ inactive: isAndroid }, 'btn']" text="Apple Healthkit" @tap="addCounter('healthKit')" />

        <Button class='btn' text="weiter" @tap="changeRoute('main')" />

        <Label class="lbl" :text="stepObjects" />
        <Label class="lbl" :text="'Heutige Schritte: ' + steps" />

    </StackLayout>
  </Page>
</template>

<script>
/* TODO:
     - FitBit anschliessen
     - Google Fit anschliessen
     - Apple Healthkit anschliessen
     - Button "leuchten" wenn angeschlossen (oder sonst wie umsetzen)
     - Design Button "Weiter" weiter unten
*/

import * as platformModule from 'tns-core-modules/platform'
import { AggregateBy, HealthData, HealthDataType } from "nativescript-health-data";


    export default {
        data() {
            return {
                isAndroid: platformModule.isAndroid,
                health: "",
                hasHealth: false,
                stepObjects: "test",
                steps: "0",
            };
        },
        name: 'stepCounter-view',
        methods: {
            changeRoute(to) {
                // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to]
                this.$navigateTo(this.$routes[to]);
            },
            addCounter(counter) {
            console.log("Wanna add: " + counter);
                //
                this.health = new HealthData();
                this.health.isAvailable(false)
                  .then(available => {
                    this.hasHealth = available;
                    console.log(counter + " is available: " + available);
                  });

                // ask user for permission 
                if(this.hasHealth){
                  this.health.requestAuthorization([{name: "steps", accessType: "read"}])
                  .then(authorized => console.log("authorized: " + authorized))
                  .catch(error => console.log("Request auth error: ", error));
                }

                this.health.query(
                {
                startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                endDate: new Date(), // now
                dataType: "steps", // equal to the 'name' property of 'HealthDataType'
                unit: "count", // make sure this is compatible with the 'dataType' (see below)
                aggregateBy: "day", // optional, one of: "hour", "day", "sourceAndDay"
                sortOrder: "desc" // optional, default "asc"
                })
                .then(result => {
                    this.stepObjects = result;
                    console.log(JSON.stringify(result));
                    this.steps = this.stepObjects[0].value;
                })
                .catch(error => this.resultToShow = error);
            },

        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .inactive {
        visibility: collapsed;
    }

</style>
