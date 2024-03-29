USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetArtistsComments]    Script Date: 24/07/2023 13:08:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the comments on a performer's page.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetArtistsComments]
	-- Add the parameters for the stored procedure here
	@PerformerID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT C.CommentContent, U.UserName, C.CommentDate from Proj_Comment C inner join Proj_Users U on C.UserID = U.UserID where PerformerID = @PerformerID
END
