USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_InsertSongToPlaylist]    Script Date: 24/07/2023 13:21:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Inserts a song to the playlist.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_InsertSongToPlaylist]
	-- Add the parameters for the stored procedure here
	@PlaylistID int,
	@SongID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Proj_SongInPlaylist (PlaylistID, SongID) values (@PlaylistID, @SongID)
END
