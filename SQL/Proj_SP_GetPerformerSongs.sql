USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetPerformerSongs]    Script Date: 24/07/2023 13:11:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the songs of this performer. @UserID is used to know whether he has these songs in his favorites.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetPerformerSongs]
	-- Add the parameters for the stored procedure here
	@PerformerID int,
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select S.SongID, P.PerformerName, P.PerformerImage, S.SongName, S.SongLength, 
	COALESCE((select count(SongID) from Proj_UserFavorites where SongID = S.SongID group by SongID), 0) as SongNumOfFav,
	case when @UserID < 1 then -1
	when (select count(*) from Proj_UserFavorites where SongID = S.SongID and UserID = @UserID) > 0 then 1 else 0 end as InFav,
	case when @UserID < 1 then -1
	when (select count(*) from Proj_Following where UserID = @UserID and PerformerID = @PerformerID) > 0 then 1 else 0 end IsUserFollowingArtist
	from Proj_Song S inner join Proj_Performer P on S.PerformerID = P.PerformerID
	where P.PerformerID = @PerformerID
	order by S.NumOfPlays desc, S.ReleaseYear desc
END