namespace FinalProject.Models
{
    public class Quiz
    {
        private int quizID;
        private int userID;
        private DateTime quizDate;
        private List<Question> questions;

        public Quiz(int userID)
        {
            QuizID = 0;
            UserID = userID;
            Questions = new List<Question>();
            for (int i = 0; i < 5; i++)
                Questions.Add(Question.GetRandomQuestion());
            DBservices db = new DBservices();
            QuizID = db.Insert(this);
            for (int i = 0; i < 5; i++)
                questions[i].Id = db.Insert(Questions[i], QuizID);
        }

        public Quiz(int QID, int UID, List<Question> QS)
        {
            QuizID = QID;
            UserID = UID;
            Questions = QS;
        }

        public Quiz(int QID, int UID, List<Question> QS, DateTime quizDateTime)
        {
            QuizID = QID;
            UserID = UID;
            Questions = QS;
            QuizDate = quizDateTime;
        }

        public int QuizID { get => quizID; set => quizID = value; }
        public int UserID { get => userID; set => userID = value; }
        public List<Question> Questions { get => questions; set => questions = value; }
        public DateTime QuizDate { get => quizDate; set => quizDate = value; }

        public static List<Quiz> GetUserPastQuiz(int UserID)
        {
            if (UserID < 1)
                throw new ArgumentException("User doesn't exist!");
            DBservices db = new DBservices();
            return db.GetUserPastQuizzesAndQuestions(UserID);
        }
        public static List<object> GetUserPastQuizzesNoQuestions(int UserID)
        {
            if (UserID < 1)
                throw new ArgumentException("User doesn't exist!");
            DBservices db = new DBservices();
            return db.GetUserPastQuizDataWithoutQuestions(UserID);
        }
        public static Quiz GetQuizQuestions(int QuizID)
        {
            if (QuizID < 1)
                throw new ArgumentException("Quiz doesn't exist!");
            DBservices db = new DBservices();
            return db.GetQuizQuestions(QuizID);
        }
    }
}
