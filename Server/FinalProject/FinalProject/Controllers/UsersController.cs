using Microsoft.AspNetCore.Mvc;
using FinalProject.Models;
using System.Data.SqlClient;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // GET: api/<UsersController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<UsersController>
        [HttpPost]
        // Posts a new user into the user table
        public IActionResult Post([FromBody] User u)
        {
            try
            {
                return u.Insert() ? Ok(new { message = "Registered!" }) : BadRequest(new { message = "ERROR!" });
            }
            catch (Exception e)
            {
                if (e.Message.Contains("Violation of PRIMARY KEY constraint"))
                    return BadRequest(new { message = "This user already exists!" });
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPost("Login")]
        public IActionResult Post(string email, string password)
        {
            try
            {
                return Ok(Models.User.Login(email, password));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
