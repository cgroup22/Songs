USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_InitiateNewValidation]    Script Date: 24/07/2023 13:19:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Initiates a new email validation request.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_InitiateNewValidation]
	-- Add the parameters for the stored procedure here
	@UserID int,
	@UserToken varchar(16)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @flag int
	set @flag = 0
    -- Insert statements for procedure here
	if ((select count(*) from Proj_Users where @UserID = UserID) = 0)
	set @flag = 1 -- User doesn't exist
	else if ((select count(*) from Proj_Users where @UserID = UserID and UserIsVerified = 1) <> 0)
	set @flag = 2 -- User already verified
	else update Proj_Users
	set UserToken = @UserToken, LastTokenTime = getdate()
	where UserID = @UserID
	return @flag
END
