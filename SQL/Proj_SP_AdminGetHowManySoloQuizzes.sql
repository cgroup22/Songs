USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_AdminGetHowManySoloQuizzes]    Script Date: 24/07/2023 12:49:49 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the number of solo quizzes played>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_AdminGetHowManySoloQuizzes]
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT count(*) as TotalQuizzes from Proj_Quiz
END
