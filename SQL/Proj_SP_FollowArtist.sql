USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_FollowArtist]    Script Date: 24/07/2023 12:54:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<User follows an artist>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_FollowArtist]
	-- Add the parameters for the stored procedure here
	@PerformerID int,
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	if ((select count(*) from Proj_Following where UserID = @UserID and PerformerID = @PerformerID) = 0)
	insert into Proj_Following(UserID, PerformerID) values (@UserID, @PerformerID)
END
