USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_LoadUserInformation]    Script Date: 24/07/2023 13:22:08 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns all the users data for the admins report.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_LoadUserInformation] 
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * FROM Proj_Users
END
