<template>
  <Page class="page">
    <ActionBar title="Einstellungen">
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

        <!-- IMPORTANT: Images (left/right) needs to be fixed!!!! !-->
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

/* TODO:
     - Anzeige Mobilitylevel (modifizierbar + speicherung Backend)
     - Button & Routing Schrittzähler
*/
    require( "nativescript-localstorage" );
    import BackendService from '@/services/BackendService'
    const backendService = new BackendService()

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
                sliderValue: 0,
            };
        },
        name: 'settings-view',
        methods: {
            changeRoute(to) {
                // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to]
                this.$navigateTo(this.$routes[to]);
            },
            resetApp(){
              console.log("delete local storage...");
              localStorage.clear();
              this.changeRoute('start');
            },
            saveChanges() {

            },
        },
        mounted() {
            console.log("mounted");
            backendService.getUser(localStorage.getItem('name'))
            .then(data => {
                console.log(data);
                this.name = data.name;
                this.gender = data.gender;
                this.birthdate = data.birthyear;
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
