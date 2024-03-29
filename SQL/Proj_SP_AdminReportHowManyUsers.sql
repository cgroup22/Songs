USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_AdminReportHowManyUsers]    Script Date: 24/07/2023 12:52:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the number of registered users>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_AdminReportHowManyUsers]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.


    -- Insert statements for procedure here
	SELECT count(*) as TotalUsers From Proj_Users
END
