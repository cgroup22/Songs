USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetPlaylistName]    Script Date: 24/07/2023 13:12:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the name of the playlist>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetPlaylistName]
	-- Add the parameters for the stored procedure here
	@PlaylistID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT top(1) PlaylistName from Proj_Playlist where PlaylistID = @PlaylistID
END
