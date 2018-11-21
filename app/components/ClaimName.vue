<template>
  <Page class="page">
    <ActionBar title="Name zurückerhalten">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">
      <Label class="title" :text="greeting" />
    </StackLayout>
  </Page>
</template>

<script>
    export default {
        data() {
            return {
              greeting: "Hi " + this.uniqueName

            };
        },
        props: ['uniqueName'],
        name: 'claimName-view',
        methods: {
        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

</style>
