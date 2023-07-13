namespace FinalProject.Models
{
    public class Playlist
    {
        private int id;
        private string name;
        private int userID;

        public Playlist(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public int UserID { get => userID; set => userID = value; }

        public object Insert()
        {
            if (this == null)
                throw new ArgumentException("ERROR");
            if (name == null || name == "")
                throw new ArgumentException("Enter playlist name!");
            DBservices db = new DBservices();
            return db.Insert(this);
        }
        public static bool InsertSongToPlaylist(SongInPlaylist s)
        {
            if (s == null)
                throw new ArgumentException("SERVER ERROR");
            DBservices db = new DBservices();
            return db.InsertSongToPlaylist(s) > 0;
        }
        public static List<Playlist> GetUserPlaylists(int UserID)
        {

            if (UserID < 1)
                throw new ArgumentException("User doesn't exist");
            DBservices db = new DBservices();
            return db.GetUserPlaylists(UserID);
        }
        public static bool DeleteUserPlaylist(int UserID, int PlaylistID)
        {
            if (UserID < 1)
                throw new ArgumentException("This user doesn't exist");
            if (PlaylistID < 1)
                throw new ArgumentException("This playlist doesn't exist");
            DBservices db = new DBservices();
            return db.DeleteUserPlaylist(UserID, PlaylistID) > 0;
        }
        public static bool DeleteSongFromPlaylist(int PlaylistID, int SongID)
        {
            if (PlaylistID < 1)
                throw new ArgumentException("This playlist doesn't exist");
            if (SongID < 1)
                throw new ArgumentException("This song doesn't exist");
            DBservices db = new DBservices();
            return db.DeleteSongFromPlaylist(PlaylistID, SongID) > 0;
        }
        public static List<object> GetPlaylistSongs(int PlaylistID)
        {
            if (PlaylistID < 1)
                throw new ArgumentException("Playlist doesn't exist");
            DBservices db = new DBservices();
            return db.GetPlaylistSongs(PlaylistID);
        }
        public static object GetPlaylistName(int PlaylistID)
        {
            if (PlaylistID < 1)
                throw new ArgumentException("Playlist doesn't exist");
            DBservices db = new DBservices();
            return db.GetPlaylistName(PlaylistID);
        }
    }
}
