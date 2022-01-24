using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using TestWeatherApi.Context;
using TestWeatherApi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestWeatherApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherForecastController : ControllerBase
    {
        private readonly WeatherContext _context;
        private readonly IConfiguration _configuration;
        public WeatherForecastController(WeatherContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET api/<WeatherForecastController>/ar
        [HttpGet("{cityKey}")]
        public async Task<WeatherForecastSummary> Get(string cityKey)
        {
            WeatherForecast forecast = _context.WeatherForecast.Where(w => w.CityKey == cityKey && w.LastUpdate.Date == System.DateTime.Today.Date).FirstOrDefault();
            if (forecast == null)
            {
                // get forecast from api
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri( _configuration.GetValue<string>("AccuweatherApiUrl"));
                    client.DefaultRequestHeaders.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage Res = await client.GetAsync("forecasts/v1/daily/1day/" + cityKey + "?apikey=" + _configuration.GetValue<string>("AccuweatherApiKey"));

                    //Checking the response is successful or not which is sent using HttpClient  
                    if (Res.IsSuccessStatusCode)
                    {
                        var ObjResponse = Res.Content.ReadAsStringAsync().Result;

                        //save forecast to DB
                        forecast = new WeatherForecast()
                        {
                            CityKey = cityKey,
                            LastUpdate = DateTime.Now,
                            Summary = ObjResponse
                        };
                        _context.WeatherForecast.Add(forecast);
                        _context.SaveChanges();

                        return JsonConvert.DeserializeObject<WeatherForecastSummary>(ObjResponse);
                    }
                    else
                    {
                        throw new Exception(Res.Content.ReadAsStringAsync().Result);
                    }
                }                
            }
            return JsonConvert.DeserializeObject<WeatherForecastSummary>(forecast.Summary);
        }
    }
    public class WeatherForecastSummary
    {
        public Headline headline { get; set; }
        public class Headline
        {
            public string Text { get; set; }
            public string Category { get; set; }
        }
    }
}

/*
 * {
  "Headline": {
    "EffectiveDate": "2022-01-23T19:00:00+02:00",
    "EffectiveEpochDate": 1642957200,
    "Severity": 5,
    "Text": "Rain Sunday evening",
    "Category": "rain",
    "EndDate": "2022-01-24T01:00:00+02:00",
    "EndEpochDate": 1642978800,
    "MobileLink": "http://www.accuweather.com/en/il/jerusalem/213225/daily-weather-forecast/213225?lang=en-us",
    "Link": "http://www.accuweather.com/en/il/jerusalem/213225/daily-weather-forecast/213225?lang=en-us"
  },
  "DailyForecasts": [
    {
      "Date": "2022-01-20T07:00:00+02:00",
      "EpochDate": 1642654800,
      "Temperature": {
        "Minimum": {
          "Value": 34,
          "Unit": "F",
          "UnitType": 18
        },
        "Maximum": {
          "Value": 41,
          "Unit": "F",
          "UnitType": 18
        }
      },
      "Day": {
        "Icon": 4,
        "IconPhrase": "Intermittent clouds",
        "HasPrecipitation": false
      },
      "Night": {
        "Icon": 35,
        "IconPhrase": "Partly cloudy",
        "HasPrecipitation": false
      },
      "Sources": [
        "AccuWeather"
      ],
      "MobileLink": "http://www.accuweather.com/en/il/jerusalem/213225/daily-weather-forecast/213225?day=1&lang=en-us",
      "Link": "http://www.accuweather.com/en/il/jerusalem/213225/daily-weather-forecast/213225?day=1&lang=en-us"
    }
  ]
}
 */
