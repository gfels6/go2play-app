<template>
  <Page class="page">
    <ActionBar title="Einstellungen">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

    </StackLayout>
  </Page>
</template>

<script>

/* TODO:
     - Anzeige Geschlecht (nicht modifizierbar)
     - Anzeige Geburtsdatum (nicht modifizierbar)
     - Anzeige Mobilitylevel (modifizierbar + speicherung Backend)
     - Button & Routing Schrittzähler
*/

    export default {
        data() {
            return {

            };
        },
        name: 'settings-view',
        methods: {
            changeRoute(to) {
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
</style>