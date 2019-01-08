<template>
  <Page class="page">
    <ActionBar title="Spielübersicht">
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
    import * as application from "application";
    import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
    import { isAndroid } from "platform";
    const backendService = new BackendService()

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
            };
        },
        name: 'quizoverview-view',
        props: ['game'],
        methods: {
            changeRoute(to) {
                this.$navigateTo(this.$routes[to],{ 
                    clearHistory: true,
                    props: {
                        gameId: this.game.id,
                    },
                    
                });
            },
            checkWhoIsTheEnemy(){
                if(this.game.user1 === this.user){
                    this.enemy = this.game.user2;
                }
                else{
                    this.enemy = this.game.user1;
                }
            },

            // deletes this game
            deleteThisGame(){
              backendService.deleteGame(this.user, this.game.id)
              .then(res => {
                this.changeRoute('quiz');
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
        },
        mounted() {
            this.user = localStorage.getItem('name');
            this.checkWhoIsTheEnemy();

            for (var i = 0; i < this.game.activeRound; i++) {
                for (let j = 0; j < this.game.rounds[i].gameQuestions.length; j++) {
                    console.log(i);
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

            if (isAndroid) {
                application.android.on(AndroidApplication.activityBackPressedEvent, (AndroidActivityBackPressedEventData) => {
                    AndroidActivityBackPressedEventData.cancel = true; // prevents default back button behavior
                })
            }
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
