<template>
  <Page class="page">
    <ActionBar title="Spielübersicht">
      <NavigationButton @tap="goToQuiz" text="Quiz" android.systemIcon="ic_menu_back" />
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

      <Label class="heading" :text="this.user + '  ' + this.scoreUser + ':' + this.scoreEnemy + '  ' + this.enemy" />

      <Label class="titleLbl" text="Rundenstatistik" />
      <Label class="lbl" :text="lblRound1 + this.scoreUserR1 + ':' + this.scoreEnemyR1" />
      <Label class="lbl" :text="lblRound2 + this.scoreUserR2 + ':' + this.scoreEnemyR2" />
      <Label class="lbl" :text="lblRound3 + this.scoreUserR3 + ':' + this.scoreEnemyR3" />

      <StackLayout :class="[{ inactive: !finished }, 'lblContainer']" orientation="horizontal">
        <Label class="lbl" :text="lblWinning" />
        <Label class="value" :text="userWon" />
      </StackLayout>

      <Button :class="[{ inactive: !yourTurn }, 'btn']" text="Spielen" @tap="changeRoute('quizGame')" />
      <Button :class="[{ inactive: game.activeRound > 1 }, 'btn']" text="löschen" @tap="deleteThisGame()" />
      <Button class="btn" text="Home" @tap="changeRoute('main')" />

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
        lblWinning: "Gewinner: ",
        lblRound1: "Runde 1: ",
        lblRound2: "Runde 2: ",
        lblRound3: "Runde 3: ",
        // Name of the user (from local storage)
        user: "",
        // Name of the enemy
        enemy: "",
        // Points per round
        scoreUserR1: "x",
        scoreUserR2: "x",
        scoreUserR3: "x",
        scoreEnemyR1: "x",
        scoreEnemyR2: "x",
        scoreEnemyR3: "x",
        // Total tpoints
        scoreEnemy: 0,
        scoreUser: 0,
        userWon: "",
        // Shows if the game is finished or not
        finished: false,
        // Shows if its the user turn or not
        yourTurn: false,
        // Container for the game
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

      /*
      Another method to go to the quiz view,
      the clearHistory should be a parameter for the changeRoute method

      author      gfels6
      version     2019-01-08
      */
      goToQuiz(){
        this.$navigateTo(this.$routes['quiz'],{
          clearHistory: true,
        });
      },

      /*
      Checks who is the enemy (not clear from the dataset, just user1 and user2 in a game)

      author      gfels6
      version     2019-01-08
      */
      checkWhoIsTheEnemy(){
        if(this.game.user1 === this.user){
          this.enemy = this.game.user2;
        }
        else{
          this.enemy = this.game.user1;
        }
      },

      /*
      Looping through the game objects to get the scores.

      author      gfels6
      version     2019-01-08
      */
      evaluateGame(){
        for (var i = 0; i < this.game.activeRound; i++) {
          // Changing from x to 0 (it would be a NaN Error afterwards ;-))
          this["scoreEnemyR"+(i+1)] = 0;
          this["scoreUserR"+(i+1)] = 0;
          for (let j = 0; j < this.game.rounds[i].gameQuestions.length; j++) {
            /* Needed if you want to see every answer in detail
            this.totalAnswersUser.push(this.game.rounds[i].gameQuestions[j][this.user]);
            this.totalAnswersEnemy.push(this.game.rounds[i].gameQuestions[j][this.enemy]); */
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

        // Checks in the game object if the game is finished
        if(this.game.activeUser == "game finished"){
          this.finished = true;
          this.userWon = this.game.winner;
          
        }

        // Checks in the game object who is the activeUser
        if(this.game.activeUser == this.user){
          this.yourTurn = true;
        }
      },

      /*
      Request for the full game information

      parameters  gameId: ID for the specific game
      returns     game object with all information
      author      gfels6
      version     2019-01-08
      */
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
  }
  .titleLbl {
    margin-left: 25;
    margin-top: 20;
    font-size: 20;
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
