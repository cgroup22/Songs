USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetUserFollowingPerformers]    Script Date: 24/07/2023 13:18:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the following of @UserID>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetUserFollowingPerformers]
	-- Add the parameters for the stored procedure here
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT P.PerformerID, P.PerformerName, P.PerformerImage from Proj_Following F inner join Proj_Performer P on F.PerformerID = P.PerformerID
	where F.UserID = @UserID
END
