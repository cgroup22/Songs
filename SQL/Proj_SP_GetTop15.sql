USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetTop15]    Script Date: 24/07/2023 13:15:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the top 15 songs.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetTop15]
	-- Add the parameters for the stored procedure here
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select top(15) S.SongID, P.PerformerName, P.PerformerID, P.PerformerImage, S.SongName, G.GenreName, S.SongLength, S.NumOfPlays,
	case when @UserID < 1 then 0
	when (select count(*) from Proj_UserFavorites where SongID = S.SongID and UserID = @UserID) > 0 then 1 else 0 end as InFav
	from Proj_Song S inner join Proj_Performer P on S.PerformerID = P.PerformerID inner join Proj_Genre G on S.GenreID = G.GenreID
	order by S.NumOfPlays desc, S.ReleaseYear desc
END
--exec Proj_SP_GetTop15
/*select * from Proj_PerformerSong
select * from Proj_Songs
select * from Proj_Performer*/