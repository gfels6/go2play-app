<template>
  <Page class="page">
    <ActionBar title="Statistik">
      <NavigationButton @tap="goHome" text="Home" android.systemIcon="ic_menu_back" />
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">
      <Label class="titleLbl" text="Spielstatistik" />
      <Label class="lbl" :text="lblgamesTotal + gamesTotal" />
      <Label class="lbl" :text="lblgamesWon + gamesWon" />
      <Label class="lbl" :text="lblgamesLost + gamesLost" />
      <Label class="lbl" :text="lblgamesTie + gamesTie" />

      <Label class="titleLbl" text="Bewegungsstatistik" />
      <Label class="lbl" :text="lblGoal + goal + '.'" textWrap="true"/>
      <Label class="lbl" :text="lblTotalSteps + sinceDate + ': ' + totalSteps" textWrap="true"/>
      <Label class="lbl" :text="lblAvgSteps + avgSteps" textWrap="true"/>
    </StackLayout>
  </Page>
</template>

<script>
import BackendService from '@/services/BackendService';
import HelperService from '@/services/HelperService'
const backendService = new BackendService();
const helperService = new HelperService();
import TomService from '@/services/TomService';
let help = null;

export default {
  data() {
    return {
      // Name of the user
      user: "",
      lblgamesTotal: "Anzahl beendete Spiele: ",
      lblgamesWon: "Gewonnen: ",
      lblgamesLost: "Verloren: ",
      lblgamesTie: "Unentschieden: ",
      // Scores of the games (win, lost, tie etc.)
      gamesTotal: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesTie: 0,
      lblGoal: "Dein tägliches Schrittziel ist ",
      goal: 0,
      lblTotalSteps: "Schritte seit dem ",
      sinceDate: "Beginn",
      totalSteps: 0,
      lblAvgSteps: "Schritte pro Tag: ",
      avgSteps: 0,
      // an object wrapping the image path, so it can be passed to TomService
      tom: {
        img: "~/assets/images/tom.png",
        saidsomething: false,
        notif_text: ""
      }

    };
  },
  name: 'progress-view',
  methods: {
    getAllFinishedGames() {
      backendService.getUser(this.user)
      .then(data => {
        this.evaluateMatches(data);
      })
    },
    // navigates to the main screen
    goHome(){
      this.$navigateTo(this.$routes['main'],{ clearHistory: true });
    },

    /*
    This function handles the push events on Tom Turnschuh Icon in the Actionbar

    parameters  none
    returns     nothing
    author      hessg1
    version     2019-01-09
    */
    tomTurnschuh(){
      let utterance = (this.gamesLost == 0 && this.gamesTotal > 0) ? "Respekt, " + this.user + " ! Du hast noch kein einziges Spiel verloren!" : "Hier siehst du, wie viele Spiele du bereits gewonnen und verloren hast."

      var questions = ["Wie kann ich das Schrittziel ändern?", "Was bedeutet unentschieden?"];
      if(this.totalSteps == 0) questions.push("Die Bewegungsstatistik wird nicht angezeigt.")
      if(this.gamesTotal == 0) questions.push("Die Spielstatistik wird nicht angezeigt.");
      questions.push("Eigentlich etwas anderes...");

      help.sayWithOptions(utterance + "\n\nWas möchtest du wissen?" ,questions)
      .then(answer => {
        if(answer == "Eigentlich etwas anderes..."){
          help.sayWithOptions("Was denn?", ["Wer ist der beste Spieler?", "Wie kann ich gegen dich spielen?", "Wer ist Eddy Verbruggen?"])
          .then(secondAnswer => {
            if(secondAnswer == "Wer ist der beste Spieler?")
              help.say("Puh, da müsste ich nachschauen...");
              if(secondAnswer == "Wie kann ich gegen dich spielen?")
                help.say("Das willst du doch nicht? Ich kenne nämlich alle Antworten. ;-)");
            if(secondAnswer == "Wer ist Eddy Verbruggen?")
              help.say("Eddy ist der Entwickler zahlreicher toller Plugins. Ohne ihn könnte ich das hier so nicht sagen!");
          });
        };
        if(answer == "Wie kann ich das Schrittziel ändern?")
          help.say("Das tägliche Schrittziel wird an deine Mobilität angepasst automatisch berechnet.\nUm es zu ändern, kannst du in den Einstellungen dein Mobilitätslevel anpassen.\n\nAber vorsicht: Ich merke, wenn du versuchst zu schummeln!");
          if(answer == "Die Bewegungsstatistik wird nicht angezeigt.")
            help.say("Verbinde in den Einstellungen einen Schrittzähler, damit ich eine Statistik über deine Bewegungen erstellen kann.");
          if(answer == "Die Spielstatistik wird nicht angezeigt.")
            help.say("Du hast noch kein Spiel fertig gespielt. So kann ich noch keine Statistik erstellen.");
          if(answer == "Was bedeutet unentschieden?")
          help.say("Das bedeutet, dass beide Spieler genau gleich viele Fragen richtig beantwortet haben.");
      });
    },

    /*
    This function calculates the values for the step statistics

    parameters  none
    returns     nothing (sets sinceDate, avgSteps and totalSteps properties)
    author      hessg1
    version     2019-01-09
    */
    calculateStepStatictics(){
      // calculate step goal
      backendService.getUser(this.user)
      .then(data => {this.goal = helperService.calculateGoal(data.mobility);});

      //
      var log = localStorage.getItem('stepsLog');
      console.log(log)
      if(log != null){
        var since = new Date(log[0].date);
        this.sinceDate = since.getDay() + '.' + (since.getMonth()+1) + '.' + since.getFullYear();

        // calculate total steps
        for(var i = 1; i < log.length; i++){ // intentionally not starting with 0, so we don't count the steps before first initialisation of app
          this.totalSteps = this.totalSteps + log[i].steps;
        }

        //calculate average steps
        var diff = (new Date() - since) / 1000 / 24 / 60 / 60; // difference in full days
        this.avgSteps = (diff<1)? this.totalSteps : Math.round(this.totalSteps / diff); // if we are on the first day, we just display the steps of today
    }
    },

    /*
    Calculates the array with all the matches from the user and evaluates them

    parameters  userData: Array with all the finished matches
    returns     nothing
    author      gfels6
    version     2019-01-09
    */
    evaluateMatches(userData){
      this.gamesTotal = userData.matches.length;
      for (let i = 0; i < userData.matches.length; i++) {
        if (userData.matches[i].result == "won") {
          this.gamesWon++;
        } else if (userData.matches[i].result == "lost") {
          this.gamesLost++;
        } else if (userData.matches[i].result == "drawn") {
          this.gamesTie++;
        }
      }
    }
  },
  mounted() {
    this.user = localStorage.getItem('name');

    this.calculateStepStatictics();

    this.getAllFinishedGames();
    // initialize Tom Turnschuh
    help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);

  }
}
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.lbl {
  margin-left: 25;
  font-size: 18;
  color:black;
}
.titleLbl {
  margin-left: 25;
  margin-top: 20;
  font-size: 20;
  color:black;
  font-weight: bold;
}

</style>
