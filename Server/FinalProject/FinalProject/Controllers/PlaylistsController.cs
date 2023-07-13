using FinalProject.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaylistsController : ControllerBase
    {
        // GET: api/<PlaylistsController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<PlaylistsController>/5
        [HttpGet("GetPlaylistSongs/PlaylistID/{PlaylistID}")]
        public IActionResult Get(int PlaylistID)
        {
            try
            {
                return Ok(Playlist.GetPlaylistSongs(PlaylistID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }

        [HttpGet("GetPlaylistName/PlaylistID/{PlaylistID}")]
        public IActionResult GetPlaylistName(int PlaylistID)
        {
            try
            {
                return Ok(Playlist.GetPlaylistName(PlaylistID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }

        // POST api/<PlaylistsController>
        [HttpPost]
        public IActionResult Post([FromBody] Playlist p)
        {
            try
            {
                return Ok(p.Insert());
            }
            catch(Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }

        // PUT api/<PlaylistsController>/5
        [HttpPut("InsertSongToPlaylist")]
        public IActionResult Put(SongInPlaylist s)
        {
            try
            {
                return Playlist.InsertSongToPlaylist(s) ? Ok(new { message = "Success!" }) : BadRequest(new { message = "SERVER ERROR" });
            }
            catch (Exception e)
            {
                if (e.Message.Contains("PRIMARY KEY constraint"))
                    return BadRequest(new { message = "This song is already in this playlist!" });
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }

        // DELETE api/<PlaylistsController>/5
        [HttpDelete("DeleteUserPlaylist/PlaylistID/{PlaylistID}/UserID/{UserID}")]
        public IActionResult Delete(int PlaylistID, int UserID)
        {
            try
            {
                return Playlist.DeleteUserPlaylist(UserID, PlaylistID) ? Ok(new { message = "Success!" }) : BadRequest(new { message = "SERVER ERROR" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }
        [HttpDelete("DeleteSongFromPlaylist/PlaylistID/{PlaylistID}/SongID/{SongID}")]
        public IActionResult DeleteSongFromPlaylist(int PlaylistID, int SongID)
        {
            try
            {
                return Playlist.DeleteSongFromPlaylist(PlaylistID, SongID) ? Ok(new { message = "Success!" }) : BadRequest(new { message = "SERVER ERROR" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "SERVER ERROR " + e.Message });
            }
        }
        [HttpGet("GetUserPlaylists/UserID/{UserID}")]
        public IActionResult GetUserPlaylists(int UserID)
        {
            try
            {
                return Ok(Playlist.GetUserPlaylists(UserID));
            }
            catch (Exception e)
            {
                return BadRequest(new { message = "Server error " + e.Message });
            }
        }
    }
}
