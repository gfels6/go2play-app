<template>
  <Page>
    <ActionBar title="">
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
    </ActionBar>
    <StackLayout orientation="vertical">
      <Image class="logo" src="~/assets/images/go_logo.png" />
      <Label class="title" :text="title" />
      <Label class="subTitle" :text="subTitle" />
      <TextField v-model="tfName" hint="Name eingeben..." @textChange="textWatch()"/>
      <Button class="active" :text="buttonText" @tap="buttonAction()" />
    </StackLayout>
  </Page>
</template>

<script>


import BackendService from '@/services/BackendService'
const backendService = new BackendService()
import TomService from '@/services/TomService'
let help = null;

export default {
  name: 'start-view',
  data() {
    return {
      title: 'Willkommen!',
      subTitle: 'Gib hier deinen Namen ein:',
      tfName: "",
      buttonText: "Namen überprüfen",
      nameChecked: false,
      userCount: "",
      // an object wrapping the image path, so it can be passed to TomService
      tom: {
        img: "~/assets/images/tom.png",
        saidsomething: false
      }
    }
  },
  methods: {
    // this method is called as soon some text is entered / altered
    // so we have to make sure the name is valid before we can proceed
    textWatch(){
      this.nameChecked = false;
      this.buttonText = "Namen überprüfen";
    },

    /*
    This function handles the push events on Tom Turnschuh Icon in the Actionbar

    parameters  none
    returns     nothing
    author      hessg1
    version     2019-01-07
    */
    tomTurnschuh(){
      help.say("Prima, du hast bereits rausgefunden, wo du mich findest.\nGib nun unten deinen Namen ein, um dich für das Spiel anzumelden.")
    },

    /*
    Handles the different actions of the button: Check name and if name is available: register

    parameters  none
    returns     a promise with the number of steps
    author      hessg1 / gfels6
    version     2018-12
    */
    buttonAction () {
      if(!this.nameChecked){
        this.tfName = this.tfName.replace(/\s/g, ''); // remove clearspaces
        backendService.searchName(this.tfName)
        .catch(err => {
          help.say("Ich kann den Spiel-Server nicht erreichen.\nStelle sicher, dass du mit dem BFH-WLAN verbunden bist.");
          console.log(err);
        })
        .then(data => {
          if(data.userCount == 0 && this.tfName != "" && this.tfName != "both") { // name can't be empty or "both", since this is a reserved term in the backend
          help.say("Herzlich willkommen, " + this.tfName + "!\n\nKlicke unten auf \"registrieren\", um dich anzumelden.")
          this.nameChecked = true;
          this.buttonText = "registrieren";
        } else if (this.tfName == "") {
          help.say("Diesen Namen kannst du leider nicht wählen. Aber es gibt doch so viele, die dir aussuchen kannst.");
        }
        else {
          help.say("Ups! Dieser Name ist bereits besetzt.");
          action("Der Name \"" + this.tfName + "\" ist bereits vergeben.", "abbrechen", ["anderen Namen wählen", "ich bin " + this.tfName])
          .then(result => {
            if(result == "ich bin " + this.tfName){
              this.changeRoute('claimName', true);
            }
            if(result == "anderen Namen wählen"){
              this.tfName = "";
            }
          });
        }
      })
    }
    else{
      this.changeRoute('setup', true);
    }
  },
  changeRoute(to, hideBackButton) {
    console.log("changing page. tfName=" + this.tfName);
    this.$navigateTo(this.$routes[to], {
      clearHistory: hideBackButton,
      props: {
        uniqueName: this.tfName,
      }
    });
  }
},
  mounted() {
    // initialize Tom Turnschuh
    help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);

    // greet the user
    setTimeout(()=>{
      help.say("Hallo! Ich bin Tom Turnschuh.\nWenn du Hilfe brauchst, findest du mich oben rechts auf dem Bildschirm.\n\nWie heisst du denn?");
      help.notify(0);
    }, 1000);
    }
}
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.title {
  margin-top: 40;
  text-align: center;
  font-size: 32;
  color:black;
}

.subTitle {
  text-align: center;
  font-size: 28;
  color:black;
}

.logo {
  width: 300;
  height: 150;
  vertical-align: center;
  horizontal-align: center;
  margin-top: 25;
}

TextField {
  margin-top: 20;
  margin-left: 26;
  margin-right: 26;
}

.active {
  visibility: visible;
  margin-top: 20;
  margin-left: 26;
  margin-right: 26;
}

.inactive {
  visibility: collapsed;
}
</style>
