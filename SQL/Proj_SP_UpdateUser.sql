USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_UpdateUser]    Script Date: 24/07/2023 13:35:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Updates user details>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_UpdateUser]
	-- Add the parameters for the stored procedure here
	@UserID int,
	@UserEmail nvarchar(50),
    @UserName nvarchar(50),
    @UserPassword nvarchar(100),
	@isNewEmail bit,
	@token varchar(16)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	declare @flag int
	set @flag = 0
	if (@isNewEmail = 0)
	UPDATE Proj_Users
    SET UserName = @UserName, UserPassword = @UserPassword
    where UserID = @UserID
	else UPDATE Proj_Users
	set UserEmail = @UserEmail, UserName = @UserName, UserToken = @token, LastTokenTime = getdate(), UserIsVerified = 0
	where UserID = @UserID
END
