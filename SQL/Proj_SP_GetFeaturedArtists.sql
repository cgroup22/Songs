USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetFeaturedArtists]    Script Date: 24/07/2023 13:09:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the performers to feature in index.html>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetFeaturedArtists]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select top(6) P.PerformerID, P.PerformerName, P.PerformerImage from Proj_Performer P inner join Proj_Song PS on P.PerformerID = PS.PerformerID
	group by P.PerformerID, P.PerformerName, P.PerformerImage
	order by sum(PS.NumOfPlays) desc
END
