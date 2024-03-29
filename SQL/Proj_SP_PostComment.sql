USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_PostComment]    Script Date: 24/07/2023 13:22:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Adds a comment to this performer.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_PostComment]
	-- Add the parameters for the stored procedure here
	@UserID int,
	@PerformerID int,
	@Content nvarchar(256)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Proj_Comment (UserID, PerformerID, CommentContent, CommentDate) values (@UserID, @PerformerID, @Content, getdate())
END
