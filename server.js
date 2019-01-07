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
                let direction = degToCard(weather.wind.deg);
                let nameText = `${weather.name} current weather`;
                let coordText = `${weather.coord.lon}, ${weather.coord.lat}`;
                let descText = `${weather.weather[0].description}`;
                let tempText =  `Temperature: ${parseInt(weather.main.temp)} `;
                let humidityText = `Humidity:  ${weather.main.humidity}% `;
                let windspeedText = `Windspeed: ${parseInt(weather.wind.speed)} mph ${direction}`;
                let pressureText = `Barometric Pressure: ${weather.main.pressure}`;
                let cloudText = `Cloud cover: ${weather.clouds}%`;
                let rain1Text = `Rain volumn last hour: ${weather.rain.rain1h}`;
                let rain3Text = `Rain volumn last 3 hours: ${weather.rain.rain3h}`;
                let snow1Text = `Snow volumn last 3 hours: ${weather.snow.snow1h}`;
                let snow3Text = `Snow volumn last 3 hours: ${weather.snow.snow3h}`;
                let riseText = `Sunrise: ${weather.sys.sunrise}`;
                let setText = `Sunset: ${weather.sys.sunset}`;
                res.render('index', {weather: nameText,
                                    coord: coordText, 
                                    desc: descText,           
                                    temp: tempText, 
                                    humidity: humidityText,
                                    wind: windspeedText, 
                                    pressure: pressureText,
                                    clouds: cloudText,
                                    error: null});
            }
        }
    });
});

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