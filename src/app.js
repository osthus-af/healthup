/**
*Copy right osthus-ame, all rights reserved 2015.
**/

var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');


var Light = require('ui/light');
var Vibe = require('ui/vibe');


Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
  Pebble.openURL('http://healthup.gadmeer.de/');
});
Pebble.addEventListener('webviewclosed', function(e) {
// Decode and parse config data as JSON
  console.log(JSON.stringify(e));
  var config_data = JSON.parse(e.data);
  console.log(e.data);
  console.log(config_data.access_token);
  console.log('Config window returned: ', JSON.stringify(config_data));
  Settings.option(config_data);
});
var upInfos = Settings.option();
console.log(JSON.stringify(upInfos));
// Show splash screen while waiting for data
var splashWindow = new UI.Card({
  title: 'UP3 data ',
  icon: 'images/menu_icon.png',
  subtitle: res,
  body: 'Loading...'
});







var toHHMMSS = function (sec) {
    var sec_num = parseInt(sec, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

var main = new UI.Card({
  title: 'UP3 data ',
  icon: 'images/menu_icon.png',
  subtitle: res,
  body: 'Loading...'
});


var rightNow = new Date();
var res = rightNow.toISOString().slice(0,10).replace(/-/g,"");


var go = function (){


//get data
splashWindow.body("sleeps");
  splashWindow.show();

var sleeps = getUpData("https://jawbone.com/nudge/api/v.1.1/users/@me/sleeps",res);
  splashWindow.body("moves");
    splashWindow.show();

var moves = getUpData("https://jawbone.com/nudge/api/v.1.1/users/@me/moves",res);
  splashWindow.body("hr");
    splashWindow.show();

var hr = getUpData("https://jawbone.com/nudge/api/v.1.1/users/@me/heartrates",res);



var steps = (moves.data.items.length!== 0) ? moves.data.items[0].details.steps:0;
var distance = (moves.data.items.length!==0)?moves.data.items[0].details.km:0;
    
var rhr = (hr.data.items.length !==0)?hr.data.items[0].resting_heartrate:0;
var sleep = (sleeps.data.items.length !==0)?toHHMMSS(sleeps.data.items[0].details.duration):0;

console.log(JSON.stringify(sleeps));

main.body("steps: "+steps + "\ndist.: "+distance+"km"+"\nheartrate: "+rhr+"\nsleep: "+sleep);
splashWindow.hide();
main.show();
Light.trigger();
Vibe.vibrate('double');
Light.trigger();
   
};
    
function getUpData(url,date){
  var ajax = require('ajax');
  var ajaxData = undefined;
  var buildURL = url+"?date="+date;
  console.log("requesting data for " + buildURL);
   ajax({
        url:buildURL,
        type:'json',
        async:false,
        headers: { 'Authorization': "Bearer "+upInfos.access_token,
                  "Accept": "application/json"}
      },
      function(data2) {
        ajaxData = data2;     
        console.log("got data:");
        console.log(JSON.stringify (ajaxData));
      },
      function(error) {
        console.log("error while downloading: ");
        console.log(JSON.stringify (error));
        ajaxData = error;
        }
    );
  return ajaxData;  
}



if(!(upInfos !== undefined && upInfos !== false && upInfos.access_token !==undefined)){
  var infoWindow = new UI.Card({
  title: 'UP3 data ',
  icon: 'images/menu_icon.png',
  subtitle: res,
  body: 'Open the settings dialog and connect to jawbone'
});
  infoWindow.show();
}
else {
  
  splashWindow.show();
setTimeout(go,200);

  
}


/*
main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
*/