USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetUserPastQuizWithoutQuestions]    Script Date: 24/07/2023 13:19:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns data about the past quizzes of @UserID without the questions.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetUserPastQuizWithoutQuestions]
	-- Add the parameters for the stored procedure here
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT Q.*,
    COALESCE((
        SELECT COUNT(QU.QuizID)
        FROM Proj_Question QU
        WHERE QU.QuizID = Q.QuizID AND QU.correctAnswer = QU.userAnswer
        GROUP BY QU.QuizID
    ), 0) AS QuestionsGotRight
FROM Proj_Quiz Q
WHERE UserID = @UserID;

END
