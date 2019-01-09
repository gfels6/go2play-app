<template>
  <Page class="page">
    <ActionBar title="Spielübersicht">
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

      <Label class="heading" :text="this.user + '  ' + this.scoreUser + ':' + this.scoreEnemy + '  ' + this.enemy" />

      <StackLayout class="lblContainer" orientation="horizontal">
        <Label class="lbl" :text="lblRound1" />
        <Label class="value" :text="this.scoreUserR1 + ':' + this.scoreEnemyR1" />
      </StackLayout>

      <StackLayout class="lblContainer" orientation="horizontal">
        <Label class="lbl" :text="lblRound2" />
        <Label class="value" :text="this.scoreUserR2 + ':' + this.scoreEnemyR2" />
      </StackLayout>

      <StackLayout class="lblContainer" orientation="horizontal">
        <Label class="lbl" :text="lblRound3" />
        <Label class="value" :text="this.scoreUserR3 + ':' + this.scoreEnemyR3" />
      </StackLayout>

      <StackLayout :class="[{ inactive: !finished }, 'lblContainer']" orientation="horizontal">
        <Label class="lbl" :text="lblWinning" />
        <Label class="value" :text="userWon" />
      </StackLayout>

      <Button :class="[{ inactive: !yourTurn }, 'btn']" text="Spielen" @tap="changeRoute('quizGame')" />
      <Button :class="[{ inactive: game.activeRound > 1 }, 'btn']" text="löschen" @tap="deleteThisGame()" />

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
        lblStatus: "",
        lblWinning: "Gewinner: ",
        lblRound1: "Runde 1: ",
        lblRound2: "Runde 2: ",
        lblRound3: "Runde 3: ",
        user: "",
        enemy: "",
        totalAnswersUser: [],
        totalAnswersEnemy: [],
        scoreUserR1: 0,
        scoreUserR2: 0,
        scoreUserR3: 0,
        scoreEnemyR1: 0,
        scoreEnemyR2: 0,
        scoreEnemyR3: 0,
        scoreEnemy: 0,
        scoreUser: 0,
        userWon: "",
        finished: false,
        yourTurn: false,
        game: "",
        // an object wrapping the image path, so it can be passed to TomService
        tom: {
          img: "~/assets/images/tom.png",
          saidsomething: false,
          notif_text: ""
        }

      };
    },
    name: 'quizoverview-view',
    props: ['gameId'],
    methods: {
      changeRoute(to) {
        this.$navigateTo(this.$routes[to],{
          clearHistory: true,
          props: {
            gameId: this.game.id,
          },
        });
      },
      /*
      This function handles the push events on Tom Turnschuh Icon in the Actionbar

      parameters  none
      returns     nothing
      author      hessg1
      version     2019-01-08
      */
      tomTurnschuh(){
        if(this.finished){
          if(this.userWon==this.user){
            help.say("Dieses Spiel hast du gewonnen. Weiter so!");
          }
          else{
            help.say("Dieses Spiel ist beendet.");
          }
        }
        else{
          if(!this.yourTurn){
            help.say("Du bist nicht an der Reihe. Warte bis der Gegenspieler seine Fragen beantwortet hat.");
          }
          else{
            help.say("Klicke auf \"Spielen\", um die Fragen zu beantworten. \n\nWenn du genug Walker Coins hast, kannst du dir während dem Spiel Joker kaufen.\nZeit-Joker kannst du so viele kaufen, wie du dir leisten kannst\nDen 50:50-Joker kannst du nur einmal pro Runde einsetzen.\n\nWalker-Coins kannst du verdienen, indem du einen Schrittzähler installierst und dann dein tägliches Schrittziel erreichst.");
          }
        }
      },

      checkWhoIsTheEnemy(){
        if(this.game.user1 === this.user){
          this.enemy = this.game.user2;
        }
        else{
          this.enemy = this.game.user1;
        }
      },

      evaluateGame(){
        for (var i = 0; i < this.game.activeRound; i++) {
          for (let j = 0; j < this.game.rounds[i].gameQuestions.length; j++) {
            this.totalAnswersUser.push(this.game.rounds[i].gameQuestions[j][this.user]);
            this.totalAnswersEnemy.push(this.game.rounds[i].gameQuestions[j][this.enemy]);
            if(this.game.rounds[i].gameQuestions[j][this.enemy] == 1){
              this.scoreEnemy++;
              this["scoreEnemyR"+(i+1)]++;
            }
            if(this.game.rounds[i].gameQuestions[j][this.user] == 1){
              this.scoreUser++;
              this["scoreUserR"+(i+1)]++;
            }
          }
        }

        if(this.game.activeUser == "game finished"){
          this.finished = true;
          this.userWon = this.game.winner;
          
        }

        if(this.game.activeUser == this.user){
          this.yourTurn = true;
        }
      },

      getFullGame(gameId) {
        backendService.getGameInformation(gameId)
        .then(data => {
            this.game = data;
            this.checkWhoIsTheEnemy();
            this.evaluateGame();
        })
      },

      // deletes this game
      deleteThisGame(){
        confirm({
          title: "Bist du dir sicher?",
          message: "Wenn du das Spiel löschst, ist es weg.",
          okButtonText: "löschen",
          cancelButtonText: "abbrechen"
        })
        .then(choice =>{
          if(choice){
            backendService.deleteGame(this.user, this.game.id)
            .then(res => {
              this.changeRoute('main');
            })
            .catch(err => {
              // this is because the server responds with an empty body, that's not a proper error
              if(err = "TypeError: Network request failed: JSON Parse error: Unexpected EOF"){
                this.changeRoute('quiz');
              }
              else{
                console.log("error " + err);
              }
            });
          }
        });
      }
    },
    mounted() {
      this.user = localStorage.getItem('name');
      this.getFullGame(this.gameId);

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

  .heading {
    margin-top: 20;
    font-size: 28;
    color: #53ba82;
    font-weight: bold;
    horizontal-align: center;
  }

  .value {
    margin-left: 5;
    font-size: 18;
    color:black;
    font-weight: bold;
  }

  .inactive {
    visibility: collapsed;
  }

  </style>
