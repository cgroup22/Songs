USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_PostSongDataWithoutFile]    Script Date: 24/07/2023 13:22:38 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Inserts a song without the file data.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_PostSongDataWithoutFile]
	-- Add the parameters for the stored procedure here
	@SongID int,
	@SongName nvarchar(150),
	@SongLyrics nvarchar(4000),
	@GenreID int,
	@ReleaseYear int,
	@PerformerID int,
	@SongLength char(10)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Proj_Song(SongID, SongName, SongLyrics, GenreID, ReleaseYear, PerformerID, SongLength, NumOfPlays) values
	(@SongID, @SongName, @SongLyrics, @GenreID, @ReleaseYear, @PerformerID, @SongLength, 0)
END