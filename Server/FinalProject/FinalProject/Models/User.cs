using Microsoft.AspNetCore.Mvc;
using SendGrid.Helpers.Mail;
using SendGrid;
using System.Text.RegularExpressions;
using System.Runtime.CompilerServices;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace FinalProject.Models
{
    public class User
    {
        private int id;
        private string email;
        private string name;
        private string password;
        private bool isVerified;

        public int Id { get => id; set => id = value; }
        public string Email { get => email; set => email = value; }
        public string Name { get => name; set => name = value; }
        public string Password { get => password; set => password = value; }
        public bool IsVerified { get => isVerified; set => isVerified = value; }

        public static User Login(string email, string password)
        {
            if (email == null || password == null || email == "" || password == "")
                throw new Exception("User not found");
            DBservices db = new DBservices();
            User user = db.Login(email, password);
            if (user == null)
                throw new Exception("Error");
            return user;
        }

        // Inserts a new user into the user table
        public bool Insert()
        {
            //Execute().Wait();
            //throw new ArgumentException(GenerateToken());
            //return true;
            Validate();
            IsVerified = false;
            DBservices db = new DBservices();
            string Token = GenerateToken();
            bool tmp = db.Insert(this, Token) > 0;
            //Execute(Token).Wait(); email verification - turn the comment off when ready.
            return tmp;
        }

        public bool Update(string oldEmail)
        {
            Validate();
            if (!oldEmail.Equals(Email))
                ValidateEmail(oldEmail);
            DBservices db = new DBservices();
            bool isNewEmail = email != oldEmail;
            string Token = isNewEmail ? GenerateToken() : "";
            bool tmp = db.Update(this, isNewEmail, Token) > 0;
            // email verification - turn the comment off when ready
            //if (isNewEmail)
                //Execute(Token).Wait();
            return tmp;
        }
        public static bool IsUserVerified(int id)
        {
            if (id < 1)
                throw new ArgumentException("User doesn't exist");
            DBservices db = new DBservices();
            return db.IsUserVerified(id);
        }
        /*
        public static async Task<string> Zibi()
        {
            // Set your Spotify API credentials
            string clientId = "spotClientID";
            string clientSecret = "spotClientSecret";
            string redirectUri = "https://proj.ruppin.ac.il/cgroup22/test2/tar5/Pages/index.html";

            // Specify the required scopes for accessing Spotify resources
            string[] scopes = { "user-read-private", "user-read-email" }; // Add any additional required scopes

            // Build the authorization URL
            string authorizationUrl = $"https://accounts.spotify.com/authorize" +
                $"?response_type=code" +
                $"&client_id={Uri.EscapeDataString(clientId)}" +
                $"&scope={Uri.EscapeDataString(string.Join(" ", scopes))}" +
                $"&redirect_uri={Uri.EscapeDataString(redirectUri)}";

            // Prompt the user to authorize the application
            Console.WriteLine("Please authorize the application by visiting the following URL:");
            Console.WriteLine(authorizationUrl);
            Console.WriteLine("Enter the authorization code:");

            // Read the authorization code from the user input
            string authorizationCode = Console.ReadLine();

            // Exchange the authorization code for an access token
            string accessToken = await GetAccessToken(authorizationCode, clientId, clientSecret, redirectUri);

            // Make API requests using the access token
            return await SearchTracks(accessToken);
        }

        static async Task<string> GetAccessToken(string authorizationCode, string clientId, string clientSecret, string redirectUri)
        {
            // Set the token endpoint for exchanging the authorization code
            string tokenEndpoint = "https://accounts.spotify.com/api/token";

            // Create the HTTP client
            HttpClient httpClient = new HttpClient();

            // Set the request parameters
            var parameters = new Dictionary<string, string>
    {
        { "grant_type", "authorization_code" },
        { "code", authorizationCode },
        { "client_id", clientId },
        { "client_secret", clientSecret },
        { "redirect_uri", redirectUri }
    };

            // Send the request to exchange the authorization code for an access token
            var response = await httpClient.PostAsync(tokenEndpoint, new FormUrlEncodedContent(parameters));

            // Check if the request was successful
            if (response.IsSuccessStatusCode)
            {
                // Extract the access token from the response
                var responseContent = await response.Content.ReadAsStringAsync();
                var tokenResponse = JsonConvert.DeserializeObject<AccessTokenResponse>(responseContent);
                return tokenResponse.AccessToken;
            }
            else
            {
                // Request failed
                Console.WriteLine("Request failed with status code: " + response.StatusCode);
                return null;
            }
        }
        */
        // Validates that the user info is correct. Throws an exception otherwise.
        private void Validate()
        {
            if (this == null)
                throw new Exception("Server error, try again later");
            if (name == "" || name == null)
                throw new ArgumentException("Please insert your name");
            if (password == "" || password == null)
                throw new ArgumentException("Please insert your password");
            if (password.Length < 3)
                throw new ArgumentException("Your password must contain atleast 3 characters");
            ValidateEmail(email);
            if (name.Any(char.IsDigit))
                throw new ArgumentException("Your name cannot contain numbers");
        }
        private static void ValidateEmail(string email)
        {
            if (email == "" || email == null)
                throw new ArgumentException("Please insert your email");
            string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.IsMatch(email, emailPattern))
                throw new ArgumentException("Please insert correct email");
        }

        /*static async Task Execute()
        {
            //var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var apiKey = "x";
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("csbgroup22@gmail.com", "Example User");
            var subject = "Sending with SendGrid is Fun";
            var to = new EmailAddress("natipur89@gmail.com", "Example User");
            var plainTextContent = "and easy to do anywhere, even with C#";
            var htmlContent = "<strong>and easy to do anywhere, even with C#</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }*/

        async Task Execute(string Token)
        {
            var apiKey = "SGAPIKEY";
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("csbgroup22@gmail.com", "Ruppin Music");
            var subject = "Sending with SendGrid is Fun";
            var to = new EmailAddress(Email, "User: " + Name);
            var templateId = "d-e7de34c1548845ca862654c5db151472";

            string dynamicName = name;
            if (name.Contains(" "))
                dynamicName = name.Split(' ')[0];

            var dynamicData = new Dictionary<string, dynamic>
            {
              { "name", dynamicName },
              { "token", Token },
              { "email", email }
               // Add other dynamic data fields and their values as needed
            };

            var msg = MailHelper.CreateSingleTemplateEmail(from, to, templateId, dynamicTemplateData: dynamicData);
            msg.Subject = subject;

            var response = await client.SendEmailAsync(msg);
        }

        public static bool ValidateUser(string email, string token)
        {
            // Don't forget to change the link of the verification and hear buttons in SendGrid whe you upload the project to Ruppin's server
            DBservices db = new DBservices();
            return db.ValidateUser(email, token) > 0;
        }


        /*static async Task Execute()
        {
            // Generate the verification token
            string verificationToken = GenerateVerificationToken();

            // Store the verification token in your database (replace this with your database logic)
            StoreVerificationTokenInDatabase(verificationToken);

            // Construct the verification link
            string verificationLink = GenerateVerificationLink(verificationToken);

            // Send the verification email
            var apiKey = Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress("csbgroup22@gmail.com", "Example User");
            var subject = "Email Verification";
            var to = new EmailAddress("natipur89@gmail.com", "Example User");
            var plainTextContent = $"Please click the following link to verify your email: {verificationLink}";
            var htmlContent = $"<p>Please click the following link to verify your email:</p><p><a href='{verificationLink}'>Verify Email</a></p>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }*/

        static async Task<string> SearchTracks(string accessToken)
        {
            // Set the search query
            string searchQuery = "7 Rings";

            // Set the API endpoint for track search
            string searchEndpoint = $"https://api.spotify.com/v1/search?q={Uri.EscapeDataString(searchQuery)}&type=track";

            // Create the HTTP client
            HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            // Send the request to search for tracks
            var response = await httpClient.GetAsync(searchEndpoint);

            // Check if the request was successful
            if (response.IsSuccessStatusCode)
            {
                // Extract the response content
                var responseContent = await response.Content.ReadAsStringAsync();

                // TODO: Process the response data as per your requirements
                Console.WriteLine("Search Results:");
                Console.WriteLine(responseContent);
                return responseContent;
            }
            else
            {
                // Request failed
                Console.WriteLine("Request failed with status code: " + response.StatusCode);
                return "ERROR";
            }
        }


        private static string GenerateToken()
        {
            int length = 16;
            // Create a random number generator.
            var rng = new Random();

            // Create a list of possible characters.
            var characters = new string[]
            {
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "abcdefghijklmnopqrstuvwxyz",
        "0123456789",
            };

            // Create a string builder to hold the token.
            var sb = new StringBuilder(length);

            // Loop over the characters and randomly select one for each position in the token.
            for (int i = 0; i < length; i++)
            {
                // Use the same Random object to generate the random index and select the character.
                int charSetIndex = rng.Next(characters.Length);
                string charSet = characters[charSetIndex];
                sb.Append(charSet[rng.Next(charSet.Length)]);
            }

            // Return the token.
            return sb.ToString();
        }

        public static bool InitiateNewValidation(int id)
        {
            if (id < 1)
                throw new ArgumentException("User doesn't exist");
            DBservices db = new DBservices();
            string Token = GenerateToken();
            bool tmp = db.InitiateNewValidation(id, Token) > 0;
            //Execute(Token).Wait();
            return tmp;
        }
    }
}
