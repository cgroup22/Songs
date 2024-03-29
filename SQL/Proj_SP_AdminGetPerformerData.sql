USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_AdminGetPerformerData]    Script Date: 24/07/2023 18:09:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Gets the data about a performer for the admins report>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_AdminGetPerformerData]
	-- Add the parameters for the stored procedure here
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT P.PerformerID, P.PerformerName, P.isABand, P.instagramTag, sum(S.NumOfPlays) as TotalPlays, count(distinct F.UserID) as TotalFollowers,
	(select count(distinct UF.UserID) from Proj_UserFavorites UF inner join Proj_Song So on UF.SongID = So.SongID where So.PerformerID = P.PerformerID)
	as NumOfUserFavorites
	from Proj_Performer P inner join Proj_Song S on P.PerformerID = S.PerformerID left join Proj_Following F on P.PerformerID = F.PerformerID
	group by P.PerformerID, P.PerformerName, P.isABand, P.instagramTag
	order by sum(S.NumOfPlays) desc
END
