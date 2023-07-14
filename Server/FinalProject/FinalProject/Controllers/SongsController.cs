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

        [HttpGet("GetTop15")]
        public IActionResult GetTop15(int UserID = -1)
        {
            try
            {
                return Ok(Song.GetTop15Songs(UserID));
            }
            catch(Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }
        [HttpGet("Search/query/{query}/UserID/{UserID}")]
        public IActionResult Search(string query, int UserID)
        {
            try
            {
                return Ok(Song.Search(query, UserID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }
        [HttpGet("GetSongLyrics/SongID/{SongID}")]
        public IActionResult GetSongLyrics(int SongID)
        {
            try
            {
                return Ok(Song.GetSongLyrics(SongID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }
        [HttpGet("GetPerformerSongs/PerformerID/{PerformerID}/UserID/{UserID}")]
        public IActionResult GetPerformerSongs(int PerformerID, int UserID)
        {
            try
            {
                return Ok(Song.GetPerformerSongs(PerformerID, UserID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }
        [HttpGet("GetMostPlayedTrack")]
        public IActionResult GetMostPlayedTrack()
        {
            try
            {
                return Ok(Song.GetMostPlayedTrack());
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }
        [HttpGet("GetGenreSongs/GenreID/{GenreID}")]
        public IActionResult GetGenreSongs(int GenreID)
        {
            try
            {
                return Ok(Song.GetGenreSongs(GenreID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
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
        // TEMP UPLOAD SONG
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
        // TEMP UPLOAD MP3
        [HttpPost("InsertSongHEXData")]
        public IActionResult InsertFileDataToSongID(int SongID, IFormFile file)
        {
            try
            {
                //Song SongToInsert = new Song(0, SongName, SongLyrics, 0, null, GenreID, ReleaseDate);
                bool res = Song.InsertFileDataToSongID(SongID, file);
                return res ? Ok(new { message = "File uploaded successfully" })
                    : BadRequest(new { message = "Couldn't insert file to SQL db" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
        // TEMP
        [HttpGet("GetSongByID/SongID/{SongID}")]
        public IActionResult GetSongByID(int SongID)
        {
            try
            {
                //Response.Headers["Content-Disposition"] = $"attachment; filename=\"{name}.mp3\"";
                // Return the audio file as a FileContentResult
                FileContentResult file = Song.ReadSongByID(SongID);
                Response.Headers["Content-Type"] = "audio/mpeg";
                Response.Headers["Access-Control-Allow-Headers"] = "range, accept-encoding";
                Response.Headers["Access-Control-Allow-Origin"] = "*";
                Response.Headers["Age"] = "3999";
                Response.Headers["Alt-Svc"] = "h3=\":443\"; ma=86400";
                Response.Headers["Cache-Control"] = "max-age=14400";
                Response.Headers["Cf-Cache-Status"] = "HIT";
                Response.Headers["Cf-Ray"] = "7e39481e5da77d95-TLV";
                int fileSize = file.FileContents.Length;
                Response.Headers["Content-Length"] = fileSize.ToString();
                Response.Headers["Accept-Ranges"] = "bytes";
                Response.Headers["Content-Range"] = $"bytes 0-{fileSize - 1}/{fileSize}";
                //Response.Headers["Date"] = "Sat, 08 Jul 2023 15:15:16 GMT";
                Response.Headers["Etag"] = "\"cb472-51bd07-4c9e757f2c940\"";
                //Response.Headers["Last-Modified"] = "Mon, 17 Sep 2012 15:22:37 GMT";
                Response.Headers["Nel"] = "{\"success_fraction\":0,\"report_to\":\"cf-nel\",\"max_age\":604800}";
                Response.Headers["Report-To"] = "{\"endpoints\":[{\"url\":\"https://a.nel.cloudflare.com/report/v3?s=IjPaZ4YY5%2BiQZ42KvSZ4q5iPR3%2BXljS69N8lEteBDdjnh0EkMalsQXR%2BtoV41huWqXQT7DAUwNwEcKbrrmnKgg0Oza07zCqSL8OxQIbg68p3JcHGhCcmT6FhAa4TEsOqFqw%3D\"}],\"group\":\"cf-nel\",\"max_age\":604800}";
                Response.Headers["Server"] = "cloudflare";
                Response.Headers["Vary"] = "Accept-Encoding";
                return Song.ReadSongByID(SongID);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}
