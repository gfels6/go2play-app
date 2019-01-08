<template>
  <Page class="page">
    <ActionBar title="Hauptmenü">
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
  </ActionBar>
  <StackLayout orientation="vertical" class="page-content">
    <StackLayout orientation="horizontal" class="container">
      <StackLayout orientation="horizontal" class="steps">
        <Label class="title left" :text="lblSteps" />
        <Label class="title value" :text="steps" />
      </StackLayout>
      <StackLayout orientation="horizontal" class="coins">
        <Label class="title right" :text="lblWalkerCoins" />
        <Label class="title value" :text="walkerCoins" />
      </StackLayout>
    </StackLayout>

    <Button class='btn' text="Quiz" @tap="changeRoute('quiz')" />
    <Button class='btn' text="Freunde" @tap="changeRoute('friends')" />
    <Button class='btn' text="Statistik" @tap="changeRoute('progress')" />
    <Button class='btn' text="Einstellungen" @tap="changeRoute('settings')" />

  </StackLayout>
</Page>
</template>

<script>

import BackendService from '@/services/BackendService'
import HelperService from '@/services/HelperService'
import TomService from '@/services/TomService'
import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";
let help = null;
const backendService = new BackendService()
const helperService = new HelperService()


export default {
  data() {
    return {
      lblSteps: "Schritte:",
      lblWalkerCoins: "Walker Coins:",
      walkerCoins: 0,
      steps: 0,
      // an object wrapping the image path, so it can be passed to TomService
      tom: {
        img: "~/assets/images/tom.png",
        saidsomething: false,
        notif_text: ""
      }
    };
  },
  name: 'main-view',
  methods: {
    changeRoute(to) {
      // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to]
      this.$navigateTo(this.$routes[to]);
    },

    /*
    This function handles the push events on Tom Turnschuh Icon in the Actionbar

    parameters  none
    returns     nothing
    author      hessg1
    version     2019-01-07
    */
    tomTurnschuh(){
      help.sayWithOptions("Was möchtest du wissen?", ["Was sind Walker Coins?", "Wie bekomme ich Walker Coins?", "Wie kann ich spielen?", "Wie funktionieren die Joker?", "Wer ist dieser Tom Turnschuh?"])
      .then(question => {
        if(question == "Was sind Walker Coins?"){
          help.say("Walker Coins sind die Währung in diesem Spiel.\nDu kannst sie ganz einfach verdienen, indem du täglich Schritte gehst.\n\nVerbinde dazu in den Einstellungen einen Schrittzähler.")
        }
        if(question == "Wie bekomme ich Walker Coins?"){
          help.say('Damit du Walker Coins bekommst, musst du dich bewegen. So kannst du pro Tag bis zu 500 Coins verdienen!\n\nWie viele Coins du bekommst, hängt von der Anzahl Schritte und deinem Mobilitätslevel ab.\n\nDamit ich erfassen kann, wie viele Schritte du gegangen bist, musst du unter "Einstellungen" einen Schrittzähler verbinden.')
        }
        if(question == "Wie kann ich spielen?"){
          help.say("Unter \"Quiz\" kannst du Freunde herausfordern, oder ein Spiel gegen einen zufälligen Gegner starten.");
        }
        if(question == "Wie funktionieren die Joker?"){
          help.say("Im Quiz kannst du mit deinen Walker Coins Joker kaufen.\n\nDer Zeit-Joker gibt dir zusätzliche Zeit, um die Frage zu beantworten. Du kannst ihn so oft verwenden wie du willst - aber jedes Mal kostet 25 Walker Coins!\n\nDer 50:50 Joker blendet zwei falsche Antworten aus. Er kostet 50 Coins, aber du kannst ihn nur einmal pro Runde benutzen.");
        }
        if(question == "Wer ist dieser Tom Turnschuh?"){
          help.say("Tom Turnschuh? Das bin ich. Immer wenn du Hilfe brauchst, findest du mich oben rechts auf dem Bildschirm.\n\nÜbrigens: Wenn du meine Nachrichten ausblenden willst, kannst du sie einfach antippen. ;-)");
        }
      });
    }
  },
  mounted() {

    if (isAndroid) {
      application.android.on(AndroidApplication.activityBackPressedEvent, (AndroidActivityBackPressedEventData) => {
        AndroidActivityBackPressedEventData.cancel = false; // reactivate default back button behavior
      })
    }

    // initialize Tom Turnschuh
    help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);

    // load walkerCoins from server
    backendService.getUser(localStorage.getItem('name'))
    .then(data => {
      this.walkerCoins = data.walkerCoins;
    })

    // check if we already connected a step counter
    if(localStorage.getItem('connected')){
      // this calls the steps since last check and
      // calculates how much walkerCoins are earned by walking
      helperService.getStepsSinceLastCheck()
      .then(steps => helperService.calculateCoins(steps))
      .then(coins => {
        this.walkerCoins = this.walkerCoins + coins;
        backendService.updateParameter(localStorage.getItem('name'),'walkerCoins',this.walkerCoins);

        if(coins > 1){
          help.say("Wow!\nSeit du die App das letzte Mal geöffnet hast, hast du mit deinen Schritten " + coins + " Walker Coins verdient!\n\nDu hast insgesamt " + this.walkerCoins + " Walker Coins.\nDamit kannst du im Quiz Joker kaufen.");
        }
      });
    }

    // this calculates the steps of this day
    let localSteps = localStorage.getItem('steps');
    if(localSteps === null) {
      this.steps = 0;
    } else {
      this.steps = localSteps;
    }
  },
}
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.container {
  margin: 10, 15, 10, 20;
}

.title {
  font-size: 16;
  color:black;
}

.value {
  margin-left: 4;
}

.steps {
  width: 48%;
}

.coins {
  width: 48%;
  horizontal-align: right;
}
</style>
