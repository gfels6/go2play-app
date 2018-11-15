<template>
    <Page>
        <ActionBar title=""/>
        <StackLayout orientation="vertical">
            <Image class="logo" src="~/assets/images/go_logo.png" />
            <Label class="title" :text="title" />
            <Label class="subTitle" :text="subTitle" />
            <TextField v-model="textFieldValue" hint="Name eingeben..." />
            <Button class="active" text="Namen überprüfen" @tap="checkName" />
            <Button class="active" text="Weiter" @tap="changeRoute('settings')" />
        </StackLayout>
        <!--
        <GridLayout columns="*" rows="*">
            <Label class="message" :text="msg" col="0" row="0"/>
        </GridLayout> !-->
    </Page>
</template>

<script>

  export default {
    name: 'start-view',
    data() {
      return {
        title: 'Willkommen!',
        subTitle: 'Wie heisst du denn?',
        btnGo: "Ich will loslegen!"
      }
    },
    methods: {
        goToSettings () {
            this.$navigateTo(this.$routes[settings]);
            console.log("goToSettingsPressed");

        },
        checkName () {
            console.log("checkNamePressed");
        },
        changeRoute(to) {
            // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to] 
            this.$navigateTo(this.$routes[to]);
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
        margin-top: 20;
        margin-left: 26;
        margin-right: 26;
    }

    .inactive {
        visibility: collapsed;
        margin-top: 20;
        margin-left: 26;
        margin-right: 26;
    }
</style>
