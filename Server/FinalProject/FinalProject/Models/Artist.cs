namespace FinalProject.Models
{
    public class Artist : Performer
    {
        private int artistID;
        private DateTime birthDate;

        public int ArtistID { get => artistID; set => artistID = value; }
        public DateTime BirthDate { get => birthDate; set => birthDate = value; }
    }
}
