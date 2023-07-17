using FinalProject.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizsController : ControllerBase
    {
        // GET: api/<QuizsController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<QuizsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<QuizsController>
        [HttpPost("StartQuiz/UserID/{UserID}")]
        public IActionResult Post(int UserID)
        {
            try
            {
                return Ok(new Quiz(UserID));
            }
            catch (Exception e)
            {
                return BadRequest("SERVER ERROR " + e.Message);
            }
        }

        // PUT api/<QuizsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<QuizsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
