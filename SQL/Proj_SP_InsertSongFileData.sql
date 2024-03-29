USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_InsertSongFileData]    Script Date: 24/07/2023 13:21:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Inserts song with its mp3 file data.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_InsertSongFileData]
	@SongID int,
	@SongName nvarchar(150),
	@SongLyrics nvarchar(4000),
    @FileData VARBINARY(MAX),
	@ReleaseYear int,
	@GenreID int
AS
BEGIN
    INSERT INTO Proj_Songs (SongID, SongName, SongLyrics, FileData, ReleaseYear, GenreID)
    VALUES (@SongID, @SongName, @SongLyrics, @FileData, @ReleaseYear, @GenreID)
END