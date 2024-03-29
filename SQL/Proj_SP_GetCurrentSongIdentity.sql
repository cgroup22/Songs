USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetCurrentSongIdentity]    Script Date: 24/07/2023 13:09:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the scope identity of the Proj_Song table>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetCurrentSongIdentity]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT top(1) SongID as CurrentID from Proj_Song order by SongID desc
END
