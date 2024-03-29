USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetPlaylistIDidentity]    Script Date: 24/07/2023 13:12:11 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the scope identity of Proj_Playlist>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetPlaylistIDidentity]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select ident_current('Proj_Playlist') as CurrentIdentity
END
