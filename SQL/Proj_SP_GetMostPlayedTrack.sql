USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetMostPlayedTrack]    Script Date: 24/07/2023 13:10:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns details about the most played song>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetMostPlayedTrack]
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select top(1) S.SongID, S.SongName, S.SongLength, P.PerformerName, S.NumOfPlays, P.PerformerImage
	from Proj_Song S inner join Proj_Performer P on P.PerformerID = S.PerformerID
	order by S.NumOfPlays desc
END
