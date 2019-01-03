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
                    <Button :isEnabled="btnEnabled" :class="[{ green: rightAnswer === 1 },{ red: wrongAnswer === 1 },{ grey: randomNumber.includes(1) }, 'btnAnswer']" :text="txtAnswer1" textWrap="true"  @tap="onTappedAnswer(1)" />
                    <Button :isEnabled="btnEnabled" :class="[{ green: rightAnswer === 2 },{ red: wrongAnswer === 2 },{ grey: randomNumber.includes(2) }, 'btnAnswer']" :text="txtAnswer2" textWrap="true"  @tap="onTappedAnswer(2)" />
            </StackLayout>
            <StackLayout orientation="horizontal" class="answerRow">
                    <Button :isEnabled="btnEnabled" :class="[{ green: rightAnswer === 3 },{ red: wrongAnswer === 3 },{ grey: randomNumber.includes(3) }, 'btnAnswer']" :text="txtAnswer3" textWrap="true"  @tap="onTappedAnswer(3)" />
                    <Button :isEnabled="btnEnabled" :class="[{ green: rightAnswer === 4 },{ red: wrongAnswer === 4 },{ grey: randomNumber.includes(4) }, 'btnAnswer']" :text="txtAnswer4" textWrap="true"  @tap="onTappedAnswer(4)" />
            </StackLayout>
        </StackLayout>

        <GridLayout :columns="columns" class="progressbar">
            <StackLayout col="0" class="progressbar-value"></StackLayout>
        </GridLayout>

        <Label class="coins" :text="lblWalkerCoins + this.walkerCoins" />

        <Button :class="[{ inactive: !nextQuestion }, 'btn']" :text="btnNext"  @tap="startQuiz()" />
        <Button :class="[{ inactive: !finished }, 'btn']" :text="btnBack"  @tap="changeRoute('main')" />

        <StackLayout orientation="horizontal" class="jokerContainer">
            <StackLayout :class="[{ inactive: !play }, 'btn-img']" orientation="vertical" padding="5" @tap="jokerTime()" >
                <Image class="img" src="~/assets/images/addTime.png" />
                <Label class="costs" :text="costTimeJoker" />
            </StackLayout>
            <StackLayout :isEnabled="btnJokerEnabled" :class="[{ inactive: !play }, { grey: !btnJokerEnabled }, 'btn-img']" orientation="vertical" padding="5" @tap="jokerFifty()" >
                <Image class="img" src="~/assets/images/5050.png" />
                <Label class="costs" :text="costFiftyJoker" />
            </StackLayout>
        </StackLayout>

        

    </StackLayout>
  </Page>
</template>

