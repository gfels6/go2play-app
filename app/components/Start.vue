<template>
    <Page>
        <ActionBar title=""/>
        <StackLayout orientation="vertical">
            <Image class="logo" src="~/assets/images/go_logo.png" />
            <Label class="title" :text="title" />
            <Label class="subTitle" :text="subTitle" />
            <TextField v-model="tfName" hint="Name eingeben..." />
            <Button class="active" text="Namen überprüfen" @tap="checkName(tfName)" />
            <Button :class="[{ inactive: inactiveButton }, 'active']" text="Weiter" @tap="changeRoute('setup')" />
        </StackLayout>
    </Page>
</template>

<script>

/* TODO:
     - Modal für "Name bereits vergeben"
     - Buttons in einen welchseln (Weiter nur bei unique Namen)
     - Weitergabe des Namen an den Setup Screen
     - Zurückbutton einschalten (ist aus fürs debuggen)
*/

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
        inactiveButton: true,
        searchedName: "",
      }
    },
    methods: {
        checkName (name) {
            backendService.searchName(name)
            .then(data => {
                console.log(data.userCount);
                if(data.userCount == 0) {
                    this.inactiveButton = false;
                    this.searchedName = this.tfName;
                } else {
                    this.inactiveButton = true;
                    this.searchedName = "";
                }
            })
        },
        changeRoute(to) {
            // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to] 
            this.$navigateTo(this.$routes[to], {
                props: {
                    uniqueName: this.searchedName,
                }
            });
        }
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
