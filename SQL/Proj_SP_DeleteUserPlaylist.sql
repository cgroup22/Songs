USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_DeleteUserPlaylist]    Script Date: 24/07/2023 12:53:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Deletes the whole playlist, gets the UserID to make sure it's not someone else trying to delete it. (security measure)>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_DeleteUserPlaylist]
	-- Add the parameters for the stored procedure here
	@PlaylistID int,
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	delete from Proj_Playlist where PlaylistID = @PlaylistID and UserID = @UserID
END
