USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_IsAccountVerified]    Script Date: 24/07/2023 12:47:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns whether this user account is verified>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_IsAccountVerified]
	-- Add the parameters for the stored procedure here
	@UserID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT UserIsVerified as Result from Proj_Users where UserID = @UserID
END
