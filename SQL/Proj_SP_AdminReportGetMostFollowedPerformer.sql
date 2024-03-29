USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_AdminReportGetMostFollowedPerformer]    Script Date: 24/07/2023 12:51:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Returns the most followed performer>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_AdminReportGetMostFollowedPerformer]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select top(1) P.PerformerName, count(distinct F.UserID) as TotalFollowers
	from Proj_Following F inner join Proj_Performer P on F.PerformerID = P.PerformerID
	group by P.PerformerID, P.PerformerName
	order by count(distinct F.UserID) desc
END
