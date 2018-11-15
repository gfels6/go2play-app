<template>
  <Page class="page">
    <ActionBar title="Einstellungen">
    </ActionBar>
    <StackLayout class="page-content">
      <Label text="Hier ist der SettingsScreen" class="big" />
    </StackLayout>
  </Page>
</template>

<script>
    export default {
        name: 'settings-view',
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