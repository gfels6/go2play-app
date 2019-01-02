<template>
  <Page class="page">
    <ActionBar title="Spielübersicht">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

        <Label class="heading" :text="this.you + '  ' + this.scoreUser + ':' + this.scoreEnemy + '  ' + this.enemy" />

        <StackLayout :class="[{ inactive: !finished }, 'lblContainer']" orientation="horizontal">
            <Label class="lbl" :text="lblWinning" />
            <Label class="value" :text="userWon" />
        </StackLayout>

        <Button :class="[{ inactive: !yourTurn }, 'btn']" text="Spielen" @tap="changeRoute('quizGame')" />

    </StackLayout>
  </Page>
</template>

<script>
    export default {
        data() {
            return {
                lblStatus: "",
                lblWinning: "Gewinner: ",
                you: "",
                enemy: "",
                totalAnswersYou: [],
                totalAnswersEnemy: [],
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
                this.$navigateTo(this.$routes[to], {
                    props: {
                        gameId: this.game.id,
                    }
                });
            },
            checkWhoIsTheEnemy(){
                if(this.game.user1 === this.you){
                    this.enemy = this.game.user2;
                }
                else{
                    this.enemy = this.game.user1;
                }
            },
            calculatePoints(){

            }
        },
        mounted() {
            this.you = localStorage.getItem('name');
            this.checkWhoIsTheEnemy();

            for (var i = 0; i < this.game.activeRound; i++) {
                for (let j = 0; j < this.game.rounds[i].gameQuestions.length; j++) {
                    this.totalAnswersYou.push(this.game.rounds[i].gameQuestions[j][this.you]);
                    this.totalAnswersEnemy.push(this.game.rounds[i].gameQuestions[j][this.enemy]);
                    if(this.game.rounds[i].gameQuestions[j][this.enemy] == 1){
                        this.scoreEnemy++;
                    }
                    if(this.game.rounds[i].gameQuestions[j][this.you] == 1){
                        this.scoreUser++;
                    }
                }
            }

            if(this.game.activeUser == "game finished"){
                this.finished = true;
                this.userWon = this.game.winner; 
            }

            if(this.game.activeUser == this.you){
                this.yourTurn = true;
            }

            this.calculatePoints();
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