<template>
  <Page class="page">
    <ActionBar title="Neues Spiel">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

        <Button class='btn' :text="lblRandomEnemy" @tap="getRandomEnemy()" />

        <Label :text="lblFriends" textWrap="true" class="normalText" />
        <ListView for="friend in friends" @itemTap="onItemTap" separatorColor="transparent">
            <v-template>
            <label :text="friend" class="listItem"/>
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
                name: "",
                friends: [],
                friendName: "",
                lblFriends: "Aktuelle Freunde:",
                lblRandomEnemy: "Zufälliger Gegner",
            };
        },
        name: 'newgame-view',
        methods: {
            changeRoute(to) {
                // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to] 
                this.$navigateTo(this.$routes[to], {
                    props: {
                        gameId: this.gameId,
                    }
                });
            },
            onItemTap(event){
                console.log("You touched " + this.friends[event.index] + " ;)");
                this.friendName = this.friends[event.index];

                backendService.addGame(this.name, this.friendName)
                .then(data => {
                    console.log("successfully added Game!");
                    //console.log(data);
                    this.gameId = data.id;
                    console.log(this.gameId)
                    this.changeRoute('quizGame');
                });
            },
            loadFriends(){
                console.log("load friends");
                backendService.getUser(this.name)
                    .then(user => {
                    this.friends = user.friend;
                    })
            },
            getRandomEnemy() {
                console.log("Random Enemy!");
            }
        },

        mounted() {
            this.name = localStorage.getItem('name');
            this.loadFriends();
            console.log("page mounted, user: " + this.name);
        },


    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

      .normalText {
      text-align: left;
      margin: 15;
      font-size: 20;
      color:black;
  }

  .listItem {
      margin-left: 20;
      padding: 10;
      font-size: 20;
      color: #53ba82;
  }

</style>