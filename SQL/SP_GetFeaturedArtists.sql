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
-- Description:	<Returns details of the top 6 artists (by # of plays)>
-- =============================================
CREATE PROCEDURE Proj_SP_GetFeaturedArtists
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select top(6) P.PerformerID, P.PerformerName, P.PerformerImage from Proj_Performer P inner join Proj_PerformerSong PS on P.PerformerID = PS.PerformerID
	group by P.PerformerID, P.PerformerName, P.PerformerImage
	order by sum(PS.NumOfPlays) desc
END
GO