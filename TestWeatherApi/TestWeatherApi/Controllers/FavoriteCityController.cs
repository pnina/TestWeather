using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using TestWeatherApi.Context;
using TestWeatherApi.Dal;
using TestWeatherApi.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TestWeatherApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteCityController : ControllerBase
    {
        private readonly WeatherContext _context;
        public FavoriteCityController(WeatherContext context)
        {
            _context = context;
        }

        // GET: api/<FavoriteCityController>
        [HttpGet]
        public IEnumerable<FavoriteCity> Get()
        {
            return _context.FavoriteCity;
        }

        // POST api/<FavoriteCityController>
        [HttpPost]
        public void Post([FromBody] FavoriteCity value)
        {
            if (value == null)
                return;

            value.CreateDate = System.DateTime.Now;
            _context.FavoriteCity.Add(value);
            _context.SaveChanges();
        }
    }
}
