USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetRandomSong]    Script Date: 24/07/2023 13:13:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns a random song. Used for the quizzes.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetRandomSong]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT TOP(1) S.SongID, S.SongName, S.SongLyrics, S.GenreID, S.ReleaseYear, S.PerformerID, S.NumOfPlays, S.SongLength , P.PerformerName, G.GenreName
	FROM Proj_Song S inner join Proj_Performer P on S.PerformerID = P.PerformerID inner join Proj_Genre G on S.GenreID = G.GenreID
	ORDER BY CHECKSUM(NEWID());
END
