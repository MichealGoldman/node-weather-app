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
    
    let city = argv.c || 'neworleans';
    let url = 'http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${data["apiKey"]}';

    request (url, function(err, response, body){
        if(err){
            console.log('error: ', err);
            res.render('index', {weather: null, error: "Error, please try again"});
            console.log('Error: ', err);
        } else {
            let weather = JSON.parse(body);
            console.log(JSON.parse(body));
            if(weather == undefined){
                res.render('index', {weather: null, error: "Error, please try again"});
                console.log('Error: weather is undefined');
            } else if (weather.cod == '401'){
                res.render('index', {weather: null, error: "Error, please try again"});
                console.log('Error: invalide API key');
            } else {
                let weatherText = "It's ${weather.main.temp} degrees in ${weather.name}!";
                res.render('index', {weather: weatherText, error: null});
                console.log('what you got is:  ', weatherText);
            }
        }
    });
});



app.listen(3000, function() {
    console.log('Weather App listening on 3000');
});