<template>
  <Page class="page">
    <ActionBar title="Statistik">
      <NavigationButton @tap="goHome" text="Home" android.systemIcon="ic_menu_back" />
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">
      <Label class="lbl" :text="lblgamesTotal + gamesTotal" />
      <Label class="lbl" :text="lblgamesWon + gamesWon" />
      <Label class="lbl" :text="lblgamesLost + gamesLost" />
      <Label class="lbl" :text="lblgamesTie + gamesTie" />
    </StackLayout>
  </Page>
</template>

<script>
import BackendService from '@/services/BackendService';
const backendService = new BackendService();
import TomService from '@/services/TomService';
let help = null;

export default {
  data() {
    return {
      user: "",
      lblgamesTotal: "Anzahl beendete Spiele: ",
      lblgamesWon: "Gewonnen: ",
      lblgamesLost: "Verloren: ",
      lblgamesTie: "Unentschieden: ",
      gamesTotal: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesTie: 0,
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
    version     2019-01-08
    */
    tomTurnschuh(){
      let utterance = this.gamesLost == 0 ? "Respekt, " + this.user + " ! Du hast noch kein einziges Spiel verloren!" : "Hier siehst du, wie viele Spiele du bereits gewonnen und verloren hast."

      help.sayWithOptions(utterance + "\n\nMöchtest du noch mehr wissen?" ,["Ja, gerne", "Nein, danke"])
      .then(answer => {
        if(answer == "Ja, gerne"){
          help.sayWithOptions("Was denn?", ["Was bedeutet unentschieden?", "Wer ist der beste Spieler?", "Wie kann ich gegen dich spielen?", "Wer ist Eddy Verbruggen?"])
          .then(secondAnswer => {
            if(secondAnswer == "Was bedeutet unentschieden?")
              help.say("Das bedeutet, dass beide Spieler genau gleich viele Fragen richtig beantwortet haben.");
            if(secondAnswer == "Wer ist der beste Spieler?")
              help.say("Puh, da müsste ich nachschauen...");
              if(secondAnswer == "Wie kann ich gegen dich spielen?")
                help.say("Das willst du doch nicht? Ich kenne nämlich alle Antworten. ;-)");
            if(secondAnswer == "Wer ist Eddy Verbruggen?")
              help.say("Eddy ist der Entwickler zahlreicher toller Plugins. Ohne ihn könnte ich das hier so nicht sagen!");
          });
        }
        if(answer == "Nein, danke"){
          help.say("OK! Falls du doch noch Fragen hast, weisst du wo du mich findest. :)");
        }
      });
    },

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
  font-weight: bold;
}

</style>
