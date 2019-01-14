<template>
  <Page class="page">
    <ActionBar title="Einstellungen">
      <NavigationButton @tap="goHome" text="Home" android.systemIcon="ic_menu_back" />
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
      <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
    </ActionBar>

    <StackLayout orientation="vertical" class="page-content">
      <StackLayout orientation="horizontal" class="nameContainer">
        <Label class="lbl" :text="lblName" />
        <Label class="value" :text="name" />
      </StackLayout>
      <StackLayout orientation="horizontal" class="genderContainer">
        <Label class="lbl" :text="lblGender" />
        <Label class="value" :text="gender" />
      </StackLayout>
      <StackLayout orientation="horizontal" class="birthdateContainer">
        <Label class="lbl" :text="lblBirthdate" />
        <Label class="value" :text="birthdate" />
      </StackLayout>

      <Label class="lbl mobility" :text="lblMobilityLevel" />

      <StackLayout orientation="horizontal" class="mobilityContainer">
        <Image class="imgMobi left" src="~/assets/images/snail.png"  />
        <Slider class="mobiSlider" v-model="sliderValue" />
        <Image class="imgMobi right" src="~/assets/images/rabbit.png"/>
      </StackLayout>

      <Button class='btn' text="Speichern" @tap="saveChanges()" />
      <Button class='btn' text="Schrittzähler" @tap="changeRoute('stepCounter')" />
      <Button class='btn' text="App zurücksetzen" @tap="resetApp()" />


    </StackLayout>
  </Page>
</template>

<script>
require( "nativescript-localstorage" );
import BackendService from '@/services/BackendService';
const backendService = new BackendService();
import TomService from '@/services/TomService';
let help = null;

export default {
  data() {
    return {
      lblName: "Benutzername: ",
      lblGender: "Geschlecht: ",
      lblBirthdate: "Geburtsjahr: ",
      lblMobilityLevel: "Mobilitätslevel",
      stepCounter: "Schrittzähler verbinden",
      name: "default",
      gender: "default",
      birthdate: "default",
      // MobilityLevel
      sliderValue: 0,
      // an object wrapping the image path, so it can be passed to TomService
      tom: {
        img: "~/assets/images/tom.png",
        saidsomething: false,
        notif_text: ""
      }
    };
  },
  name: 'settings-view',
  methods: {
    changeRoute(to) {
      // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to]
      this.$navigateTo(this.$routes[to]);
    },
    // navigates to the main screen
    goHome(){
      this.$navigateTo(this.$routes['main'],{ clearHistory: true });
    },
    /*
    Resets the whole app and deletes the local storage

    parameters  none
    returns     none, just deletes everything
    author      hessg1
    version     2018-12-14
    */
    resetApp(){
      // lets just check if the user is sure
      confirm({
        title: "Zurücksetzen",
        message: "Möchtest du die App wirklich zurücksetzen? Es werden alle lokalen Daten gelöscht. Wenn du dich neu einloggst, kannst du die Daten wiederherstellen.",
        okButtonText: "zurücksetzen",
        cancelButtonText: "abbrechen"
      })
      .then(choice =>{
        if(choice){
          // delete storage
          localStorage.clear();
          // since we didn't delete the app, the stepcounter is still connected:
          localStorage.setItem('connected', true);
          // navigate to start
          this.$navigateTo(this.$routes['start'],{ clearHistory: true });
        } 
      });
    },

    /*
    This function handles the push events on Tom Turnschuh Icon in the Actionbar

    parameters  none
    returns     nothing
    author      hessg1
    version     2019-01-07
    */
    tomTurnschuh(){
      help.say("Beim Mobilitätslevel kannst du angeben, wie gut du zu Fuss bist. Damit kann ich später dein tägliches Schrittziel berechnen. \n\nBei \"Schrittzähler verbinden\" kannst du einen automatischen Schrittzähler an die App anbinden.\n\n\"App zurücksetzen\" loggt dich aus und löscht alle Daten.");
    },


    /*
    Persists the changes made to the server.

    parameters  none
    returns     nothing
    author      hessg1
    version     2018-12-10
    */
    saveChanges()
    {
      // rounding is important for consistence, because on iOS the slider
      // returns DOUBLE, on android INTEGER
      this.sliderValue = Math.round(this.sliderValue);

      // save remotely
      backendService.updateParameter(this.name, "mobility", this.sliderValue);

      this.changeRoute('main');
    },
  },
  mounted() {
    // initialize Tom Turnschuh
    help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);
    backendService.getUser(localStorage.getItem('name'))
    .then(data => {
      this.name = data.name;
      this.gender = data.gender;
      this.birthdate = data.birthyear.substring(data.birthyear.length - 4);
      this.sliderValue = data.mobility;
    })
  },

}
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.imgMobi {
  width: 35;
  height: 35;
}

.mobilityContainer{
  horizontal-align: center;
}

.mobiSlider{
  width: 60%;
}

.left {
  margin-left: 10;
  margin-right: 5%;
}

.right {
  margin-right: 10;
  margin-left: 5%;
}

.lbl {
  margin-left: 25;
  font-size: 16;
  color:black;
}

.value {
  font-size: 16;
}

.nameContainer {
  margin-top: 10;
}

.genderContainer {
  margin-top: 8;
}

.birthdateContainer {
  margin-top: 8;
}

.mobility {
  margin-top: 8;
}
</style>
