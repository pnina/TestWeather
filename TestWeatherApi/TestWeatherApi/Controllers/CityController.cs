using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace TestWeatherApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public CityController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // GET api/<CityController>/bn
        [HttpGet("{query}")]
        public async Task<List<Location>> Get(string query)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(_configuration.GetValue<string>("AccuweatherApiUrl"));
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await client.GetAsync("locations/v1/cities/autocomplete?apikey=" + _configuration.GetValue<string>("AccuweatherApiKey") + "&q=" + query);

                //Checking the response is successful or not which is sent using HttpClient  
                if (Res.IsSuccessStatusCode)
                {
                    var ObjResponse = Res.Content.ReadAsStringAsync().Result;
                    return JsonConvert.DeserializeObject<List<Location>>(ObjResponse);

                }
                else
                    throw new Exception(Res.Content.ReadAsStringAsync().Result);
            }
        }
    }

    /*"Version": 1,
    "Key": "246239",
    "Type": "City",
    "Rank": 75,
    "LocalizedName": "Bni Boufrah",
    "Country": {
      "ID": "MA",
      "LocalizedName": "Morocco"
    },
    "AdministrativeArea": {
      "ID": "01",
      "LocalizedName": "Tanger-Tétouan-Al Hoceïma"
    }
  }*/
    public class Location
    {
        public int Key { get; set; }
        public string LocalizedName { get; set; }
    }
}
