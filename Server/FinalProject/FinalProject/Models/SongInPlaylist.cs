namespace FinalProject.Models
{
    public class SongInPlaylist
    {
        private int playlistID;
        private int songID;

        public SongInPlaylist(int playlistID, int songID)
        {
            PlaylistID = playlistID;
            SongID = songID;
        }

        public int PlaylistID { get => playlistID; set => playlistID = value; }
        public int SongID { get => songID; set => songID = value; }
    }
}
