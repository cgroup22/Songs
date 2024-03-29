USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_InsertFileDataToSongID]    Script Date: 24/07/2023 13:20:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Inserts the actual mp3 file to @SongID>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_InsertFileDataToSongID]
	-- Add the parameters for the stored procedure here
	@SongID int,
	@FileData varbinary(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	update Proj_Song
	set FileData = @FileData
	where SongID = @SongID
END
