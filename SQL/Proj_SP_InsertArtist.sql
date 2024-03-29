USE [igroup122_test2]
GO
/****** Object:  StoredProcedure [dbo].[Proj_SP_InsertArtist]    Script Date: 24/07/2023 13:20:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Inserts a new artist. Gets the image URL from Google Images using an API.>
-- =============================================
ALTER PROCEDURE [dbo].[Proj_SP_InsertArtist]
	-- Add the parameters for the stored procedure here
	@PerformerName nvarchar(100),
	@PerformerImage VARCHAR(2000)--,
	--@birthDate date
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	--declare @iden int
	insert into Proj_Performer(PerformerName, isABand, PerformerImage) values (@PerformerName, 0, @PerformerImage)
	--set @iden = scope_identity()
	--insert into Proj_Artist(ArtistID, birthDate) values (@iden, @birthDate)
END