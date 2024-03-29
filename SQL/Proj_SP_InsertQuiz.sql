USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_InsertQuiz]    Script Date: 24/07/2023 13:21:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Inserts a new solo quiz>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_InsertQuiz]
	-- Add the parameters for the stored procedure here
	@UserID int,
	@QuizID int output
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	insert into Proj_Quiz(UserID) values (@UserID)
	SET @QuizID = SCOPE_IDENTITY();
	
END
