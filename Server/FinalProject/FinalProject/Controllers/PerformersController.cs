using FinalProject.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerformersController : ControllerBase
    {
        // GET: api/<PerformersController>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(Performer.GetAllPerformers());
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }

        // GET api/<PerformersController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<PerformersController>
        [HttpPost]
        public IActionResult Post(Performer p)
        {
            try
            {
                return p.Insert() ? Ok(new {message = "Success"}) : BadRequest(new {message = "ERROR"});
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }

        // PUT api/<PerformersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<PerformersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpGet("GetTotalStreamsOfPerformer/PerformerID/{PerformerID}")]
        public IActionResult GetTotalStreamsOfPerformer(int PerformerID)
        {
            try
            {
                return Ok(Performer.GetTotalStreams(PerformerID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }

        [HttpGet("GetTotalFavoritesOfPerformer/PerformerID/{PerformerID}")]
        public IActionResult GetTotalFavoritesOfPerformer(int PerformerID)
        {
            try
            {
                return Ok(Performer.GetTotalFavorites(PerformerID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }
        [HttpGet("GetTotalFollowersOfPerformer/PerformerID/{PerformerID}")]
        public IActionResult GetTotalFollowersOfPerformer(int PerformerID)
        {
            try
            {
                return Ok(Performer.GetTotalFollowers(PerformerID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }
    }
}
