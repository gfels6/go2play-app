<template>
  <Page class="page">
    <ActionBar title="Quiz">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

    </StackLayout>
  </Page>
</template>

<script>
    export default {
        data() {
            return {

            };
        },
        name: 'quiz-view',
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