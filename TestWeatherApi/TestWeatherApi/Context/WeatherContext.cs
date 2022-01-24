using Microsoft.EntityFrameworkCore;
using TestWeatherApi.Models;

namespace TestWeatherApi.Context
{
    public class WeatherContext : DbContext
    {
        public WeatherContext(DbContextOptions options)
            : base(options)
        {

        }

        public DbSet<FavoriteCity> FavoriteCity { get; set; }
        public DbSet<WeatherForecast> WeatherForecast { get; set; }

    }
}