<template>
  <Page class="page">
    <ActionBar title="Einstellungen">
    </ActionBar>

    <StackLayout orientation="vertical" class="page-content">
        <StackLayout orientation="horizontal" class="genderContainer">
            <Label class="title" :text="lblName" />
            <Label class="title" :text="name" />
        </StackLayout>
        <StackLayout orientation="horizontal" class="genderContainer">
            <Label class="title" :text="lblGender" />
            <Label class="title" :text="gender" />
        </StackLayout>
        <StackLayout orientation="horizontal" class="genderContainer">
            <Label class="title" :text="lblBirthdate" />
            <Label class="title" :text="birthdate" />
        </StackLayout>

        <Label class="title" :text="lblMobilityLevel" />

        <!-- IMPORTANT: Images (left/right) needs to be fixed!!!! !-->
        <StackLayout orientation="horizontal" class="mobilityContainer">
            <Image class="imgMobi left" src="~/assets/images/snail.png"  />
            <Slider class="mobiSlider" v-model="sliderValue" />
            <Image class="imgMobi right" src="~/assets/images/rabbit.png"/>
        </StackLayout>



        <Button class='btn' text="Speichern" @tap="saveChanges()" />

        <Button class='btn' text="Weiter" @tap="changeRoute('stepCounter')" />

    </StackLayout>
  </Page>
</template>

<script>

/* TODO:
     - Anzeige Benutzername
     - Anzeige Geschlecht (nicht modifizierbar)
     - Anzeige Geburtsdatum (nicht modifizierbar)
     - Anzeige Mobilitylevel (modifizierbar + speicherung Backend)
     - Button & Routing Schrittzähler
*/

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
                mobilityLevel: 0,
            };
        },
        name: 'settings-view',
        methods: {
            changeRoute(to) {
                // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to]
                //this.$navigateTo(this.$routes[to]);
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
                this.mobilityLevel = data.mobility;
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
</style>
