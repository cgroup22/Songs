using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace FinalProject.Models
{
    public class Artist : Performer
    {
        private int artistID;
        private DateTime birthDate;

        public int ArtistID { get => artistID; set => artistID = value; }
        public DateTime BirthDate { get => birthDate; set => birthDate = value; }


        public static async Task<string> InsertArtist(string artistName)
        {
            string apiKey = "76b3f536a183539247991ad6bcd171924ea6741a420b32c3e5093893ace3faa6";

            using (HttpClient httpClient = new HttpClient())
            {
                // https://serpapi.com/search.json?engine=google_images&q=Coffee&google_domain=google.com&gl=us&hl=en&api_key=76b3f536a183539247991ad6bcd171924ea6741a420b32c3e5093893ace3faa6
                string url = $"https://serpapi.com/search.json?engine=google_images&q={artistName}&gl=us&hl=en&api_key=76b3f536a183539247991ad6bcd171924ea6741a420b32c3e5093893ace3faa6";
                httpClient.DefaultRequestHeaders.Add("API-Key", apiKey);

                var response = await httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var jsonString = await response.Content.ReadAsStringAsync();
                var jsonObject = JObject.Parse(jsonString);

                string imageUrl = jsonObject["images_results"]?.FirstOrDefault()?["original"].ToString();
                DBservices db = new DBservices();
                if (imageUrl == null)
                    throw new Exception("Server error");
                if (db.Test(artistName, imageUrl) == 0)
                    throw new Exception("DB error");
                return imageUrl;
            }
        }
    }
    
}
