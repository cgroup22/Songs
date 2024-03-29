USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_Get3RandomArtists]    Script Date: 24/07/2023 12:54:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns 3 random artists. Can't include @ArtistToNotInclude>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_Get3RandomArtists]
	-- Add the parameters for the stored procedure here
	@ArtistToNotInclude int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT top(3) PerformerName from Proj_Performer
	where PerformerID != @ArtistToNotInclude
	ORDER BY CHECKSUM(NEWID());
END
