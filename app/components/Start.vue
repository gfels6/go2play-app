<template>
    <Page>
        <ActionBar title=""/>
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

  export default {
    name: 'start-view',
    data() {
      return {
        title: 'Willkommen!',
        subTitle: 'Wie heisst du denn?',
        btnGo: "Ich will loslegen!",
        tfName: "",
        buttonText: "Namen überprüfen",
        nameChecked: false,
        searchedName: "",
        userCount: "",
      }
    },
    methods: {
      textWatch(){
        this.nameChecked = false;
        this.buttonText = "Namen überprüfen";
      },
      buttonAction () {
        if(!this.nameChecked){
          this.tfName = this.tfName.replace(/\s/g, ''); // remove clearspaces
            backendService.searchName(encodeURI(this.tfName)) // encode for GET URL
            .catch(err => {
              console.log(err);
            })
            .then(data => {
              if(data.userCount == 0) {
                this.nameChecked = true;
                this.buttonText = "weiter";
                this.searchedName = this.tfName;
              } else {
                action("Der Name \"" + this.tfName + "\" ist bereits vergeben.", "abbrechen", ["anderen Namen wählen", "ich bin " + this.tfName])
                  .then(result => {
                    if(result == "ich bin " + this.tfName){
                      this.searchedName = this.tfName;
                      console.log(this.searchedName);
                      this.changeRoute('claimName');
                    }
                    if(result == "anderen Namen wählen"){
                      this.tfName = "";
                    }
                  });
                this.searchedName = "";
              }
            })
          }
        else{
          this.$navigateTo(this.$routes['setup'],{ clearHistory: true }, {
              props: {
                  uniqueName: this.searchedName,
              }
          });
        }
      },
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
