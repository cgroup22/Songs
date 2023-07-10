-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the details about the songs of a specific artist, without mp3's file data.>
-- =============================================
CREATE PROCEDURE Proj_SP_GetPerformerSongs
	-- Add the parameters for the stored procedure here
	@PerformerID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select S.SongID, P.PerformerName, P.PerformerImage, S.SongName
	from Proj_PerformerSong PS inner join Proj_Performer P on PS.PerformerID = P.PerformerID inner join Proj_Songs S on S.SongID = PS.SongID
	where P.PerformerID = @PerformerID
	order by PS.NumOfPlays desc, S.ReleaseYear desc
END
GO
exec Proj_SP_GetPerformerSongs 1