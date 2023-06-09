using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using FinalProject.Models;

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
}
