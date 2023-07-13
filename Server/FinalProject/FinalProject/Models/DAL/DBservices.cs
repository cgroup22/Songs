using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using FinalProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Collections;
using System.Xml.Linq;
using System.Security.Cryptography;
//using SendGrid;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservices
{

    public DBservices()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the web.config 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {

        // read the connection string from the configuration file
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json").Build();
        string cStr = configuration.GetConnectionString("myProjDB");
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }
    // Update user details, and require email verification if changed. (New token) otherwise, token is set to empty string.
    public int Update(User u, bool isNewEmail, string token)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserID", u.Id);
        paramDic.Add("@UserName", u.Name);
        paramDic.Add("@UserEmail", u.Email);
        paramDic.Add("@UserPassword", u.Password);
        paramDic.Add("@isNewEmail", isNewEmail ? 1 : 0);
        paramDic.Add("@token", token);



        cmd = CreateCommandWithStoredProcedure("Proj_SP_UpdateUser", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }
    // Returns true if this user is verified
    public bool IsUserVerified(int id)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserID", id);


        cmd = CreateCommandWithStoredProcedure("Proj_IsAccountVerified", con, paramDic);             // create the command
        

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                return Convert.ToInt32(dataReader["Result"]) == 1;
            }
            throw new ArgumentException("User doesn't exist");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }
    // User clicked verify, checks the token and timestamp.
    public int ValidateUser(string email, string token)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserEmail", email);
        paramDic.Add("@UserToken", token);



        cmd = CreateCommandWithStoredProcedure("Proj_SP_Validate_Email", con, paramDic);             // create the command
        var returnParameter = cmd.Parameters.Add("@flag", SqlDbType.Int);
        returnParameter.Direction = ParameterDirection.ReturnValue;

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
                // note that the return value appears only after closing the connection
                int result = (int)returnParameter.Value;
                if (result == 1)
                    throw new ArgumentException("This user doesn't exist");
                if (result == 2)
                    throw new ArgumentException("You're already verified!");
                if (result == 3)
                    throw new ArgumentException("Invalid token");
                if (result == 4)
                    throw new ArgumentException("30 minutes have passed. Try again!");
            }
        }
    }
    public int Test(string name, string imageurl)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@PerformerName", name);
        paramDic.Add("@PerformerImage", imageurl);



        cmd = CreateCommandWithStoredProcedure("Proj_SP_InsertArtist", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }
    // TEMP
    public List<object> GetTop15(int UserID)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserID", UserID);

        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetTop15", con, paramDic);             // create the command


        List<object> songs = new List<object>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                int SongID = Convert.ToInt32(dataReader["SongID"]);
                string SName = dataReader["SongName"].ToString();
                string PName = dataReader["PerformerName"].ToString();
                string PImage = dataReader["PerformerImage"].ToString();
                int NumOfPlays = Convert.ToInt32(dataReader["NumOfPlays"]);
                string GName = dataReader["GenreName"].ToString();
                string SLength = dataReader["SongLength"].ToString();
                if (SLength != null && SLength.Contains(' '))
                    SLength = SLength.Substring(0, SLength.IndexOf(' '));
                int InFav = Convert.ToInt32(dataReader["InFav"]);
                object s = new { SongID = SongID, SongName = SName, PerformerName = PName,
                PerformerImage = PImage, NumOfPlays = NumOfPlays, GenreName = GName, SongLength = SLength, IsInFav = InFav };
                songs.Add(s);
            }

            return songs;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    public object GetSongLyrics(int SongID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@SongID", SongID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetSongLyrics", con, paramDic);             // create the command


        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                string name = dataReader["SongName"].ToString();
                string lyrics = dataReader["SongLyrics"].ToString();
                object res = new {
                    SongName = name,
                    Lyrics = lyrics
                };
                return res;
            }
            throw new ArgumentException("Song doesn't exist");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public List<object> GetUserFavorites(int UserID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserID", UserID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetUserFavorites", con, paramDic);             // create the command

        List<object> favorites = new List<object>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                int SID = Convert.ToInt32(dataReader["SongID"]);
                string name = dataReader["SongName"].ToString();
                string SLength = dataReader["SongLength"].ToString();
                if (SLength != null && SLength.Contains(' '))
                    SLength = SLength.Substring(0, SLength.IndexOf(' '));
                string PName = dataReader["PerformerName"].ToString();
                string PImage = dataReader["PerformerImage"].ToString();
                object res = new
                {
                    SongID = SID,
                    SongName = name,
                    Length = SLength,
                    PerformerName = PName,
                    PerformerImage = PImage
                };
                favorites.Add(res);
            }
            return favorites;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public List<object> GetPlaylistSongs(int PlaylistID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@PlaylistID", PlaylistID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetSongsInPlaylist", con, paramDic);             // create the command

        List<object> playlistSongs = new List<object>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                int SID = Convert.ToInt32(dataReader["SongID"]);
                string name = dataReader["SongName"].ToString();
                string SLength = dataReader["SongLength"].ToString();
                if (SLength != null && SLength.Contains(' '))
                    SLength = SLength.Substring(0, SLength.IndexOf(' '));
                string PName = dataReader["PerformerName"].ToString();
                string PImage = dataReader["PerformerImage"].ToString();
                object res = new
                {
                    SongID = SID,
                    SongName = name,
                    Length = SLength,
                    PerformerName = PName,
                    PerformerImage = PImage
                };
                playlistSongs.Add(res);
            }
            return playlistSongs;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public object GetPlaylistName(int PlaylistID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@PlaylistID", PlaylistID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetPlaylistName", con, paramDic);             // create the command


        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                object res = new
                {
                    PlaylistName = dataReader["PlaylistName"].ToString()
                };
                return res;
            }
            throw new Exception("Playlist not found");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public List<Playlist> GetUserPlaylists(int UserID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserID", UserID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetPlaylists", con, paramDic);             // create the command

        List<Playlist> playlists = new List<Playlist>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                int PID = Convert.ToInt32(dataReader["PlaylistID"]);
                string name = dataReader["PlaylistName"].ToString();
                Playlist res = new Playlist(PID, name);
                playlists.Add(res);
            }
            return playlists;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public List<object> Search(string query, int UserID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@Query", query);
        paramDic.Add("@UserID", UserID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_Search", con, paramDic);             // create the command

        List<object> searchResults = new List<object>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                int SID = Convert.ToInt32(dataReader["SongID"]);
                string name = dataReader["SongName"].ToString();
                int NOP = Convert.ToInt32(dataReader["NumOfPlays"]);
                string SLength = dataReader["SongLength"].ToString();
                if (SLength != null && SLength.Contains(' '))
                    SLength = SLength.Substring(0, SLength.IndexOf(' '));
                string PName = dataReader["PerformerName"].ToString();
                string PImage = dataReader["PerformerImage"].ToString();
                int PID = Convert.ToInt32(dataReader["PerformerID"]);
                string GName = dataReader["GenreName"].ToString();
                int IQIL = Convert.ToInt32(dataReader["IsQueryInLyrics"]);
                int IsInFav = Convert.ToInt32(dataReader["InFav"]);
                object res = new
                {
                    SongID = SID,
                    SongName = name,
                    NumOfPlays = NOP,
                    Length = SLength,
                    PerformerID = PID,
                    PerformerName = PName,
                    PerformerImage = PImage,
                    GenreName = GName,
                    IsQueryInLyrics = IQIL,
                    IsInFavorites = IsInFav
                };
                searchResults.Add(res);
            }
            return searchResults;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public List<object> GetFeaturedArtists()
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetFeaturedArtists", con, null);             // create the command


        List<object> artists = new List<object>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                int PerformerID = Convert.ToInt32(dataReader["PerformerID"]);
                string PName = dataReader["PerformerName"].ToString();
                string PImage = dataReader["PerformerImage"].ToString();
                object s = new
                {
                    PerformerID = PerformerID,
                    PerformerName = PName,
                    PerformerImage = PImage
                };
                artists.Add(s);
            }

            return artists;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    public List<object> GetPerformerSongs(int PID)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@PerformerID", PID);
        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetPerformerSongs", con, paramDic);             // create the command


        List<object> songs = new List<object>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                int SID = Convert.ToInt32(dataReader["SongID"]);
                string PName = dataReader["PerformerName"].ToString();
                string PImage = dataReader["PerformerImage"].ToString();
                string SName = dataReader["SongName"].ToString();
                object s = new
                {
                    SongID = SID,
                    PerformerName = PName,
                    PerformerImage = PImage,
                    SongName = SName
                };
                songs.Add(s);
            }

            return songs;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    public List<object> GetGenreSongs(int GenreID)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@GenreID", GenreID);
        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetGenreSongs", con, paramDic);             // create the command


        List<object> songs = new List<object>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                int SID = Convert.ToInt32(dataReader["SongID"]);
                string PName = dataReader["PerformerName"].ToString();
                string PImage = dataReader["PerformerImage"].ToString();
                string SName = dataReader["SongName"].ToString();
                object s = new
                {
                    SongID = SID,
                    PerformerName = PName,
                    PerformerImage = PImage,
                    SongName = SName
                };
                songs.Add(s);
            }

            return songs;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    public object GetMostPlayedTrack()
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetMostPlayedTrack", con, null);             // create the command


        

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                int SID = Convert.ToInt32(dataReader["SongID"]);
                string PName = dataReader["PerformerName"].ToString();
                string PImage = dataReader["PerformerImage"].ToString();
                string SLength = dataReader["SongLength"].ToString();
                if (SLength != null && SLength.Contains(' '))
                    SLength = SLength.Substring(0, SLength.IndexOf(' '));
                string SName = dataReader["SongName"].ToString();
                int NumOfPlays = Convert.ToInt32(dataReader["NumOfPlays"]);
                object s = new
                {
                    SongID = SID,
                    SongName = SName,
                    SongLength = SLength,
                    PerformerName = PName,
                    NumOfPlays = NumOfPlays,
                    PerformerImage = PImage
                };
                return s;
            }
            throw new ArgumentException("ERROR");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    // Creates a new email verification request.
    public int InitiateNewValidation(int id, string token)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserID", id);
        paramDic.Add("@UserToken", token);



        cmd = CreateCommandWithStoredProcedure("Proj_SP_InitiateNewValidation", con, paramDic);             // create the command
        var returnParameter = cmd.Parameters.Add("@flag", SqlDbType.Int);
        returnParameter.Direction = ParameterDirection.ReturnValue;

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
                // note that the return value appears only after closing the connection
                int result = (int)returnParameter.Value;
                if (result == 1)
                    throw new ArgumentException("This user doesn't exist");
                if (result == 2)
                    throw new ArgumentException("You're already verified!");
            }
        }
    }
    // TEMP - Insert band
    public int Insert(Band b)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@PerformerName", b.PerformerName);
        paramDic.Add("@establishmentDate", b.EstablishmentDate);
        paramDic.Add("@PerformerImage", b.PerformerImage);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_InsertBand", con, paramDic);             // create the command

        try
        {
            // int numEffected = cmd.ExecuteNonQuery(); // execute the command
            int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }
    public object Insert(Playlist p)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserID", p.UserID);
        paramDic.Add("@PlaylistName", p.Name);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_CreateUserPlaylist", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            // int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return GetPlaylistIdentity();
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }
    public object GetPlaylistIdentity()
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        cmd = CreateCommandWithStoredProcedure("Proj_SP_GetPlaylistIDidentity", con, null);             // create the command

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                object res = new
                {
                    PlaylistID = Convert.ToInt32(dataReader["CurrentIdentity"])
                };
                return res;
            }
            throw new Exception("SERVER ERROR");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }
    public int InsertSongToPlaylist(SongInPlaylist s)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@PlaylistID", s.PlaylistID);
        paramDic.Add("@SongID", s.SongID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_InsertSongToPlaylist", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            // int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }
    public int PostUserFavorite(int UserID, int SongID)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserID", UserID);
        paramDic.Add("@SongID", SongID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_PostUserFavorite", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            // int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    /*public int Insert(Band b)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@PerformerName", b.PerformerName);
        paramDic.Add("@establishmentDate", b.EstablishmentDate);
        paramDic.Add("@PerformerImage", b.PerformerImage);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_InsertBand", con, paramDic);             // create the command

        try
        {
            // int numEffected = cmd.ExecuteNonQuery(); // execute the command
            int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }*/

    /*
    //--------------------------------------------------------------------------------------------------
    // This method update a student to the student table 
    //--------------------------------------------------------------------------------------------------
    public int Update(Student student)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@id", student.Id);
        paramDic.Add("@name", student.Name);
        paramDic.Add("@age", student.Age);



        cmd = CreateCommandWithStoredProcedure("spUpdateStudent1", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }



    //--------------------------------------------------------------------------------------------------
    // This method Inserts a student to the student table 
    //--------------------------------------------------------------------------------------------------
    public int Insert(Student student)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@name", student.Name);
        paramDic.Add("@age", student.Age);



        cmd = CreateCommandWithStoredProcedure("spInsertStudent", con, paramDic);             // create the command

        try
        {
            // int numEffected = cmd.ExecuteNonQuery(); // execute the command
            int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }


    //--------------------------------------------------------------------------------------------------
    // This method Reads all students
    //--------------------------------------------------------------------------------------------------
    public List<Student> ReadStudent()
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        cmd = CreateCommandWithStoredProcedure("spReadStudents1", con, null);             // create the command


        List<Student> studentList = new List<Student>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Student s = new Student();
                s.Id = Convert.ToInt32(dataReader["Id"]);
                s.Name = dataReader["Name"].ToString();
                s.Age = Convert.ToDouble(dataReader["Age"]);
                studentList.Add(s);
            }
            return studentList; 
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }



    //--------------------------------------------------------------------------------------------------
    // This method Reads all students above a certain age
    // This method uses the return value mechanism
    //--------------------------------------------------------------------------------------------------
    public List<Student> ReadAboveAge(double age)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@age", age);
        paramDic.Add("@maxAllowedAge", 40);


        cmd = CreateCommandWithStoredProcedure("spReadStudentsAboveAge", con, paramDic);             // create the command
        var returnParameter = cmd.Parameters.Add("@returnValue", SqlDbType.Int);

        returnParameter.Direction = ParameterDirection.ReturnValue;


        List<Student> studentList = new List<Student>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Student s = new Student();
                s.Id = Convert.ToInt32(dataReader["Id"]);
                s.Name = dataReader["Name"].ToString();
                s.Age = Convert.ToDouble(dataReader["Age"]);
                studentList.Add(s);
            }

            

            return studentList;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
            // note that the return value appears only after closing the connection
            var result = returnParameter.Value;
        }

    }


    */

    // Inserts a new user into the user table
    public int Insert(User u, string Token)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();

        paramDic.Add("@email", u.Email);
        paramDic.Add("@password", u.Password);
        paramDic.Add("@name", u.Name);
        paramDic.Add("@token", Token);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_PostUser", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            // int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }
    // User login
    public User Login(string email, string password)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();

        paramDic.Add("@email", email);
        paramDic.Add("@password", password);

        cmd = CreateCommandWithStoredProcedure("Proj_SP_UserLogin", con, paramDic);             // create the command
        var returnParameter = cmd.Parameters.Add("@returnValue", SqlDbType.Int);
        returnParameter.Direction = ParameterDirection.ReturnValue;


        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            if (dataReader.Read())
            {
                User u = new User();
                u.Email = dataReader["UserEmail"].ToString();
                u.Password = dataReader["UserPassword"].ToString();
                u.Name = dataReader["UserName"].ToString();
                u.Id = Convert.ToInt32(dataReader["UserID"]);
                return u;
            }
            throw new Exception("Server error");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
            var result = returnParameter.Value;
            if ((int)result == 0)
                throw new ArgumentException("This user does not exist");
            else if ((int)result == 1) throw new ArgumentException("Wrong password");
        }
    }
    // TEMP
    public int InsertFileDataToSongID(int SongID, byte[] fileData)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@SongID", SongID);
        paramDic.Add("@FileData", fileData);



        cmd = CreateCommandWithStoredProcedure("Proj_SP_InsertFileDataToSongID", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            //int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }


    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure
    //---------------------------------------------------------------------------------
    private SqlCommand CreateCommandWithStoredProcedure(String spName, SqlConnection con, Dictionary<string, object> paramDic)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        if(paramDic != null)
            foreach (KeyValuePair<string, object> param in paramDic) {
                cmd.Parameters.AddWithValue(param.Key,param.Value);

            }


        return cmd;
    }
    // TEMP
    public int InsertSong(Song SongToInsert, byte[] fileData)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@SongName", SongToInsert.Name);
        paramDic.Add("@SongLyrics", SongToInsert.Lyrics);
        paramDic.Add("@ReleaseYear", SongToInsert.ReleaseYear);
        paramDic.Add("@GenreID", SongToInsert.GenreID);
        paramDic.Add("@FileData", fileData);



        cmd = CreateCommandWithStoredProcedure("Proj_SP_InsertSongFileData", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            //int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }
    // Returns a song by its id
    public FileContentResult ReadSongByID(int SongID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@SongID", SongID);

        cmd = CreateCommandWithStoredProcedure("Proj_ReadSongByID", con, paramDic);             // create the command
        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            if (dataReader.Read())
            {
                int fileDataIndex = dataReader.GetOrdinal("FileData");
                // Check if the column value is not DBNull
                if (!dataReader.IsDBNull(fileDataIndex))
                {
                    // Get the size of the file data
                    long fileSize = dataReader.GetBytes(fileDataIndex, 0, null, 0, 0);

                    // Create a byte array to hold the file data
                    byte[] fileData = new byte[fileSize];

                    // Read the file data into the byte array
                    dataReader.GetBytes(fileDataIndex, 0, fileData, 0, (int)fileSize);
                    // Set the Content-Range header
                    FileContentResult SongFile = new FileContentResult(fileData, "audio/mpeg");
                    return SongFile;
                }
            }
            throw new Exception("Song not found!");
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }

    public int DeleteFromFavorites(int UserID, int SongID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@UserID", UserID);
        paramDic.Add("@SongID", SongID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_RemoveFromFavorites", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            // int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }
    public int DeleteSongFromPlaylist(int PlaylistID, int SongID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@PlaylistID", PlaylistID);
        paramDic.Add("@SongID", SongID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_DeleteSongFromPlaylist", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            // int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }
    public int DeleteUserPlaylist(int UserID, int PlaylistID)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("FinalProject"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@PlaylistID", PlaylistID);
        paramDic.Add("@UserID", UserID);


        cmd = CreateCommandWithStoredProcedure("Proj_SP_DeleteUserPlaylist", con, paramDic);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            // int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }
}
