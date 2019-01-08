<template>
  <Page class="page">
    <ActionBar title="Meine Freunde">
      <NavigationButton @tap="goHome" text="Home" android.systemIcon="ic_menu_back" />
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
      <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
    </ActionBar>

    <StackLayout orientation="vertical" class="page-content">
      <Label :text="'Du hast ' + friends.length + ' Freund' + (friends.length > 1 ? 'e':'')   +':'" textWrap="true" class="normalText" />
      <ListView for="friend in friends" @itemTap="onItemTap" separatorColor="transparent">
        <v-template>
          <label :text="friend" class="listItem"/>
        </v-template>
      </ListView>
      <Label :text="'\nFreund hinzufügen:'" textWrap="true" class="normalText" />
      <StackLayout orientation="horizontal" class="page-content">
        <TextField v-model="friendName" hint="Name des Freundes" />
        <Button class="btn" :text="friendButton" @tap="lookup(friendName)" />
      </StackLayout>
    </StackLayout>

  </Page>
</template>

<script>

  import BackendService from '@/services/BackendService';
  const backendService = new BackendService();
  import TomService from '@/services/TomService'
  let help = null;

    export default {
      data() {
        return {
          name: "",
          friends: [],
          friendName: "",
          friendButton: "suchen",
          // an object wrapping the image path, so it can be passed to TomService
          tom: {
            img: "~/assets/images/tom.png",
            saidsomething: false,
            notif_text: ""
          }
        };
      },
      name: 'friends-view',
      methods: {

        // navigates to the main screen
        goHome(){
          this.$navigateTo(this.$routes['main'],{ clearHistory: true });
        },

        /*
        This function handles the push events on Tom Turnschuh Icon in the Actionbar

        parameters  none
        returns     nothing
        author      hessg1
        version     2019-01-07
        */
        tomTurnschuh(){
          help.say("Hier siehst du deine Freunde im Spiel und kannst neue Freunde hinzufügen.")
        },

        // navigates to a friends detail page
        onItemTap(event){
          this.$navigateTo(this.$routes['friendDetail'], {
              props: {
                  friendName: this.friends[event.index],
              }
          });
        },

        /*
          Searches a friend

          parameters  friend: the friends name
          returns     nothing, but adds the friend if found and the user accepted
          author      hessg1
          version     2018-12-12
        */
        lookup(friend){
          backendService.searchName(friend)
          .catch(err => {
            console.log(err);
          })
          .then(data =>{
            if(data.userCount == 0){
              help.say("Sieht aus als wäre " + friend + " noch nicht registriert. Vielleicht hast du dich vertippt?");
            }
            if(data.userCount == 1){
              if(this.friends.includes(friend)){
                help.say(friend + " ist bereits auf der Freundesliste!");
              }
              else if (friend == this.name) {
                help.say("Hast du keine anderen Freunde als dich selbst?");
              }
              else{
                help.say(friend + " mag ich auch! :)");
                confirm({
                  title: "Freund gefunden",
                  message: "Möchtest du " + friend + " als zu deinen Freunden hinzufügen?",
                  okButtonText: "hinzufügen",
                  cancelButtonText: "abbrechen"
                })
                .then(choice =>{
                  if(!choice){
                    this.friendName = "";
                  }
                  if(choice){
                    console.log("try to add");
                    backendService.addFriend(this.name, friend)
                    .then(x => {
                      this.loadFriends();
                      console.log("success: added " + friend + " to " + this.name + "s friend list");
                      this.friendName = "";
                    });
                  }
                });
              }
            }
            if(choice > 1 || choice < 0){
              console.log("shit."); // there shouldn't be more than 1 (or less than 0) of an unique name
            }
          })
        },

        /*
          Loads the friends from server and displays them on the page.

          parameters  none
          returns     nothing, but loads friends on to page
          author      hessg1
          version     2018-12-12
        */
        loadFriends(){
          console.log("load friends");
          backendService.getUser(this.name)
            .then(user => {
              this.friends = user.friend;
            })
        }
      },

      // initialize some stuff when mounting page
      mounted() {
        this.name = localStorage.getItem('name');
        this.loadFriends();
        // initialize Tom Turnschuh
        help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);
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
