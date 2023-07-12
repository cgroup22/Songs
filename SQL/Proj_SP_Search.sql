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
CREATE PROCEDURE Proj_SP_Search
	-- Add the parameters for the stored procedure here
	@Query nvarchar(100),
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT S.SongID, S.SongName, S.NumOfPlays, S.SongLength, P.PerformerName, P.PerformerImage, P.PerformerID, G.GenreName, case when S.SongLyrics like '%' + @Query + '%' then 1 else 0 end IsQueryInLyrics,
	case when @UserID < 1 then -1
	when (select count(*) from Proj_UserFavorites where SongID = S.SongID and UserID = @UserID) > 0 then 1 else 0 end as InFav
	from Proj_Song S inner join Proj_Performer P on S.PerformerID = P.PerformerID inner join Proj_Genre G on S.GenreID = G.GenreID
	where S.SongName like '%' + @Query + '%' or P.PerformerName like '%' + @Query + '%' or S.SongLyrics like '%' + @Query + '%' or G.GenreName like '%' + @Query + '%'
END
GO