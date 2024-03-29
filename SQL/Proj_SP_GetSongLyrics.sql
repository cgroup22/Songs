USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetSongLyrics]    Script Date: 24/07/2023 13:14:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the lyrics of this song>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetSongLyrics]
	-- Add the parameters for the stored procedure here
	@SongID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT SongName, SongLyrics, P.PerformerName from Proj_Song S inner join Proj_Performer P on S.PerformerID = P.PerformerID where SongID = @SongID
END
