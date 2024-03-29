USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_ReadSongByID]    Script Date: 24/07/2023 12:48:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Reads a song by its id>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_ReadSongByID]
	-- Add the parameters for the stored procedure here
	@SongID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	update Proj_Song
	set NumOfPlays = NumOfPlays + 1
	where SongID = @SongID
	SELECT FileData from Proj_Song where SongID = @SongID
END
--select * from Proj_PerformerSong
--select * from Proj_Songs
--exec Proj_ReadSongByID 1