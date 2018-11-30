<template>
  <Page class="page">
    <ActionBar title="Hauptmenü">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">
        <StackLayout orientation="horizontal" class="container">
            <StackLayout orientation="horizontal" class="steps">
            <Label class="title left" :text="lblSteps" />
            <Label class="title value" :text="steps" />
            </StackLayout>
            <StackLayout orientation="horizontal" class="coins">
            <Label class="title right" :text="lblWalkerCoins" />
            <Label class="title value" :text="walkerCoins" />
            </StackLayout>
        </StackLayout>

        <Button class='btn' text="Quiz" @tap="changeRoute('quiz')" />
        <Button class='btn' text="Freunde" @tap="changeRoute('friends')" />
        <Button class='btn' text="Fortschritt" @tap="changeRoute('progress')" />
        <Button class='btn' text="Einstellungen" @tap="changeRoute('settings')" />

    </StackLayout>
  </Page>
</template>

<script>

/* TODO:
     - Verschönern der Buttons
*/

    import BackendService from '@/services/BackendService'
    const backendService = new BackendService()

    export default {
        data() {
            return {
                lblSteps: "Schritte:",
                lblWalkerCoins: "Walker Coins:",
                walkerCoins: 0,
                steps: 0,
            };
        },
        name: 'main-view',
        methods: {
            changeRoute(to) {
                // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to] 
                this.$navigateTo(this.$routes[to]);
            },
        },
        mounted() {
            console.log("mounted from Main");
            backendService.getUser(localStorage.getItem('name'))
            .then(data => {
                console.log(data);
                this.walkerCoins = data.walkerCoins;
            })
            
            let localSteps = localStorage.getItem('steps');
            if(localSteps === null) {
                this.steps = 0;
            } else {
                this.steps = localSteps;
            }
        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .container {
        margin: 10, 15, 10, 20;
    }
    
    .title {
        font-size: 16;
        color:black;
    }

    .value {
        margin-left: 4;
    }

    .steps {
        width: 48%;
    }

    .coins {
        width: 48%;
        horizontal-align: right;
    }
</style>