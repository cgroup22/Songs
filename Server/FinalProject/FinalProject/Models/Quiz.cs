namespace FinalProject.Models
{
    public class Quiz
    {
        private int quizID;
        private int userID;
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

        public int QuizID { get => quizID; set => quizID = value; }
        public int UserID { get => userID; set => userID = value; }
        public List<Question> Questions { get => questions; set => questions = value; }
    }
}
