USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_AdminGetAllArtists]    Script Date: 24/07/2023 12:48:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns all performers>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_AdminGetAllArtists]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT * from Proj_Performer
END
