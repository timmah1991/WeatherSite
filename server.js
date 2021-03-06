const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let tformat = req.body.format;
  let city = req.body.city;
  let apiKey = req.body.apikey;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${tformat}&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}! (${tformat} units.) The relative humidity level is ${weather.main.humidity}. The wind speed is ${weather.wind.speed} at a heading of ${weather.wind.deg}`;
        let LogText = `I have served weather data for ${req.body.city}`
        res.render('index', {weather: weatherText, error: null});
        console.log(LogText)
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
