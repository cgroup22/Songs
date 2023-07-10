using FinalProject.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        // GET: api/<ArtistsController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ArtistsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [HttpGet("GetFeaturedArtists")]
        public IActionResult GetFeaturedArtists()
        {
            try
            {
                return Ok(Performer.GetFeaturedArtists());
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }

        [HttpGet("ArtistImage/artistName/{artistName}")]
        public async Task<IActionResult> InsertArtist(string artistName)
        {
            try
            {
                string b = await Artist.InsertArtist(artistName);
                return b == null ? Ok(b) : BadRequest(new { message = "ERROR" });
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // POST api/<ArtistsController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ArtistsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ArtistsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
