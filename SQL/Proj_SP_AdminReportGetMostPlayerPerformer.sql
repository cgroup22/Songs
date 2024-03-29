USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_AdminReportGetMostPlayerPerformer]    Script Date: 24/07/2023 12:52:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the mosy played performer>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_AdminReportGetMostPlayerPerformer]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select top(1) P.PerformerName, sum(S.NumOfPlays) as TotalListeners
	from Proj_Performer P inner join Proj_Song S on P.PerformerID = S.PerformerID
	group by P.PerformerName
	order by sum(S.NumOfPlays) desc
END
