<template>
  <Page class="page">
    <ActionBar title="Meine Freunde">
    </ActionBar>

    <StackLayout orientation="vertical" class="page-content">
      <Label :text="'Du hast ' + friends.length + ' Freunde:'" textWrap="true" class="normalText" />
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

    export default {
      data() {
        return {
          name: "",
          friends: [],
          friendName: "",
          friendButton: "suchen"
        };
      },
      name: 'friends-view',
      methods: {
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
              alert({
                title: "Nicht gefunden",
                message: "Sieht aus als wäre " + friend + " noch nicht registriert. Vielleicht hast du dich vertippt?",
                okButtonText: "OK"
              });
            }
            if(data.userCount == 1){
              if(this.friends.includes(friend)){
                alert({
                  title: "Oops",
                  message: friend + " ist bereits auf der Freundesliste!",
                  okButtonText: "OK"
                });
              }
              else if (friend == this.name) {
                alert({
                  title: "Oops",
                  message: "Du kannst dich nicht selber als Freund hinzufügen.",
                  okButtonText: "OK"
                });
              }
              else{
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
