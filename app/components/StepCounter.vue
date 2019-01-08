<template>
  <Page class="page">
    <ActionBar title="Schrittzähler">
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">
      <Button :class="[{ inactive: !isAndroid }, 'btn']" :text="androidBtn" @tap="addCounter('googleFit')" />
      <Button :class="[{ inactive: isAndroid }, 'btn']" :text="iosBtn" @tap="addCounter('healthKit')" />
      <Button class='btn' text="OK" @tap="changeRoute('main')" />
    </StackLayout>
  </Page>
</template>

<script>

import * as platformModule from 'tns-core-modules/platform';
import { isAndroid } from "platform";
var utilityModule = require("utils/utils");
import { AggregateBy, HealthData, HealthDataType } from "nativescript-health-data";
import HelperService from '@/services/HelperService';
const helperService = new HelperService();
import TomService from '@/services/TomService';
let help = null;

export default {
  data() {
    return {
      isAndroid: platformModule.isAndroid,
      health: "",
      hasHealth: false,
      stepObjects: "test",
      steps: "0",
      // check if a stepcounter is connected and adjust button-text accordingly
      androidBtn: localStorage.getItem('connected') ? "Google Fit (verbunden)" : "Google Fit verbinden",
      iosBtn: localStorage.getItem('connected') ? "HealthKit (verbunden)" : "Health Kit verbinden",
      // an object wrapping the image path, so it can be passed to TomService
      tom: {
        img: "~/assets/images/tom.png",
        saidsomething: false,
        notif_text: ""
      }
    };
  },
  name: 'stepCounter-view',
  methods: {
    changeRoute(to) {
      this.$navigateTo(this.$routes[to]);
    },
    /*
    This function handles the push events on Tom Turnschuh Icon in the Actionbar

    parameters  none
    returns     nothing
    author      hessg1
    version     2019-01-08
    */
    tomTurnschuh(){
      if (isAndroid) {
        help.sayWithOptions("Verbinde Google Fit, um deine Schritte zu zählen.\nDamit kann ich berechnen, wie viele WalkerCoins du verdient hast.\n\nWenn du das nicht bereits getan hast, musst du Google Fit installieren.", ["Was ist Google Fit?", "Wo finde ich Google Fit?"])
        .then(answer => {
          if(answer == "Was ist Google Fit?"){
            help.say("Google Fit ist ein Programm, mit dem du einen eingebauten Schrittzähler deines Smartphones nutzen kannst.\nDu kannst aber auch einen speziellen Schrittzähler, wie zum Beispiel ein FitBit mit Google Health verbinden");
          }
          if(answer == "Wo finde ich Google Fit?"){
            help.sayWithOptions("Du findest Google Fit im Play Store. Soll ich dich weiterleiten?", ["Ja, gerne", "Nein, danke"])
            .then(answer2 => {
              if(answer2 == "Ja, gerne"){
                utilityModule.openUrl('https://play.google.com/store/apps/details?id=com.google.android.apps.fitness');
              }
            })
          }
        });
      }
      else{
        help.say("Verbinde HealthKit, um deine Schritte zu zählen.\nDamit kann ich berechnen, wie viele WalkerCoins du verdient hast.");
      }
    },

    /*
    Adds the systems stepcounter (google fit on Android, HealthKit on iOS)
    parameters  none
    returns     nothing
    author      gfels6, hessg1
    version     2019-01-02
    */
    addCounter(counter) {

      this.health = new HealthData();
      this.health.isAvailable(false)
      .then(available => {
        this.hasHealth = available;
      });

      // ask user for permission
      if(this.hasHealth){
        this.health.requestAuthorization([{name: "steps", accessType: "read"}])
        .then(authorized => console.log("authorized: " + authorized))
        .catch(error => console.log("Request auth error: ", error));
      }
      localStorage.setItem('connected',true);
      this.androidBtn = "verbunden";
      this.iosBtn = "verbunden";
      helperService.getSteps()
      .then(result => {
        this.stepObjects = result;
        this.steps = this.stepObjects[0].value;
      })
    }
  },

mounted() {
  // initialize Tom Turnschuh
  help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);
  help.notify(3000);
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
