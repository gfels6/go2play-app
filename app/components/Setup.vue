<template>
  <Page class="page">
    <ActionBar title="Setup">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

      <Label class="lbl" :text="gender" />

      <StackLayout orientation="horizontal" class="genderContainer">

        <StackLayout :class="[{ active: isMaleActive }, 'btn-img']" ref='layoutMale' orientation="vertical" padding="10" @tap="onTappedGender('male')" >
            <Image class="img" src="~/assets/images/male.png" />
        </StackLayout>

        <StackLayout :class="[{ active: isFemaleActive }, 'btn-img']" ref='layoutFemale' orientation="vertical" padding="10" @tap="onTappedGender('female')" >
            <Image class="img" src="~/assets/images/female.png" />
        </StackLayout>
      </StackLayout>

      <Label class="lbl" :text="birthday" />

      <DatePicker v-model="selectedDate" minDate="1920-01-01" maxDate="2012-12-31" />

      <Label class="lbl" :text="mobilityLevel" />

      <!-- IMPORTANT: Images (left/right) needs to be fixed!!!! !-->
      <StackLayout orientation="horizontal" class="mobilityContainer">
        <Image class="imgMobi left" src="~/assets/images/snail.png"  />
        <Slider class="mobiSlider" v-model="sliderValue" />
        <Image class="imgMobi right" src="~/assets/images/rabbit.png"/>
      </StackLayout>



      <Button class='btn' text="Weiter" @tap="changeRoute('stepCounter')" />

    </StackLayout>
  </Page>
</template>

<script>

    import BackendService from '@/services/BackendService'
    const backendService = new BackendService()

    export default {
        data() {
            return {
                isMaleActive: false,
                isFemaleActive: false,
                selectedGender: "",
                gender: "Geschlecht",
                birthday: "Geburtstag",
                mobilityLevel: "Mobilitätslevel",
                stepCounter: "Schrittzähler verbinden",
                selectedDate: new Date(1990, new Date().getMonth(), new Date().getDate()),
                sliderValue: 50,
            };
        },
        props: ['uniqueName'],
        name: 'settings-view',
        methods: {
            onTappedGender(gender){
                this.selectedGender = gender;
                console.log("name is" + this.uniqueName);
                if (gender == "male") {
                    this.isMaleActive = true;
                    this.isFemaleActive = false;
                } else {
                    this.isMaleActive = false;
                    this.isFemaleActive = true;
                }
            },
            changeRoute(to) {
                let bday = this.selectedDate.getDate() + "-" + (this.selectedDate.getMonth() + 1) + "-" + this.selectedDate.getFullYear();
                //console.log("Gender: " + this.selectedGender + " Geburtsdatum: " + this.selectedDate + " Mobility: " + this.sliderValue);
                //console.log("bday: " + bday);
                if(this.selectedGender === "") {
                  action("Bitte gib dein Geschlecht an.", "abbrechen", ["weiblich", "männlich"])
                    .then(result => {
                      if(result == "weiblich"){
                        this.selectedGender = "female";
                        this.isMaleActive = false;
                        this.isFemaleActive = true;
                      }
                      if(result == "männlich"){
                        this.selectedGender = "male";
                        this.isMaleActive = true;
                        this.isFemaleActive = false;
                      }
                      if(result == "abbrechen"){
                        console.log("abgebrochen");
                      }
                    });
                  return;
                }

                backendService.addUser(this.uniqueName, this.selectedGender, bday, Math.round(this.sliderValue))
                .then(data => {
                    console.log("success:" + data);
                    localStorage.setItem('name', this.uniqueName);
                    localStorage.setItem('connected', false); // initialize local storage variable for checking if stepcounter is connected
                    this.$navigateTo(this.$routes[to]);
                }).catch(error => {
                    console.log(error);
                })

                // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to]
                //this.$navigateTo(this.$routes[to]);
            },
        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }
    .btn-img{
        border-radius: 5;
        border-width: 1;
        color: white;
        margin: 10;
        font-size: 22;
        border-color: #2b3c6a;
        height: 80;
        width: 80;
    }

    .active{
        background-color: rgb(0, 255, 106);
    }

    .genderContainer {
        horizontal-align: center;
    }

    .mobilityContainer{
      horizontal-align: center;
    }

    .imgMobi {
      width: 35;
      height: 35;
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
</style>
