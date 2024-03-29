USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_AdminInsertPerformer]    Script Date: 24/07/2023 12:51:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Inserts a performer to our db>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_AdminInsertPerformer]
	-- Add the parameters for the stored procedure here
	@PerformerName nvarchar(100),
	@isABand bit,
	@PerformerImage nvarchar(2000),
	@PerformerInstagram nvarchar(100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Proj_Performer(PerformerName, isABand, PerformerImage, instagramTag) values (@PerformerName, @isABand, @PerformerImage, @PerformerInstagram)
END