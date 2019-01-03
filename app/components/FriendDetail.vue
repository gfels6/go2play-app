<template>
  <Page class="page">
    <ActionBar :title="friendName">
    </ActionBar>

    <StackLayout orientation="vertical" class="page-content">
      <Label :text="friendName + ' schätzt seine Fitness mit ' + friendMobility + '% ein,  hat ' + friendGames.length + ' Spiele und ' + friendWalkerCoins + ' WalkerCoins. Wow!\nWie oft du gegen ihn gespielt und gewonnen hast, weiss ich aber noch nicht.'" class="normalText" textWrap="true"/>
      <Button class='btn' text="herausfordern!" @tap="addGame()" />
      <Button class='btn' text="löschen" @tap="deleteFriend()" />
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
          friendGames: "",
          friendWalkerCoins: 0,
          friendGender: "do not assume",
          friendMobility: 0,
        };
      },
      name: 'friendDetail-view',
      props: ['friendName'],
      methods: {
        deleteFriend(){
          confirm({
            title: "Bist du dir sicher?",
            message: "Möchtest du " + this.friendName + " wirklich aus deiner Freundesliste entfernen?",
            okButtonText: "entfernen",
            cancelButtonText: "abbrechen"
          })
          .then(choice =>{
            if(choice){
              // TODO: should the games with this friend also be deleted?
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
        addGame() {
            backendService.addGame(this.name, this.friendName)
            .then(data => {
                console.log("successfully added Game!");
                //console.log(data);
                this.gameId = data.id;
                console.log(this.gameId)
                this.changeRoute('quizOverview');
            });
        },
        changeRoute(to) {
            // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to]
            this.$navigateTo(this.$routes[to], { clearHistory: true });
        },
      },

      mounted() {
        this.name = localStorage.getItem('name');
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
