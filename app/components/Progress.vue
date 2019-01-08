<template>
  <Page class="page">
    <ActionBar title="Fortschritt">
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
            };
        },
        name: 'progress-view',
        methods: {
            changeRoute(to) {
                //this.$navigateTo(this.$routes[to]);
            },
            getAllFinishedGames() {
              backendService.getUser(this.user)
              .then(data => {
                this.evaluateMatches(data);
              })
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