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

        [HttpGet("GetUserFavorites/UserID/{UserID}")]
        public IActionResult GetUserFavorites(int UserID)
        {
            try
            {
                return Ok(Models.User.GetUserFavorites(UserID));
            }
            catch (Exception e)
            {
                return BadRequest(new {message = "Server error " + e.Message });
            }
        }

        [HttpGet("LoadUserInformation")]
        public IActionResult LoadUserInformation()
        {
            try
            {
                return Ok(Models.User.LoadUserInformation());
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }
        [HttpGet("GetAdminReport")]
        public IActionResult GetAdminReport()
        {
            try
            {
                return Ok(Models.User.GetAdminReport());
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }


        [HttpGet("GetUserRegistrationDate/UserID/{UserID}")]
        public IActionResult GetUserRegistrationDate(int UserID)
        {
            try
            {
                return Ok(Models.User.GetRegistrationDate(UserID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }

        [HttpGet("GetUserXP/UserID/{UserID}")]
        public IActionResult GetUserXP(int UserID)
        {
            try
            {
                return Ok(Models.User.GetXP(UserID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
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
        // Login
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
        [HttpPost("PostUserFavorite/UserID/{UserID}/SongID/{SongID}")]
        public IActionResult PostUserFavorite(int UserID, int SongID)
        {
            try
            {
                return Ok(Models.User.PostUserFavorite(UserID, SongID));
            }
            catch (Exception e)
            {
                if (e.Message.Contains("PRIMARY KEY"))
                    return Ok(false);
                if (e.Message.Contains("FOREIGN KEY"))
                {
                    if (e.Message.Contains("UserID"))
                        return BadRequest(new { message = "This user doesn't exist" });
                    if (e.Message.Contains("SongID"))
                        return BadRequest(new { message = "This song doesn't exist" });
                }
                return BadRequest(new { message = e.Message });
            }
        }
        [HttpPost("FollowArtist/UserID/{UserID}/PerformerID/{PerformerID}")]
        public IActionResult FollowArtist(int UserID, int PerformerID)
        {
            try
            {
                return Ok(Models.User.FollowArtist(UserID, PerformerID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }
        [HttpDelete("UnfollowArtist/UserID/{UserID}/PerformerID/{PerformerID}")]
        public IActionResult UnfollowArtist(int UserID, int PerformerID)
        {
            try
            {
                return Ok(Models.User.UnfollowArtist(UserID, PerformerID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }
        [HttpDelete("DeleteUserFavorite/UserID/{UserID}/SongID/{SongID}")]
        public IActionResult DeleteUserFavorite(int UserID, int SongID)
        {
            try
            {
                return Ok(Models.User.DeleteFromFavorite(UserID, SongID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
        // User update details
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
        [HttpPut("AddUserXP/UserID/{UserID}/XP/{XP}")]
        public IActionResult Put(int UserID, int XP)
        {
            try
            {
                return Models.User.AddUserXP(UserID, XP) ? Ok(new { message = "Added" }) : BadRequest(new { message = "Server error, please try again later" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }
        [HttpGet("GetLeaderboard")]
        public IActionResult GetLeaderboard()
        {
            try
            {
                return Ok(Models.User.GetLeaderboard());
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }
        // Initiates a new email validation. Needed when the user wants to verify his email, but his old request timed out.
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
        // User clicked verify on his email
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
