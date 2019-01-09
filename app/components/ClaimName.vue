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
let presiMode = true; // fill localstorage with example userData

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
  mounted() {
    if(presiMode){
      console.log("---PRESENTATION MODE ENABLED---");
      console.log("---  store to localStorage  ---");
      localStorage.setItem('lastCheckedSteps', new Date());
      console.log("- lastCheckedSteps set to now");
      localStorage.setItem('connected', true);
      console.log("- connected set to TRUE");
      var temp = [
        {date: 1546037180000, steps: 3423, coins: 57},
        {date: 1546437180000, steps: 10301, coins: 171},
        {date: 1546522180000, steps: 8888, coins: 148},
        {date: 1546714480000, steps: 1432, coins: 23},
        {date: 1547037180000, steps: 6201, coins: 103}
      ];
      localStorage.setItemObject('stepsLog', temp);
      console.log("- stepsLog set with 5 items");
    }

  }
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
