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
CREATE PROCEDURE Proj_SP_GetLeaderboard
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT UserName, XP, XP / 10 as SoloQuestionsGotRight,
	(select count(*) from Proj_Quiz Q inner join Proj_Question QU on Q.QuizID = QU.QuizID
	where Q.UserID = U.UserID and QU.userAnswer <> -1) as SoloQuestionsAnswered,
	(select count(*) from Proj_Quiz Q1 where Q1.UserID = U.UserID) as TotalGamesPlayed
	from Proj_Users U
	order by XP desc
END
GO
