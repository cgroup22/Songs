-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE Proj_SP_GetUserPastQuizWithoutQuestions
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
GO