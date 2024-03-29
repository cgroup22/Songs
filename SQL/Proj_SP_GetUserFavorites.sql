USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetUserFavorites]    Script Date: 24/07/2023 13:18:22 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the @UserID favorites>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetUserFavorites]
	-- Add the parameters for the stored procedure here
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT UF.SongID, S.SongLength, P.PerformerName, S.SongName, P.PerformerImage, P.PerformerID
	from Proj_UserFavorites UF inner join Proj_Song S on UF.SongID = S.SongID inner join
	Proj_Performer P on S.PerformerID = P.PerformerID
	where UF.UserID = @UserID
END
