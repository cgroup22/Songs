USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetQuizQuestions]    Script Date: 24/07/2023 13:13:03 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the questions of this quiz>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetQuizQuestions]
	-- Add the parameters for the stored procedure here
	@QuizID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT Q.*, QU.QuizDate
	from Proj_Question Q inner join Proj_Quiz QU on Q.QuizID = QU.QuizID where Q.QuizID = @QuizID
END
