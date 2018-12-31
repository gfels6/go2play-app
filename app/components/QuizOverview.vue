<template>
  <Page class="page">
    <ActionBar title="Spielübersicht">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

        <Label class="question" :text="tbd" textWrap="true" />

        <StackLayout orientation="horizontal" class="lblContainer">
            <Label class="lbl" :text="lblEnemy" />
            <Label class="value" :text="this.game.user2" />
        </StackLayout>

        <StackLayout orientation="horizontal" class="lblContainer">
            <Label class="lbl" :text="lblScoreUser" />
            <Label class="value" :text="scoreUser" />
        </StackLayout>

        <StackLayout orientation="horizontal" class="lblContainer">
            <Label class="lbl" :text="lblScoreEnemy" />
            <Label class="value" :text="scoreEnemy" />
        </StackLayout>

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
                tbd: "Hier werden die Spieldetails stehen (Überblick, Wer ist am gewinnen etc)",
                lblStatus: "",
                lblEnemy: "Dein Gegner: ",
                lblScoreUser: "Deine Punkte: ",
                lblScoreEnemy: "Punkte vom Gegner: ",
                lblWinning: "Gewonnen hat: ",
                enemy: "",
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
        },
        mounted() {
            for (var i = 0; i < this.game.rounds.length; i++) {
                console.log("PAIR " + i + ": " + this.game.rounds[i].roundNumber);
                for (let j = 0; j < this.game.rounds[i].gameQuestions.length; j++) {
                    console.log("question: " + this.game.rounds[i].gameQuestions[j].jntme);
                }
            }

            if(this.game.activeUser == "game finished"){
                this.finished = true;
                this.userWon = this.game.winner; 
            }

            if(this.game.activeUser == localStorage.getItem('name')){
                this.yourTurn = true;
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