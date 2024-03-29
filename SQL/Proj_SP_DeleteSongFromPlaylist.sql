USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_DeleteSongFromPlaylist]    Script Date: 24/07/2023 12:53:22 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Deletes a song from playlist>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_DeleteSongFromPlaylist]
	-- Add the parameters for the stored procedure here
	@PlaylistID int,
	@SongID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	delete from Proj_SongInPlaylist where PlaylistID = @PlaylistID and SongID = @SongID
END
