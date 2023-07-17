using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FinalProject.Models
{
    public class Song
    {
        private int id;
        private string name;
        private string lyrics;
        private int numOfPlays;
        private FileContentResult fileData;
        private int genreID;
        private int releaseYear;

        public Song(int id, string name, string lyrics, int numOfPlays, FileContentResult fileData, int genreID, int releaseYear)
        {
            Id = id;
            Name = name;
            Lyrics = lyrics;
            NumOfPlays = numOfPlays;
            FileData = fileData;
            GenreID = genreID;
            ReleaseYear = releaseYear;
        }

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Lyrics { get => lyrics; set => lyrics = value; }
        public int NumOfPlays { get => numOfPlays; set => numOfPlays = value; }
        public FileContentResult FileData { get => fileData; set => fileData = value; }
        public int GenreID { get => genreID; set => genreID = value; }
        public int ReleaseYear { get => releaseYear; set => releaseYear = value; }
        // Inserts a song and its mp3 file to our db
        public bool Insert(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided");
            // Process the uploaded file
            byte[] fileData;
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                fileData = memoryStream.ToArray();
            }
            DBservices db = new DBservices();
            return db.InsertSong(this, fileData) > 0;
        }
        // Reads a song by its id
        public static FileContentResult ReadSongByID(int SongID)
        {
            if (SongID < 1)
                throw new ArgumentException("Song doesn't exist");
            DBservices db = new DBservices();
            return db.ReadSongByID(SongID);
        }
        // TEMP
        public static bool InsertFileDataToSongID(int SongID, IFormFile file)
        {
            if (SongID < 1)
                throw new ArgumentException("This song doesn't exist");
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided");
            // Process the uploaded file
            byte[] fileData;
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                fileData = memoryStream.ToArray();
            }
            DBservices db = new DBservices();
            return db.InsertFileDataToSongID(SongID, fileData) > 0;
        }

        public static List<object> GetTop15Songs(int UserID)
        {
            DBservices db = new DBservices();
            return db.GetTop15(UserID);
        }
        public static List<object> GetPerformerSongs(int PID, int UserID)
        {
            DBservices db = new DBservices();
            return db.GetPerformerSongs(PID, UserID);
        }
        public static string GetSongLyrics(int SID)
        {
            if (SID < 1)
                throw new ArgumentException("Song doesn't exist");
            DBservices db = new DBservices();
            object res = db.GetSongLyrics(SID);
            /*var jsonObject = new
            {
                popupTitle = res.SongName,
                lyrics = res.Lyrics
            };*/
            string json = JsonSerializer.Serialize(res);
            return json;
        }
        public static object GetMostPlayedTrack()
        {
            DBservices db = new DBservices();
            return db.GetMostPlayedTrack();
        }
        public static List<object> GetGenreSongs(int GID)
        {
            DBservices db = new DBservices();
            return db.GetGenreSongs(GID);
        }
        public static List<object> Search(string query, int UserID)
        {
            if (query.Length > 100)
                throw new ArgumentException("MAX CHARACTERS: 100");
            DBservices db = new DBservices();
            return db.Search(query, UserID);
        }
        public static Dictionary<string, object> GetRandomSong()
        {
            DBservices db = new DBservices();
            return db.GetRandomSong();
        }
        public static List<string> Get3RandomReleaseYear(int ReleaseYearToIgnore)
        {
            DBservices db = new DBservices();
            return db.Get3RandomReleaseYear(ReleaseYearToIgnore);
        }
    }
}
