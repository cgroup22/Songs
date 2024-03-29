USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_UnfollowArtist]    Script Date: 24/07/2023 13:35:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Used when user unfollows an artist>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_UnfollowArtist]
	-- Add the parameters for the stored procedure here
	@PerformerID int,
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	if ((select count(*) from Proj_Following where UserID = @UserID and PerformerID = @PerformerID) > 0)
	delete from Proj_Following where UserID = @UserID and PerformerID = @PerformerID
END
