USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_GetPerformerSongs]    Script Date: 11/07/2023 10:55:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Proj_SP_GetPerformerSongs]
	-- Add the parameters for the stored procedure here
	@PerformerID int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	select S.SongID, P.PerformerName, P.PerformerImage, S.SongName
	from Proj_Song S inner join Proj_Performer P on S.PerformerID = P.PerformerID
	where P.PerformerID = @PerformerID
	order by S.NumOfPlays desc, S.ReleaseYear desc
END
