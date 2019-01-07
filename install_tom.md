# this file describes how to integrate Tom Turnschuh into a component

## put this in the template:```
<ActionItem @tap="tomTurnschuh" ios.position="right" android.position="actionBar" >
<StackLayout><Image :src="tom.img" width="40" height="40" /></StackLayout>
</ActionItem>


``
## put this with the imports:```
import TomService from '@/services/TomService'
let help = null;


``
## this goes with return{}```
// an object wrapping the image path, so it can be passed to TomService
tom: {
  img: "~/assets/images/tom.png",
  saidsomething: false,
  notif_text: ""
}


``
## this belongs to methods{} (and can of course be adjusted)```
/*
This function handles the push events on Tom Turnschuh Icon in the Actionbar

parameters  none
returns     nothing
author      hessg1
version     2019-01-07
*/
tomTurnschuh(){
  help.say("Hallo!")
},


``
## and this in mounted {} (!not with the imports, because then vibrating does not work on android)```
// initialize Tom Turnschuh
help = new TomService(require("nativescript-vibrate").Vibrate, this.tom);


``
