<template>
  <Page class="page">
    <ActionBar title="Hauptmenü">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

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
     - Anzeige igrwo der Steps und der WalkerCoins
*/
    export default {
        data() {
            return {

            };
        },
        name: 'main-view',
        methods: {
            changeRoute(to) {
                // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to] 
                this.$navigateTo(this.$routes[to]);
            },
        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

</style>