<script>
    import BackendService from '@/services/BackendService';
    const backendService = new BackendService();

    export default {
        data() {
            return {
                user: "",
                dataSet: "",
                question: "Question",
                txtAnswer1: "Answer 1",
                txtAnswer2: "Answer 2",
                txtAnswer3: "Answer 3",
                txtAnswer4: "Answer 4",
                answers: [],
                intervalId: "",
                columns: "",
                btnEnabled: true,
                positions: [1,2,3,4],
                rightAnswer: 0,
                wrongAnswer: 0,
                questionNumber: 0,
                nextQuestion: false,
                btnNext: "Nächste Frage",
                btnBack: "Zurück zum Menü",
                finished: false,
                play: true,
                joker: 0,
                randomNumber: [],
                lblWalkerCoins: "Walker Coins: ",
                walkerCoins: 0,
                costFiftyJoker: 50,
                costTimeJoker: 25,
                btnJokerEnabled: true,

            };
        },
        name: 'quizgame-view',
        props: ['gameId'],
        methods: {
            changeRoute(to) {
                // zurückbutton geht dann nicht mehr ',{ clearHistory: true }' nach [to] 
                this.$navigateTo(this.$routes[to]);
            },
            getContent() {
                backendService.getActualRound(this.gameId, this.user)
                .then(data => {
                    this.dataSet = data;
                    this.startQuiz();
                })
            },
            setProgressbarWidth(percent) {
                this.columns = percent + "*," + (100 - percent) + "*";
            },
            setUpProgressbar(){
                let percent = 100;
                this.intervalId = setInterval(() => {
                    this.setProgressbarWidth(percent);
                    percent--;
                    if (percent < 0) {
                        clearInterval(this.intervalId);
                        this.onTappedAnswer(0);
                    }
                }, 120);
            },
            startQuiz(){
                this.getWalkerCoins();
                this.btnEnabled = true;
                this.play = true;
                this.joker = 0;
                this.rightAnswer = 0;
                this.wrongAnswer = 0;
                this.nextQuestion = false;
                this.setQuestion(this.questionNumber);
            },
            setQuestion(number){
                this.question = this.dataSet.gameQuestions[number].question;
                this.shuffleArray(this.positions);
                console.log("Nach Shuffle: " + this.positions);

                for (let i = 0; i < this.positions.length; i++) {
                    this["txtAnswer"+(this.positions[i])] = this.dataSet.gameQuestions[number].answers[i];
                }

                this.setUpProgressbar();
            },
            shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            },
            onTappedAnswer(id){

                clearInterval(this.intervalId);
                this.btnEnabled = false;
                this.play = false;
                if(id > 0 && id <= 4) {
                    this.answers.push(this.positions.indexOf(id)+1);
                }
                else{
                    this.answers.push(0);
                }
                this.rightAnswer = this.positions[0];

                if(this.positions[0] == id){
                    console.log("wuhu richtig!");
                } else {
                    console.log("fautsch");
                    this.wrongAnswer = id;
                }

                if(this.questionNumber == 0 || this.questionNumber == 1) {
                    this.questionNumber++;
                    this.nextQuestion = true;
                } else if (this.questionNumber == 2) {
                    backendService.setAnswers(this.gameId, this.user, this.dataSet.roundNumber, this.answers)
                    .then(data => {
                        console.log("ichwarhier!");
                    })
                    this.finished = true;
                }
                
                
            },
            jokerTime() {
                if(this.walkerCoins >= this.costTimeJoker) {
                    let correctCoins = this.walkerCoins - this.costTimeJoker;
                    this.walkerCoins = correctCoins;
                    backendService.updateParameter(this.user, "walkerCoins", correctCoins)
                    .then(data => {
                    })
                    
                    clearInterval(this.intervalId);
                    this.setUpProgressbar();
                }

            },
            jokerFifty() {
                if(this.walkerCoins >= this.costFiftyJoker) {
                    let correctCoins = this.walkerCoins - this.costFiftyJoker;
                    this.walkerCoins = correctCoins;
                    this.btnJokerEnabled = false;
                    backendService.updateParameter(this.user, "walkerCoins", correctCoins)
                    .then(data => {
                    })

                    //Should be randomized (position 1-3, not only 1 and 2)
                    this.randomNumber.push(this.positions[1]);
                    this.randomNumber.push(this.positions[2]);
                }
 
            },
            getWalkerCoins(){
                backendService.getUser(this.user)
                .then(data => {
                    this.walkerCoins = data.walkerCoins;
                })
            }
        },
        mounted() {
            console.log("mounted game: " + this.gameId);
            this.user = localStorage.getItem('name');
            this.getContent();
        },
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .costs {
        font-size: 16;
        color: black;
        horizontal-align: center;
    }

    .img {
        height: 50;
        width: 50;
    }

    .jokerContainer {
        horizontal-align: center;
    }

    .btn-img{
        border-radius: 5;
        border-width: 1;
        margin: 10;
        border-color: #2b3c6a;
        height: 80;
        width: 80;
    }

    .questionContent{
        border-radius: 5;
        border-width: 1;
        color: black;
        margin: 10;
        font-size: 22;
        border-color: #2b3c6a;
        height: 130;
    }

    .question{
        vertical-align: center;
        margin-left: 10;
        margin-top: 40;
    }

    .btnAnswer {
        border-radius: 5;
        border-width: 1;
        color: white;
        background-color: black;
        margin: 8,8,8,10;
        font-size: 18;
        border-color: #2b3c6a;
        height: 80;
        width: 45%;
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

    .green {
        background-color: #53ba82;
    }

    .red {
        background-color: red;
    }

    .grey {
        background-color: #AAAAAA;
    }

    .inactive {
        visibility: collapsed;
    }

    .coins {
        horizontal-align: center;
        font-size: 20;
    }

</style>