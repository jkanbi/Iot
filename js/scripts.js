console.log("Begin Connect");
var ctx = document.getElementById('containerforChart');

  var data1=0.00;
  var data2=0.00;
  var data3=0.00;
  var data4=0.00;
  var data5=0.00;
  var calculated_pressure;
var maxDataPoints =44;  //Max data points

Chart.defaults.global.defaultFontSize = 10;

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
          data: [],
          label: "Flow Temp 1",
          borderColor: "#cc0000",
          borderWidth: 5,
          fill: false
          },
          {
          data: [],
          label: "Return Temp 2",
          borderColor: "#0033cc",
          borderWidth: 5,
          fill: false
        },
          {
          data: [],
          label: "HW Temp 3",
          borderColor: "#ff8080",
          fill: false
        },
          {
          data: [],
          label: "CW Temp 4",
          borderColor: "#99b3ff",
          fill: false
        },
        {
          yAxisID: 'Pressure',
          data: [],
          label: "Pressure",
          borderColor: "#000000",
          fill: false
        }
        ]
      },   // , added
      options: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'index',
          intersect: false
        },
        scales: {
              yAxes: [
              {   
                  id: 'Temperature',
                  name: 'Temperature',
                  scaleLabel: {
                      display: true,
                      labelString: 'Temperature'
                  },
                  ticks: {
                      //suggestedMin: 0,
                      //beginAtZero: true,
                      min: 0,
                      suggestedMax: 75,
                      stepSize: 5
                  }
              },
              {
                id: 'Pressure',
                name: 'Pressure', //B
                type: 'linear',
                position: 'right',
                scalePositionLeft: false,
                min: 0,
                max: 10, 
                scaleLabel: {
                      display: true,
                      labelString: 'Pressure'
                  },
                ticks: {
                      suggestedMin: 0,
                      suggestedMax: 6,
                      stepSize: 0.5
                  }
              }
            ] //dataset ends here
        } //scales ends here
 
      }  //Data ends here
    
});

  function removeData(){
    myChart.data.labels.shift();
    myChart.data.datasets[0].data.shift();
    myChart.data.datasets[1].data.shift();
    myChart.data.datasets[2].data.shift();
    myChart.data.datasets[3].data.shift();
    myChart.data.datasets[4].data.shift();
  }

function addData(label, data1,data2,data3,data4,data5) {
    if(myChart.data.labels.length > maxDataPoints) removeData();
    myChart.data.labels.push(label);
    myChart.data.datasets[0].data.push(data1);
    myChart.data.datasets[1].data.push(data2);
    myChart.data.datasets[2].data.push(data3);
    myChart.data.datasets[3].data.push(data4);
    myChart.data.datasets[4].data.push(data5);
    myChart.update();
  }
/*
//  function addData(chart, label, data,sIndex) {
      if(chart.data.labels.length > maxDataPoints) removeData();
      chart.data.labels.push(label);
      chart.data.datasets[sIndex].data.push(data);
      //chart.data.datasets.forEach((dataset) => {
      //    dataset.data.push(data);
      //});
      chart.update();
  }
*/  
/*
//  function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
*/
var labelsNew = ["W"];
var dataNew = [20.5];
var fetchdata = document.getElementById('containerforChart');
//  for (i = 0; i < 1; i++) {
//  setTimeout( function timer(){
//            //addData(myChart,labelsNew,dataNew,0);
//            //addData(myChart,labelsNew,dataNew,1);
//      }, i*3000 ); 
//  }

var secondslast;
var seconds;
// Create a client instance
//client = new Paho.MQTT.Client(location.hostname, Number(location.port), "clientId");

console.log("Prepare Document Ready function");

 $(document).ready(function(){
    $("#btn").click( function() {
        var url = "./?serialno=" + $("#text").val();
        window.open(url,"_self");
    });
})

const queryString = window.location.search;
console.log(queryString);
// ?serialno=XXXXXXXXXXX
const urlParams = new URLSearchParams(queryString);
const serialno = urlParams.get('serialno');
console.log(serialno);
var basetopic = serialno+'/'
//console.log(basetopic);

$(document).ready(function(){
    $("#SerialNo").val(serialno);
    $('#serialno').text(basetopic);
});

console.log ("Start MQTT ConnectionMYB");

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

var clientid = makeid(14);
console.log(clientid);
//client = new Paho.MQTT.Client("wss://test.mosquitto.org:8081/",clientid);
client = new Paho.MQTT.Client("wss://mqtt.eclipse.org/mqtt",clientid);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe(basetopic+"+");
  //message = new Paho.MQTT.Message("Hello");
  //client.send(message);
}


