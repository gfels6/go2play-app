<template>
  <Page class="page">
    <ActionBar title="Quiz">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

        <Button class='btn' text="Neues Spiel" @tap="changeRoute('newGame')" />

        <StackLayout orientation="horizontal" class="gameContainer">
            <Label class="lbl" :text="lblOpenGames" />
            <Label class="value" :text="'(' + openGames + ')'" />
        </StackLayout>

        <ListView for="game in games" @itemTap="onItemTap" separatorColor="transparent">
            <v-template>
            <label :text="game" class="listItem"/>
            </v-template>
        </ListView>

    </StackLayout>
  </Page>
</template>

<script>
    import BackendService from '@/services/BackendService';
    const backendService = new BackendService();

    export default {
        data() {
            return {
                lblOpenGames: "Offene Spiele",
                openGames: 0,
                games: [],
                gameId: "",
            };
        },
        name: 'quiz-view',
        methods: {
            changeRoute(to) {
                this.$navigateTo(this.$routes[to], {
                    props: {
                        gameId: this.gameId,
                    }
                });
            },
            loadGames() {
                backendService.getUser(localStorage.getItem('name'))
                .then(data => {
                    this.games = data.game;
                    this.openGames = data.game.length;
                })
            },
            onItemTap(event){
                console.log("You touched " + this.games[event.index] + " ;)");
                this.gameId = this.games[event.index];
                this.changeRoute('quizGame');
            },
        },
        mounted() {
            this.name = localStorage.getItem('name');
            this.loadGames();
        },
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

    .value {
        margin-left: 5;
        font-size: 18;
        color:black;
    }

    .listItem {
      margin-left: 20;
      padding: 10;
      font-size: 20;
      color: #53ba82;
    }

</style>