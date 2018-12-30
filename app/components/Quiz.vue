<template>
  <Page class="page">
    <ActionBar title="Quiz">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

        <Button class='btn' text="Neues Spiel" @tap="changeRoute('newGame')" />

        <StackLayout orientation="horizontal" class="gameContainer">
            <Label class="lbl" :text="lblOpenGames" />
            <Label class="value" :text="'(' + countedOpenGames + ')'" />
        </StackLayout>

        <ListView for="game in openGames" @itemTap="onItemTap" separatorColor="transparent">
            <v-template>
                <label :text="game.user1 + ' - ' + game.user2 + '   Am Zug: ' + game.activeUser" class="listItem"/>
            </v-template>
        </ListView>

        <StackLayout orientation="horizontal" class="gameContainer">
            <Label class="lbl" :text="lblFinishedGames" />
            <Label class="value" :text="'(' + countedFinishedGames + ')'" />
        </StackLayout>

        <ListView for="game in finishedGames" @itemTap="onItemTap" separatorColor="transparent">
            <v-template>
                <label :text="game.user1 + ' - ' + game.user2" class="listItem"/>
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
                lblFinishedGames: "Beendete Spiele",
                countedOpenGames: 0,
                countedFinishedGames: 0,
                finishedGames: [],
                openGames: [],
                game: "",
            };
        },
        name: 'quiz-view',
        methods: {
            changeRoute(to) {
                this.$navigateTo(this.$routes[to], {
                    props: {
                        game: this.game,
                    }
                });
            },
            loadGames() {
                backendService.searchOpenGames(localStorage.getItem('name'))
                .then(data => {
                    this.openGames = data;
                    this.countedOpenGames = this.openGames.length;
                    //this.openGames = data.game.length;
                })

                backendService.searchFinishedGames(localStorage.getItem('name'))
                .then(data => {
                    this.finishedGames = data;
                    this.countedFinishedGames = this.finishedGames.length;
                    //console.log(this.finishedGames[0].id);
                })
            },
            onItemTap(event){
                console.log("You touched " + event.item.id + " ;)");
                this.game = event.item;
                this.changeRoute('quizOverview');
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