USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetRandomBand]    Script Date: 24/07/2023 13:13:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns a random band. Used to generate questions for the quizzes.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_GetRandomBand]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT top(3) PerformerName from Proj_Performer
	where isABand = 1
	ORDER BY CHECKSUM(NEWID());
END
