using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace FinalProject.Models
{
    public class User
    {
        private string email;
        private string name;
        private string password;

        public string Email { get => email; set => email = value; }
        public string Name { get => name; set => name = value; }
        public string Password { get => password; set => password = value; }
        // Inserts a new user into the user table
        public bool Insert()
        {
            Validate();
            DBservices db = new DBservices();
            return db.Insert(this) > 0;
        }
        // Validates that the user info is correct. Throws an exception otherwise.
        private void Validate()
        {
            if (this == null)
                throw new Exception("Server error, try again later");
            if (email == "" || email == null)
                throw new ArgumentException("Please insert your email");
            if (name == "" || name == null)
                throw new ArgumentException("Please insert your name");
            if (password == "" || password == null)
                throw new ArgumentException("Please insert your password");
            if (password.Length < 3)
                throw new ArgumentException("Your password must contain atleast 3 characters");
            string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.IsMatch(email, emailPattern))
                throw new ArgumentException("Please insert correct email");
            if (name.Any(char.IsDigit))
                throw new ArgumentException("Your name cannot contain numbers");
        }
    }
}
