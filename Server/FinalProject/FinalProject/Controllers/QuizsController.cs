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
        [HttpGet("GetQuizForFirebase")]
        public IActionResult GetQuizForFirebase()
        {
            try
            {
                return Ok(new Quiz());
            }
            catch (Exception e)
            {
                return BadRequest("SERVER ERROR " + e.Message);
            }
        }

        // GET api/<QuizsController>/5
        [HttpGet("GetUserPastQuiz/UserID/{UserID}")]
        public IActionResult GetUserPastQuiz(int UserID)
        {
            try
            {
                return Ok(Quiz.GetUserPastQuiz(UserID));
            }
            catch (Exception e)
            {
                return BadRequest("SERVER ERROR " + e.Message);
            }
        }

        [HttpGet("GetUserPastQuizzesWithoutQuestions/UserID/{UserID}")]
        public IActionResult GetUserPastQuizzesWithoutQuestions(int UserID)
        {
            try
            {
                return Ok(Quiz.GetUserPastQuizzesNoQuestions(UserID));
            }
            catch (Exception e)
            {
                return BadRequest("SERVER ERROR " + e.Message);
            }
        }

        [HttpGet("GetQuizQuestions/QuizID/{QuizID}")]
        public IActionResult GetQuizQuestions(int QuizID)
        {
            try
            {
                return Ok(Quiz.GetQuizQuestions(QuizID));
            }
            catch (Exception e)
            {
                return BadRequest("SERVER ERROR " + e.Message);
            }
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
