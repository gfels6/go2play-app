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

        <ScrollView orientation="vertical">
            <ListView class="itemContainer" for="game in openGames" @itemTap="onItemTap" separatorColor="transparent">
                <v-template>
                    <StackLayout orientation="vertical">
                        <label :text="game.user1 + ' - ' + game.user2 + '   Am Zug: ' + game.activeUser" class="listItem"/>
                    </StackLayout>
                </v-template>
            </ListView>
        </ScrollView>

        <StackLayout orientation="horizontal" class="gameContainer mt">
            <Label class="lbl" :text="lblFinishedGames" />
            <Label class="value" :text="'(' + countedFinishedGames + ')'" />
        </StackLayout>

        <ScrollView orientation="vertical">
            <ListView class="itemContainer" for="game in finishedGames" @itemTap="onItemTap" separatorColor="transparent">
                <v-template>
                    <StackLayout orientation="vertical">
                        <label :text="game.user1 + ' - ' + game.user2" class="listItem"/>
                    </StackLayout>
                </v-template>
            </ListView>
        </ScrollView>

       

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
                name: "",
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
                backendService.searchOpenGames(this.name)
                .then(data => {
                    this.openGames = data;
                    this.countedOpenGames = this.openGames.length;
                })

                backendService.searchFinishedGames(this.name)
                .then(data => {
                    this.finishedGames = data;
                    this.countedFinishedGames = this.finishedGames.length;
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
        font-weight: bold;
    }

    .value {
        margin-left: 5;
        font-size: 18;
        color:black;
        font-weight: bold;
    }

    .listItem {
        width: 90%;
        padding: 8;
        font-size: 16;
        background-color: #53ba82;
        color: #ffffff;
        border-radius: 5;
        border-width: 1;
        border-color: #42a972;
        margin-bottom: 2;
    }

    .itemContainer {
        margin-top: 7;
        height: 200;
    }

    .mt {
        margin-top: 15;
    }

</style>