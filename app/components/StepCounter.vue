<template>
  <Page class="page">
    <ActionBar title="Schrittzähler">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

        <Button class='btn' text="Fitbit" @tap="addCounter('fitbit')" />
        <Button :class="[{ inactive: !isAndroid }, 'btn']" text="Google Fit" @tap="addCounter('googleFit')" />
        <Button :class="[{ inactive: isAndroid }, 'btn']" text="Apple Healthkit" @tap="addCounter('healthKit')" />

        <Button class='btn' text="weiter" @tap="changeRoute('main')" />

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

                // this array specifies which informations we need from healthKit / googleFit
                var types = [
                    {name: "height", accessType: "none"},
                    {name: "weight", accessType: "none"},
                    {name: "steps", accessType: "read"},
                    {name: "distance", accessType: "read"}
                ];

                // ask user for permission 
                if(this.hasHealth){
                  this.health.requestAuthorization(types)
                  .then(authorized => console.log("authorized: "authorized))
                  .catch(error => console.log("Request auth error: ", error));
                }
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
