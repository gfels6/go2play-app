<template>
  <Page class="page">
    <ActionBar :title="friendName">
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
    </ActionBar>

    <StackLayout orientation="vertical" class="page-content">
      <Label :text="friendName + ' schätzt seine Fitness mit ' + friendMobility + '% ein,  hat ' + friendGames.length + ' Spiele und ' + friendWalkerCoins + ' Walker Coins.\nWow!'" class="normalText" textWrap="true"/>
      <Button class='btn' :text="friendName + ' herausfordern!'" @tap="addGame()" />
      <Button class='btn' text="löschen" @tap="deleteFriend()" />
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
          friendGames: "",
          friendWalkerCoins: 0,
          friendGender: "do not assume",
          friendMobility: 0,
          stupidComment: false,
          tom: {
            img: "~/assets/images/tom.png",
            saidsomething: false,
            notif_text: ""
          }

        };
      },
      name: 'friendDetail-view',
      props: ['friendName'],
      methods: {
        /*
        This function handles the push events on Tom Turnschuh Icon in the Actionbar

        parameters  none
        returns     nothing
        author      hessg1
        version     2019-01-07
        */
        tomTurnschuh(){
          help.say("Hier findest du fast alle Informationen, die ich zu "+ this.friendName +" habe.");
          if(this.friendMobility < 20 && !this.stupidComment){
            this.stupidComment = true;
            help.say(this.friendName + " schätzt seine Fitness mit " + this.friendMobility + " ein?\n\nIch hätte mehr geschätzt... aber mich fragt ja keiner.")
          }
        },

        /*
          Deletes a Friendshio.

          parameters  none, refers to the friend on whose detail page we are right now
          returns     nothing
          author      hessg1
          version     2019-01-03
        */
        deleteFriend(){
          confirm({
            title: "Bist du dir sicher?",
            message: "Möchtest du " + this.friendName + " wirklich aus deiner Freundesliste entfernen?",
            okButtonText: "entfernen",
            cancelButtonText: "abbrechen"
          })
          .then(choice =>{
            if(choice){
              backendService.deleteFriendship(this.name, this.friendName)
              .then(x => {
                this.changeRoute("main");
              })
              .catch(err => {
                // handling our special backend behaviour
                if(err = "TypeError: Network request failed: JSON Parse error: Unexpected EOF"){
                  console.log("special error detected");
                  this.changeRoute("main");
                }
                else{
                  console.log("Fehler:" + err);
                }
              });
            }
          });

        },

        /*
          Adds a game with this friend


          parameters  none
          returns     nothing, but navigates to the quiz page
          author      hessg1
          version     2019-01-02
        */
        addGame() {
            backendService.addGame(this.name, this.friendName)
            .then(data => {
                this.gameId = data.id;
                console.log(this.gameId);
                help.say("Ich habe eine Spieleinladung an " + this.friendName + " geschickt.\n\nWarte, bis du an der Reihe bist.");
                this.$navigateTo(this.$routes["main"],{ clearHistory: true });
            });
        },

        changeRoute(to) {
            // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to]
            this.$navigateTo(this.$routes[to]);
        },
      },

      mounted() {
        this.name = localStorage.getItem('name');
        // initialize Tom Turnschuh
        help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);
        // load friends details
        backendService.getUser(this.friendName).then(data => {
              this.friendGender = data.gender;
              this.friendMobility = data.mobility;
              this.friendWalkerCoins = data.walkerCoins;
              this.friendGames = data.game;
          })
      },
    }
</script>

<style scoped>
  ActionBar {
      background-color: #53ba82;
      color: #ffffff;
  }

  TextField{
    margin-left: 25;
    margin-right: 25
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
