<template>
  <Page class="page">
    <ActionBar title="Freundeverwaltung">
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
        name: 'friends-view',
        methods: {

                /*
                backendService.addFriend("gfels6", "test")
                .then(data => {
                    console.log("success");
                })  */

        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

</style>