USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_PostUserAnswer]    Script Date: 24/07/2023 13:34:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Posts an answer for the question.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_PostUserAnswer]
	-- Add the parameters for the stored procedure here
	@QuestionID int,
	@answer int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	update Proj_Question
	set userAnswer = @answer
	where QuestionID = @QuestionID
	if (select case when correctAnswer = @answer then 1 else 0 end from Proj_Question where QuestionID = @QuestionID) = 1
	update Proj_Users
	set XP = XP + 10
	where UserID = (select UserID from Proj_Question Q inner join Proj_Quiz QU on Q.QuizID = QU.QuizID where Q.QuestionID = @QuestionID)
END