//https://www.tutorialrepublic.com/faq/how-to-get-the-value-of-selected-radio-button-using-jquery.php
$(document).ready(function(){
        $("input[type='button']").click(function(){
            var radioValue = $("input[name='psensorType']:checked").val();
            if(radioValue){
                //alert("Your are a - " + radioValue);
                setPressureRange(radioValue);
            }
        });
    });

//https://www.eclipse.org/paho/clients/js/
function setPressureRange(radioValue){
	$(document).ready(function(){
    var message;
		var setPressureRange = radioValue;
		console.log(setPressureRange);
    message = new Paho.MQTT.Message(setPressureRange);
    message.destinationName = basetopic + "pressure_range";
    client.send(message);
	})
}
//*/

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
    
    //Try to reconnect after lost connection
    client.connect({onSuccess:onConnect});
  }
}

var pressure_range;

// called when a message arrives
function onMessageArrived(message) {
  //console.log("onMessageArrived:"+message.payloadString);
  //console.log("onMessageArrived:"+message.destinationName);
  
  var today = new Date();
  //var t = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var t = today.toLocaleTimeString();
  var x = 0;
  var raw_pressure;

  switch (message.destinationName) {
  case basetopic+'temp1':
      $(document).ready(function(){
        $('#Temp1Flow').text(message.payloadString);
      });
      data1= parseFloat(message.payloadString);
      //addData(t,data1,[0]);
      if (data1 == -127.00){
        data1 = 0.00
      }
 
    break;
  case basetopic+'temp2':
      $(document).ready(function(){
        $('#Temp2Return').text(message.payloadString);
      });
      data2= parseFloat(message.payloadString);
      //addData(t,data2,[1]);
      if (data2 == -127.00){
        data2 = 0.00
      }
    break;
  
  case basetopic+'temp3':
      $(document).ready(function(){
        $('#Temp3HW').text(message.payloadString);
      });
      data3= parseFloat(message.payloadString);
      if (data3 == -127.00){
        data3 = 0.00
      }
      //addData(t,data3,[2]);
    break;
    
  case basetopic+'temp4':
      $(document).ready(function(){
          $('#Temp4Cold').text(message.payloadString);
      });
      data4= parseFloat(message.payloadString);
      if (data4 == -127.00){
        data4 = 0.00
      }
      //addData(t,data4,[3]);
  break;
  
  case basetopic+'pressure':
      $(document).ready(function(){
          $('#Pressure').text(message.payloadString);
      });
      if (isNaN(calculated_pressure)){
      	data5 = parseFloat(message.payloadString);
  	  } else {
  	  	data5 = calculated_pressure;
  	  }
      //addData(t,data5,[4]);
  break;

  case basetopic+'pressure_range':
      $(document).ready(function(){
          $('#pressure_range').text(message.payloadString);
          //console.log(message.payloadString);
          pressure_range = parseFloat(message.payloadString);
          //console.log(pressure_range);  
      });
  break; 

  case basetopic+'pressureadc':
      $(document).ready(function(){
          $('#pressureadc').text(message.payloadString);
          //console.log(message.payloadString);
          pressureadc = parseFloat(message.payloadString);
          //console.log(pressure_range);  
      });
  break; 

  case basetopic+'raw_pressure':
      $(document).ready(function(){
          raw_pressure = parseFloat(message.payloadString);
          //console.log(raw_pressure);
          $('#raw_pressure').text(message.payloadString);
          calculated_pressure = (raw_pressure * pressure_range).toFixed(2);
          //console.log(pressure_range);
          //console.log(calculated_pressure);
          $('#calculated_pressure').text(calculated_pressure);
      });
  break;
  
  case basetopic+'relay1':
      $(document).ready(function(){
          $('#relay1').text(message.payloadString);
      });
  break;
  
  case basetopic+'timelastseen':
  $(document).ready(function(){
      $('#timelastseen').text(message.payloadString);
  });
  break;

  case basetopic+'tempdiff':
  $(document).ready(function(){
      $('#tempdiff').text(message.payloadString);
  });
  break;
  
  default:
    //console.log(`Sorry, we are out of ${expr}.`);
  }
  
  //var today = new Date();
  // var t = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  //addData(t, data1, data2, data3,data4,data5);
  x = x+1;
  if (x = 5){
        if (secondslast!=today.getSeconds()){
        addData(t, data1, data2, data3,data4,data5);
        x= 0;
        }
        secondslast=today.getSeconds();
  }
  //console.log(today.getSeconds());
  
}
