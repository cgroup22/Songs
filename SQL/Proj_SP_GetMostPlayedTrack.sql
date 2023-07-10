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
-- Description:	<Returns details about the most played song>
-- =============================================
CREATE PROCEDURE Proj_SP_GetMostPlayedTrack
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select top(1) S.SongID, S.SongName, PS.SongLength, P.PerformerName, PS.NumOfPlays, P.PerformerImage
	from Proj_Songs S inner join Proj_PerformerSong PS on S.SongID = PS.SongID inner join Proj_Performer P on P.PerformerID = PS.PerformerID
	order by PS.NumOfPlays desc
END
GO
