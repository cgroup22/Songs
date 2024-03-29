USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_PostUser]    Script Date: 09/06/2023 19:32:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<cgroup22>
-- Create date: <4.6.23>
-- Description:	<Inserts a new user to the Users table>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_PostUser]
	-- Add the parameters for the stored procedure here
	@email nvarchar(50),
	@name nvarchar(50),
	@password nvarchar(100),
	@token varchar(16)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Proj_Users(UserEmail, UserName, UserPassword, UserToken, LastTokenTime) values (@email, @name, @password, @token, getdate())
END
