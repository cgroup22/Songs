using Microsoft.AspNetCore.Mvc;

namespace FinalProject.Models
{
    public abstract class Performer
    {
        protected int performerID;
        protected string performerName;
        //protected int isABand;
        protected FileContentResult performerImage;

        public int PerformerID { get => performerID; set => performerID = value; }
        public string PerformerName { get => performerName; set => performerName = value; }
        //public int IsABand { get => isABand; set => isABand = value; }
        public FileContentResult PerformerImage { get => performerImage; set => performerImage = value; }
        protected static byte[] TranslateImageToHEX(IFormFile file)
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
            return fileData;
        }
        public void UpdateImage(IFormFile file)
        {
            //performerImage = TranslateImageToHEX(file);
        }
        public static List<object> GetFeaturedArtists()
        {
            DBservices db = new DBservices();
            return db.GetFeaturedArtists();
        }
        public static object GetTotalStreams(int PerformerID)
        {
            if (PerformerID < 1)
                throw new ArgumentException("Performer doesn't exist!");
            DBservices db = new DBservices();
            return db.GetTotalStreamsOfArtist(PerformerID);
        }

        public static List<string> Get3RandomPerformers(int PerformerID)
        {
            DBservices db = new DBservices();
            return db.Get3RandomArtists(PerformerID);
        }
        public static string GetRandomBand()
        {
            DBservices db = new DBservices();
            return db.GetRandomBand();
        }
        public static List<string> Get3RandomSingleArtists()
        {
            DBservices db = new DBservices();
            return db.Get3RandomSingleArtists();
        }
    }
}
