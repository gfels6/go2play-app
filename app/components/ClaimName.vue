<template>
  <Page class="page">
    <ActionBar title="Name zurückerhalten">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">
      <Label textWrap="true" class="normalText" :text="greeting" />
      <Button text="weiter" @tap="changeRoute('main')" />
    </StackLayout>
  </Page>
</template>


<script>

/* TODO:
     - Prüfen ob Claim berechtigt ist (Geburtsdatum abfragen)
*/

    export default {
        data() {
            return {
              greeting: "Hi " + this.uniqueName + "! \n\nSpäter musst du hier beweisen, dass du es bist, aber fürs Debugging lasse ich das jetzt mal so durchgehen.",

            };
        },
        props: ['uniqueName'],
        name: 'claimName-view',
        methods: {
          changeRoute(to) {
            // Name lokal speichern
              localStorage.setItem('name', this.uniqueName);

            // und weiternavigieren
              this.$navigateTo(this.$routes[to], { clearHistory: true });
          }
        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .normalText {
        text-align: left;
        margin: 15;
        font-size: 20;
        color:black;
    }

</style>
