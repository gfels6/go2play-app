import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color";

const feedBack = new Feedback();
// the color of toms toasts
const colour = new Color("#444444");
const duration = 6000;

//to be initialized in constructor
var tom = {img: null};
var Vibrate = null;
var vib = null;
var last = "";


export default class TomService {
  /*
  Constructor of TomService class.
  The vibrator object must be passed on, because it can't be initialized on
  android before page is mounted

    parameters  - vibrator: a Vibrator Object
                - aTom: an Object with 'img' property that is used for displaying Tom in the GUI
    returns     - nothing
    author      hessg1
    version     2019-01-06
  */
  constructor(vibrator, aTom){
    Vibrate  = vibrator; //require("nativescript-vibrate").Vibrate;
    vib = new Vibrate();
    tom = aTom;
    last = "";
  }

  /*
  Displays the user a message from tom.

    parameters  - text: The main text of the notification
    returns     nothing
    author      hessg1
    version     2019-01-06
  */
  say(text){
    this.last = text;
    feedBack.show({
      title: "Tom Turnschuh sagt:",
      message: text,
      duration: (text.length > 150) ? 2*duration : duration, // longer strings must be displayed for a longer time
      backgroundColor: colour,
      onHide: () => {tom.img = "~/assets/images/tom.png"}
    });
    tom.img = "~/assets/images/tom_laugh.png";
    tom.saidsomething = true;
  }

  /*
  Repeats the last message from tom

    parameters  none
    returns     nothing
    author      hessg1
    version     2019-01-07
  */
  sayLast(){
    feedBack.show({
      title: "Tom Turnschuh sagt:",
      message: last,
      duration: 5000,
      backgroundColor: colour,
      onHide: () => {tom.img = "~/assets/images/tom.png"}
    });
    tom.img = "~/assets/images/tom_laugh.png";
  }

  /*
  Displays a question from tom and allows the user to pick one of several answers.

    parameters  - text: The main text of the notification
                - answers: an array with the options the user can pick for answering
    returns     - a promise with the text of the answer the user picked
    author      hessg1
    version     2019-01-06
  */
  sayWithOptions(text, answers) {
    tom.img = "~/assets/images/tom_laugh.png";
    return new Promise(function (resolve, reject) {
      feedBack.show({
        title: "Tom Turnschuh sagt:",
        message: text,
        duration: 10000,
        backgroundColor: colour,
        onHide: () => {
          tom.img = "~/assets/images/tom_dontknow.png";
        }
      });
      setTimeout(()=>{
        action("Deine Frage an Tom:", "abbrechen", answers)
          .then(result => {
            feedBack.hide();
            tom.img = "~/assets/images/tom_laugh.png";
            if(result == "abbrechen") {
              reject("no response");
            }
            else resolve(result);
          });
        }, 500);
    });
  }

  /*
  Sets a Notification Badge on the Tom icon and vibrates the phone

    parameters  - text: the text to be shown after notify was triggered
                        ("" for only vibrating and show badge)
                - delay: the delay in MS until the notification should be shown
    returns     - nothing, manipulates GUI
    author      hessg1
    version     2019-01-06
  */
  notify(text, delay){
    if(text != ""){
      tom.notif_text = text;
    }
    setTimeout(()=>{
      tom.img = "~/assets/images/tom_alert.png";
      vib.vibrate(200);
    }, delay);

  }




}
