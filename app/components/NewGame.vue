<template>
  <Page class="page">
    <ActionBar title="Neues Spiel">
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
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
import TomService from '@/services/TomService';
let help = null;

export default {
  data() {
    return {
      name: "",
      friends: [],
      lblFriends: "Aktuelle Freunde:",
      lblRandomEnemy: "Zufälliger Gegner",
      // an object wrapping the image path, so it can be passed to TomService
      tom: {
        img: "~/assets/images/tom.png",
        saidsomething: false,
        notif_text: ""
      }
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

    /*
    This function handles the push events on Tom Turnschuh Icon in the Actionbar

    parameters  none
    returns     nothing
    author      hessg1
    version     2019-01-08
    */
    tomTurnschuh(){
      help.say("Tippe auf \"zufälliger Gegner\", um gegen einen zufälligen Spieler zu quizzen, oder klicke auf den Namen eines Freundes, um ihn für ein Spiel herauszufordern.");
    },

    // Eventhandling for clicked friend
    onItemTap(event){
      console.log("You touched " + this.friends[event.index] + " ;)");
      this.addGame(this.friends[event.index])
    },

    /*
    This creates a game with the user and his clicked friend

    parameters  friendName: Name of the clicked friend
    returns     game object
    author      gfels6
    version     2019-01-08
    */
    addGame(friendName) {
      backendService.addGame(this.name, friendName)
      .then(data => {
        this.gameId = data.id;
        help.say("Ich habe eine Spieleinladung an " + friendName + " geschickt.\n\nWarte, bis du an der Reihe bist.");
        this.changeRoute('quiz');
      });
    },

    /*
    Loading of all friends from an user

    parameters  none
    returns     array with all friends
    author      gfels6
    version     2019-01-08
    */    
    loadFriends(){
      console.log("load friends");
      backendService.getUser(this.name)
      .then(user => {
        this.friends = user.friend;
      })
    },

    /*
    To get a random enemy, we request all users and select a random from the list
    Afterwards the game will be created

    parameters  none
    returns     array of all users
    author      gfels6
    version     2019-01-08
    */    
    getRandomEnemy() {
      console.log("Random Enemy!");
      backendService.getRandomUser(this.name)
      .then(users => {
        let number = Math.floor(Math.random() * users.length);
        this.addGame(users[number].name);
      })
    }
  },

  mounted() {
    this.name = localStorage.getItem('name');
    // initialize Tom Turnschuh
    help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);
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
