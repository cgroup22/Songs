using Microsoft.AspNetCore.Mvc;

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
        public static Song ReadSongByID(int SongID)
        {
            if (SongID < 1)
                throw new ArgumentException("Song doesn't exist");
            DBservices db = new DBservices();
            Song song = db.ReadSongByID(SongID);
            return song;
        }
        public static bool InsertFileDataToSongID(int SongID, int ReleaseYear, int GenreID, IFormFile file)
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
            return db.InsertFileDataToSongID(SongID, ReleaseYear, GenreID, fileData) > 0;
        }
    }
}
