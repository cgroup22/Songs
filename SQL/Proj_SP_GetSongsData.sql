USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetSongsData]    Script Date: 24/07/2023 13:14:46 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns data about our songs.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetSongsData]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT S.SongID, S.SongName, S.ReleaseYear, S.NumOfPlays, S.SongLength, P.PerformerName, G.GenreName,
	(select count(distinct UF.UserID) from Proj_UserFavorites UF where UF.SongID = S.SongID) as TotalFavorites
	from Proj_Song S inner join Proj_Performer P on S.PerformerID = P.PerformerID inner join Proj_Genre G on S.GenreID = G.GenreID
	order by S.NumOfPlays desc
END
