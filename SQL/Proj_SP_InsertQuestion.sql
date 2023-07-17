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
ALTER PROCEDURE Proj_SP_InsertQuestion
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
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Proj_Question(content, answer1, answer2, answer3, answer4, correctAnswer, QuizID) values (@content, @answer1, @answer2, @answer3, @answer4, @correctAnswer, @QuizID)
	SET @QuestionID = SCOPE_IDENTITY();
END
GO