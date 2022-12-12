require("dotenv").config();
const exp = require("constants");
const express = require("express");
const https = require("node:https");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${process.env.APP_ID}`;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);

      const statusCode = weatherData.cod;
      if (statusCode === "404") {
        res.status(404).send("Sorry, city not found!");
      }

      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.write(`<p>The weather is currently ${weatherDescription}.</p>`);
      res.write(
        `<h1>The termperature in ${query} is ${temp} degree Celcius.</h1>`
      );
      res.write(`<img src=${imgURL}>`);
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
