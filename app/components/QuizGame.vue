<template>
  <Page class="page">
    <ActionBar title="Quiz Game">
    </ActionBar>
    <StackLayout orientation="vertical" class="page-content">

        <StackLayout orientation="vertical" class="questionContent">
            <Label class="question" :text="question" textWrap="true" />
        </StackLayout>

        <StackLayout orientation="vertical" class="answerMain">
            <StackLayout orientation="horizontal" class="answerRow">
                <StackLayout orientation="vertical" class="answer">
                    <Label class="textAnswer" :text="answer1" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="vertical" class="answer">
                    <Label class="textAnswer" :text="answer2" textWrap="true" />
                </StackLayout>
            </StackLayout>
            <StackLayout orientation="horizontal" class="answerRow">
                <StackLayout orientation="vertical" class="answer">
                    <Label class="textAnswer" :text="answer3" textWrap="true" />
                </StackLayout>
                <StackLayout orientation="vertical" class="answer">
                    <Label class="textAnswer" :text="answer4" textWrap="true" />
                </StackLayout>
            </StackLayout>
        </StackLayout>

        <GridLayout :columns="columns" class="progressbar">
            <StackLayout col="0" class="progressbar-value"></StackLayout>
        </GridLayout>

    </StackLayout>
  </Page>
</template>

<script>
    import BackendService from '@/services/BackendService';
    const backendService = new BackendService();

    export default {
        data() {
            return {
                question: "Question",
                answer1: "Answer 1",
                answer2: "Answer 2",
                answer3: "Answer 3",
                answer4: "Answer 4",
                columns: "",
            };
        },
        name: 'quizgame-view',
        props: ['gameId'],
        methods: {
            changeRoute(to) {
                // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to] 
                //this.$navigateTo(this.$routes[to]);
            },
            getContent() {
                backendService.getQuestion(this.gameId)
                .then(data => {
                    console.log(data);
                    console.log("questions: " + data[0].answers[0]);
                    this.question = data[0].question;
                    this.answer1 = data[0].answers[0];
                    this.answer2 = data[0].answers[1];
                    this.answer3 = data[0].answers[2];
                    this.answer4 = data[0].answers[3];
                })
            },
            setProgressbarWidth(percent) {
                this.columns = percent + "*," + (100 - percent) + "*";
            }
        },
        mounted() {
            console.log("mounted game: " + this.gameId);
            this.getContent();
            
            let percent = 100;
            let intervalId = setInterval(() => {
            this.setProgressbarWidth(percent);
            percent--;
            if (percent < 0) {
                clearInterval(intervalId);
            }
            }, 100);
        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .questionContent{
        border-radius: 5;
        border-width: 1;
        color: black;
        margin: 10;
        font-size: 22;
        border-color: #2b3c6a;
        height: 150;
    }

    .question{
        vertical-align: center;
        horizontal-align: center;
        margin-top: 50;
    }

    .answer{
        border-radius: 5;
        border-width: 1;
        color: white;
        background-color: black;
        margin: 10;
        font-size: 18;
        border-color: #2b3c6a;
        height: 80;
        width: 45%;
    }

    .textAnswer {
        margin-top: 20;
        horizontal-align: center;
        vertical-align: center;
    }

    .progressbar {
        height: 30;
        margin: 10;
        border-radius: 10;
        border-color: black;
        border-width: 1;
        margin-top: 20;
    }

    .progressbar-value {
        background: #53ba82;
        border-radius: 10;
    }

</style>