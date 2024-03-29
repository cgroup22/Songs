USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetSongsInPlaylist]    Script Date: 24/07/2023 13:15:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the songs in this @PlaylistID.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetSongsInPlaylist]
	-- Add the parameters for the stored procedure here
	@PlaylistID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT S.SongID, S.SongLength, S.SongName, PE.PerformerName, PE.PerformerImage, PE.PerformerID
	from Proj_Playlist P inner join Proj_SongInPlaylist SIP on P.PlaylistID = SIP.PlaylistID inner join Proj_Song S on SIP.SongID = S.SongID inner join
	Proj_Performer PE on S.PerformerID = PE.PerformerID
	where P.PlaylistID = @PlaylistID
END
