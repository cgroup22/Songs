USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetGenreSongs]    Script Date: 24/07/2023 13:10:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the song of @GenreID>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetGenreSongs]
	-- Add the parameters for the stored procedure here
	@GenreID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT S.SongID, P.PerformerName, P.PerformerImage, S.SongName
	from Proj_Song S inner join Proj_Performer P on S.PerformerID = P.PerformerID
	where S.GenreID = @GenreID
END
