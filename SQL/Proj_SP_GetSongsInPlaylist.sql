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
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE Proj_SP_GetSongsInPlaylist
	-- Add the parameters for the stored procedure here
	@PlaylistID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT S.SongID, S.SongLength, S.SongName, PE.PerformerName, PE.PerformerImage
	from Proj_Playlist P inner join Proj_SongInPlaylist SIP on P.PlaylistID = SIP.PlaylistID inner join Proj_Song S on SIP.SongID = S.SongID inner join
	Proj_Performer PE on S.PerformerID = PE.PerformerID
	where P.PlaylistID = @PlaylistID
END
GO