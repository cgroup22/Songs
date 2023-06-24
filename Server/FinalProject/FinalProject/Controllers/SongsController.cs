using FinalProject.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        // GET: api/<SongsController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<SongsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<SongsController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<SongsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<SongsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        [HttpPost("UploadSong")]
        //public IActionResult UploadSong(string SongName, string SongLyrics, DateTime ReleaseDate, int GenreID, IFormFile file)
        public IActionResult UploadSong([FromBody] Song SongToInsert, [FromForm] IFormFile file)
        {
            // return Ok(SongToInsert);
            try
            {
                //Song SongToInsert = new Song(0, SongName, SongLyrics, 0, null, GenreID, ReleaseDate);
                bool res = SongToInsert.Insert(file);
                return res ? Ok(new { message = "File uploaded successfully" }) : BadRequest(new { message = "Couldn't insert file to SQL db" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPost("InsertSongHEXData")]
        public IActionResult InsertFileDataToSongID(int SongID, int ReleaseYear, int GenreID, IFormFile file)
        {
            try
            {
                //Song SongToInsert = new Song(0, SongName, SongLyrics, 0, null, GenreID, ReleaseDate);
                bool res = Song.InsertFileDataToSongID(SongID, ReleaseYear, GenreID, file);
                return res ? Ok(new { message = "File uploaded successfully" })
                    : BadRequest(new { message = "Couldn't insert file to SQL db" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet("GetSongByID")]
        public IActionResult GetSongByID(int SongID)
        {
            try
            {
                //Response.Headers["Content-Disposition"] = $"attachment; filename=\"{name}.mp3\"";
                //Response.Headers["Content-Type"] = "audio/mpeg";

                // Return the audio file as a FileContentResult
                Song d = Song.ReadSongByID(SongID);
                return d.FileData;
                //return Ok(new FileStreamResult(d.FileData, "audio/mpeg"));
                //return Ok(Song.ReadSongByID(SongID));
                //return Ok(db.ReadSong(name));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}
