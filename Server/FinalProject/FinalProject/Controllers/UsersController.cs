using Microsoft.AspNetCore.Mvc;
using FinalProject.Models;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using System.Runtime.CompilerServices;

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
            // return Models.User.Zibi();
            return new string[] { "value1", "value2" };
        }

        // GET api/<UsersController>/5
        [HttpGet("IsUserVerified/id/{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                return Ok(Models.User.IsUserVerified(id));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        // POST api/<UsersController>
        [HttpPost]
        // Posts a new user into the user table - Register
        public IActionResult Post([FromBody] User u)
        {
            try
            {
                return u.Insert() ? Ok(new { message = "Registered!" }) : BadRequest(new { message = "ERROR!" });
            }
            catch (Exception e)
            {
                if (e.Message.Contains("UNIQUE KEY constraint")) // If the email is taken
                    return BadRequest(new { message = "This email is already taken" });
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
        [HttpPut("UpdateUserDetails")]
        public IActionResult Put(User u, string oldEmail)
        {
            try
            {
                return u.Update(oldEmail) ? Ok(new {message = "Updated"}) : BadRequest(new { message = "Server error, please try again later" });
            }
            catch (Exception e)
            {
                if (e.Message.Contains("UNIQUE KEY constraint"))
                    return BadRequest(new { message = "This email is already taken" });
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPut("InitiateNewValidation")]
        public IActionResult Put(int id)
        {
            try
            {
                return Models.User.InitiateNewValidation(id) ? Ok(new {message = "Check your email to verify the account"}) : BadRequest(new {message = "Server error, please try again later"});
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        // PUT api/<UsersController>/5
        [HttpPut("ValidateEmail")]
        public IActionResult Put(string email, string token)
        {
            try
            {
                // Don't forget to change the link of the verification and hear buttons in SendGrid whe you upload the project to Ruppin's server
                return Models.User.ValidateUser(email, token) ? Ok(new { message = "You're now verified" }) : BadRequest(new { message = "Server error, please try again later" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
