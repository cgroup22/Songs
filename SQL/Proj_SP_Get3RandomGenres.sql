USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_Get3RandomGenres]    Script Date: 24/07/2023 12:55:02 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns 3 random genres, without @GenreToIgnore.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_Get3RandomGenres]
	-- Add the parameters for the stored procedure here
	@GenreToIgnore nvarchar(100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT top(3) GenreName from Proj_Genre
	where GenreName != @GenreToIgnore
	ORDER BY CHECKSUM(NEWID());
END
