<template>
  <Page class="page">
    <ActionBar title="Spielübersicht">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

        <Label class="question" :text="tbd" textWrap="true" />

        <Button class='btn' text="Spielen" @tap="changeRoute('quizGame')" />

    </StackLayout>
  </Page>
</template>

<script>
    export default {
        data() {
            return {
                tbd: "Hier werden die Spieldetails stehen (Überblick, Wer ist am gewinnen etc)",
            };
        },
        name: 'quizoverview-view',
        props: ['gameId'],
        methods: {
            changeRoute(to) {
                this.$navigateTo(this.$routes[to], {
                    props: {
                        gameId: this.gameId,
                    }
                });
            },
        },
        mounted() {
            
        }
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

</style>