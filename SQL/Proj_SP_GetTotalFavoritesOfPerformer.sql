USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetTotalFavoritesOfPerformer]    Script Date: 24/07/2023 13:16:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the total favorites of this performer.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetTotalFavoritesOfPerformer]
	-- Add the parameters for the stored procedure here
	@PerformerID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	--SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT COUNT(*) AS TotalFavorites
	FROM (
    SELECT COUNT(DISTINCT UF.UserID) AS UserCount
    FROM Proj_UserFavorites UF 
    INNER JOIN Proj_Song S ON UF.SongID = S.SongID
    WHERE S.PerformerID = @PerformerID
    GROUP BY UF.UserID
	) AS Subquery; 
END
