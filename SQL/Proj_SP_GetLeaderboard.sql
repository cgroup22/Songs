USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetLeaderboard]    Script Date: 24/07/2023 13:10:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the top 10 players on the leaderboard and data about them.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetLeaderboard]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT top(10) UserName, XP,
	(select count(*) from Proj_Quiz Q inner join Proj_Question QU on Q.QuizID = QU.QuizID
	where Q.UserID = U.UserID and QU.userAnswer = QU.correctAnswer) as SoloQuestionsGotRight,
	(select count(*) from Proj_Quiz Q inner join Proj_Question QU on Q.QuizID = QU.QuizID
	where Q.UserID = U.UserID and QU.userAnswer <> -1) as SoloQuestionsAnswered,
	(select count(*) from Proj_Quiz Q1 where Q1.UserID = U.UserID) as TotalGamesPlayed
	from Proj_Users U
	order by XP desc
END