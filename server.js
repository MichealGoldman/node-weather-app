const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const argv = require('yargs').argv;
const fs = require('fs');

let data = JSON.parse(fs.readFileSync('config.json'));

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', function (req, res) {
    res.render('index', {weather: null, error: null});
  })

app.post('/', function(req, res){
    
    let city = req.body.city || 'new orleans';
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${data["apiKey"]}`;

    request (url, function(err, response, body){
        if(err){
            res.render('index', {weather: null, error: "Error, please try again"});
            console.log('Error: ', err);
        } else {
            let weather = JSON.parse(body);
            console.log(weather);
            if(weather == undefined){
                res.render('index', {weather: null, error: "Error, please try again"});
                console.log('Error: weather is undefined');
            } else if (weather.cod == '401'){
                res.render('index', {weather: null, error: "Error, please try again"});
                console.log('Error: invalide API key');
            } else {
                
                res.render('index', create_output(weather));
            }
        }
    });
});


var create_output = function(weather){



    let isRain = false;
    let isSnow = false;
    let rainText = "";
    let snowText = "";

    let direction = degToCard(weather.wind.deg);
    let nameText = `${weather.name} current weather`;
    let dateText = `${new Date()}`;
    let coordText = `${weather.coord.lon}, ${weather.coord.lat}`;

    let descText = "";
    weather.weather.forEach(element => {
        descText += ` ${element.description}`;
    });

    let tempText =  `Temperature: ${parseInt(weather.main.temp)} `;
    let humidityText = `Humidity:  ${weather.main.humidity}% `;
    let windspeedText = `Windspeed: ${parseInt(weather.wind.speed)} mph ${direction}`;
    let pressureText = `Barometric Pressure: ${weather.main.pressure}`;
    let cloudText = `Cloud cover: ${weather.clouds.all}%`;

    if (typeof weather.rain != "undefined"){
        console.log("rain is present")
        console.log(weather.rain)
        if(typeof weather.rain['1h'] != "undefined"){
            console.log("1h rain");
            console.log(`Rain volumn last hour: ${weather.rain['1h']}`);
            rainText = `Rain volumn last hour: ${weather.rain['1h']}`;
            isRain = true;
        }

        if(typeof weather.rain['3h'] != "undefined"){
            console.log("3h rain");
            rainText = `Rain volumn last 3 hours: ${weather.rain['3h']}`;
            isRain = true;
        }
    }
    if (typeof weather.snow != "undefined"){
        console.log("snow is present")
        if(typeof weather.snow['1h'] != "undefined"){
            snowText = `Snow volumn last 3 hours: ${weather.snow.snow1h}`;
            isSnow = true;
        }

        if(typeof weather.snow['3h'] != "undefined"){
            snowText = `Snow volumn last 3 hours: ${weather.snow.snow3h}`;
            isSnow = true;
        }
    }
    let riseText = `Sunrise: ${convertDate(weather.sys.sunrise)}`;
    let setText = `Sunset: ${convertDate(weather.sys.sunset)}`;

    if(isRain == true && isSnow == true){
        console.log("return rain and snow");
        return({weather: nameText,
            date: dateText,
            coord: coordText, 
            desc: descText,           
            temp: tempText, 
            humidity: humidityText,
            wind: windspeedText, 
            pressure: pressureText,
            clouds: cloudText,
            rain: rainText,
            snow: snowText,
            sunrise: riseText,
            sunset: setText,
            error: null})
    } else if(isRain == true){
        console.log("return rain");
        return({weather: nameText,
            date: dateText,
            coord: coordText, 
            desc: descText,           
            temp: tempText, 
            humidity: humidityText,
            wind: windspeedText, 
            pressure: pressureText,
            clouds: cloudText,
            rain: rainText,
            // snow: snowText,
            sunrise: riseText,
            sunset: setText,
            error: null})
    } else if(isSnow == true){
        console.log("return snow");
        return({weather: nameText,
            date: dateText,
            coord: coordText, 
            desc: descText,           
            temp: tempText, 
            humidity: humidityText,
            wind: windspeedText, 
            pressure: pressureText,
            clouds: cloudText,
            //rain: rainText,
            snow: snowText,
            sunrise: riseText,
            sunset: setText,
            error: null})
    } else {
        console.log("no rain/snow")
        return({weather: nameText,
            date: dateText,
            coord: coordText, 
            desc: descText,           
            temp: tempText, 
            humidity: humidityText,
            wind: windspeedText, 
            pressure: pressureText,
            clouds: cloudText,
            //rain: rainText,
            //snow: snowText,
            sunrise: riseText,
            sunset: setText,
            error: null})
    }
}


var convertDate = function(time){
    let date = new Date(time*1000);
    let hours = date.getHours();
    let minutes = 0 + date.getMinutes();
    return `${hours}:${minutes}`
}

var degToCard = function(deg){
    if (deg>11.25 && deg<33.75){
      return "NNE";
    }else if (deg>33.75 && deg<56.25){
      return "ENE";
    }else if (deg>56.25 && deg<78.75){
      return "E";
    }else if (deg>78.75 && deg<101.25){
      return "ESE";
    }else if (deg>101.25 && deg<123.75){
      return "ESE";
    }else if (deg>123.75 && deg<146.25){
      return "SE";
    }else if (deg>146.25 && deg<168.75){
      return "SSE";
    }else if (deg>168.75 && deg<191.25){
      return "S";
    }else if (deg>191.25 && deg<213.75){
      return "SSW";
    }else if (deg>213.75 && deg<236.25){
      return "SW";
    }else if (deg>236.25 && deg<258.75){
      return "WSW";
    }else if (deg>258.75 && deg<281.25){
      return "W";
    }else if (deg>281.25 && deg<303.75){
      return "WNW";
    }else if (deg>303.75 && deg<326.25){
      return "NW";
    }else if (deg>326.25 && deg<348.75){
      return "NNW";
    }else{
      return "N"; 
    }
  }


app.listen(3000, function() {
    console.log('Weather App listening on 3000');
});