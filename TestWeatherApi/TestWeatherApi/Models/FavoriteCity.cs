using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestWeatherApi.Models
{
    public class FavoriteCity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Ip { get; set; }
        public string CityKey { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
