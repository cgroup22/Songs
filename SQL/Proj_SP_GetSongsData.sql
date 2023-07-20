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
CREATE PROCEDURE Proj_SP_GetSongsData
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
GO
