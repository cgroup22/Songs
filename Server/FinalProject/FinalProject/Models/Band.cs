﻿namespace FinalProject.Models
{
    public class Band : Performer
    {
        private int bandID;
        private DateTime establishmentDate;

        public int BandID { get => bandID; set => bandID = value; }
        public DateTime EstablishmentDate { get => establishmentDate; set => establishmentDate = value; }
        public bool Insert(IFormFile file)
        {
            UpdateImage(file);
            DBservices db = new DBservices();
            return db.Insert(this) > 0;
        }
        public void Test(IFormFile file)
        {
            UpdateImage(file);
        }
    }
}