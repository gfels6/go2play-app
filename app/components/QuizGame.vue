<template>
  <Page class="page">
    <ActionBar title="Quiz Game">
      <ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
        <StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
      </ActionItem>
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
      <Button :class="[{ inactive: !finished }, 'btn']" :text="btnBack"  @tap="changeRoute('quizOverview')" />

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
import * as application from "application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "application";
import { isAndroid } from "platform";
import TomService from '@/services/TomService';
let help = null;

export default {
  data() {
    return {
      // Name of the user
      user: "",
      // Round object with all questions and answers
      dataSet: "",
      question: "Frage",
      txtAnswer1: "Antwort 1",
      txtAnswer2: "Antwort 2",
      txtAnswer3: "Antwort 3",
      txtAnswer4: "Antwort 4",
      // Given answers of the user
      answers: [],
      // ID for the time interval (progressbar)
      intervalId: "",
      // Progressbar
      columns: "",
      // Enabling of the quiz answer buttons
      btnEnabled: true,
      // Getting set randomly
      positions: [1,2,3,4],
      // Setting the right answer green
      rightAnswer: 0,
      // If the user choose the wrong answer, set it red
      wrongAnswer: 0,
      // Iterates through all questions (3)
      questionNumber: 0,
      // Enabling of the "Next question" Button
      nextQuestion: false,
      btnNext: "Nächste Frage",
      btnBack: "Zurück zum Menü",
      // Enabling of the "Back to Main" Button
      finished: false,
      // Enabling of the Jokers
      play: true,
      joker: 0,
      // Wrong questions for the 50:50 Joker
      randomNumber: [],
      lblWalkerCoins: "Walker Coins: ",
      walkerCoins: 0,
      // Costs of the jokers
      costFiftyJoker: 50,
      costTimeJoker: 25,
      // Enabling of the Jokers
      btnJokerEnabled: true,
      // an object wrapping the image path, so it can be passed to TomService
      tom: {
        img: "~/assets/images/tom.png",
        saidsomething: false,
        notif_text: ""
      }

    };
  },
  name: 'quizgame-view',
  props: ['gameId'],
  methods: {
    changeRoute(to) {
        this.$navigateTo(this.$routes[to], {
        clearHistory: true,
        props: {
          gameId: this.gameId,
        }
      });
    },
    /*
    This function handles the push events on Tom Turnschuh Icon in the Actionbar

    parameters  none
    returns     nothing
    author      hessg1
    version     2019-01-07
    */
    tomTurnschuh(){
      if(this.tom.notif_text != ""){
        help.say(this.tom.notif_text);
        this.tom.notif_text = "";
      }
      else{
        help.say("Tippe auf das Feld mit der richtigen Antwort.\n\nWenn du genug Walker Coins hast, kannst du dir Joker kaufen.\nDer Zeit-Joker gibt dir zusätzliche Zeit zum Nachdenken.\nDer 50:50-Joker blendet zwei der falschen Antworten aus.");
      }

    },

    /*
    Request for the actual round with all questions and answers

    author      gfels6
    version     2019-01-07
    */
    getContent() {
      backendService.getActualRound(this.gameId, this.user)
      .then(data => {
        this.dataSet = data;
        this.startQuiz();
      })
    },
    // Value for the progressbar width
    setProgressbarWidth(percent) {
      this.columns = percent + "*," + (100 - percent) + "*";
    },

    // Set a Interval that will be executed all 120ms 
    setUpProgressbar(){
      let percent = 100;
      this.intervalId = setInterval(() => {
        this.setProgressbarWidth(percent);
        percent--;
        if (percent < 0) {
          clearInterval(this.intervalId);
          this.onTappedAnswer(0);
          help.notify("Versuche die Frage zu beantworten bevor die Zeit abläuft. Achte dafür auf den Balken unter den Antworten.\n\nFalls du etwas überlegen musst, kannst du dir einen Zeit-Joker kaufen.", 1000);
        }
      }, 120);
    },

    // Reset of all enabling and colorizing of the buttons
    startQuiz(){
      this.getWalkerCoins();
      this.btnEnabled = true;
      this.play = true;
      this.joker = 0;
      this.rightAnswer = 0;
      this.wrongAnswer = 0;
      this.nextQuestion = false;
      this.randomNumber = [];
      this.setQuestion(this.questionNumber);
    },

    // All Questions and answers will be pushed in the buttons/labels (Before shuffle the position array)
    setQuestion(number){
      this.question = this.dataSet.gameQuestions[number].question;
      this.shuffleArray(this.positions);

      for (let i = 0; i < this.positions.length; i++) {
        this["txtAnswer"+(this.positions[i])] = this.dataSet.gameQuestions[number].answers[i];
      }

      this.setUpProgressbar();
    },

    // The correct answer is everytime number 1 (index 0), to shuffle this random, we used a randomization of the positions
    // Afterwards the this.positions[0] is the correct one
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },

    // Evaluating the clicked answer (position[0] is the correct one)
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
      } else {
        this.wrongAnswer = id;
      }

      // Repeat the hole methods to get into round 2 and round 3 (last one)
      if(this.questionNumber == 0 || this.questionNumber == 1) {
        this.questionNumber++;
        this.nextQuestion = true;
      } else if (this.questionNumber == 2) {
        /*
        This function handles the push events on Tom Turnschuh Icon in the Actionbar

        parameters  gameId: actual id of the game
                    user: name of the user
                    dataSet.roundNumber: Actual round number
                    answers: Array of the given answers (3)
        returns     nothing
        author      gfels6
        version     2019-01-07
        */
        backendService.setAnswers(this.gameId, this.user, this.dataSet.roundNumber, this.answers)
        .then(data => {
          console.log("answer logged into backend!");
        })
        this.finished = true;
      }


    },
    // Handles if the time joker is clicked (checks if you have enough walker coins)
    jokerTime() {
      if(this.walkerCoins >= this.costTimeJoker) {
        let correctCoins = this.walkerCoins - this.costTimeJoker;
        this.walkerCoins = correctCoins;
        backendService.updateParameter(this.user, "walkerCoins", correctCoins)
        .then(data => {
        })

        clearInterval(this.intervalId);
        this.setUpProgressbar();
      } else {
        help.say("Du hast leider nicht genügend Walker Coins um den Zeit-Joker zu nutzen.");
      }

    },

    // Handles if the 50:50 joker is clicked
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
      } else {
        help.say("Du hast leider nicht genügend Walker Coins um den 50:50-Joker zu nutzen.");
      }

    },

    // Request for the walker coins
    getWalkerCoins(){
      backendService.getUser(this.user)
      .then(data => {
        this.walkerCoins = data.walkerCoins;
      })
    }
  },
  mounted() {
    console.log("mounted game: " + this.gameId);
    // initialize Tom Turnschuh
    help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);
    this.user = localStorage.getItem('name');
    this.getContent();

    if (isAndroid) {
      application.android.on(AndroidApplication.activityBackPressedEvent, (AndroidActivityBackPressedEventData) => {
        AndroidActivityBackPressedEventData.cancel = true; // prevents default back button behavior
      })
    }
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
