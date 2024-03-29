USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_InsertQuestion]    Script Date: 24/07/2023 13:21:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Inserts a new question to this quiz.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_InsertQuestion]
	-- Add the parameters for the stored procedure here
	@content nvarchar(200),
	@answer1 nvarchar(200),
	@answer2 nvarchar(200),
	@answer3 nvarchar(200),
	@answer4 nvarchar(200),
	@correctAnswer int,
	@QuizID int,
	@QuestionID int output
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Proj_Question(content, answer1, answer2, answer3, answer4, correctAnswer, QuizID) values (@content, @answer1, @answer2, @answer3, @answer4, @correctAnswer, @QuizID)
	SET @QuestionID = SCOPE_IDENTITY();
END
