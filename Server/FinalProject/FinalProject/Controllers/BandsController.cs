using Microsoft.AspNetCore.Mvc;
using FinalProject.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BandsController : ControllerBase
    {
        // GET: api/<BandsController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<BandsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<BandsController>
        [HttpPost]
        public IActionResult Post([FromBody] Band b, [FromForm] IFormFile file)
        {
            try
            {
                b.Test(file);
                return Ok(b);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        // PUT api/<BandsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<BandsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
