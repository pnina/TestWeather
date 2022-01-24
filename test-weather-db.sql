USE [master]
GO
/****** Object:  Database [TestWeather]    Script Date: 1/24/2022 1:04:25 PM ******/
CREATE DATABASE [TestWeather]
 GO

USE [TestWeather]
GO
/****** Object:  Table [dbo].[FavoriteCity]    Script Date: 1/24/2022 1:04:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FavoriteCity](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[IP] [nvarchar](50) NOT NULL,
	[CityKey] [nvarchar](50) NULL,
	[CreateDate] [datetime] NULL,
 CONSTRAINT [PK_FavoriteCity_1] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WeatherForecast]    Script Date: 1/24/2022 1:04:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WeatherForecast](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CityKey] [nvarchar](50) NOT NULL,
	[Summary] [nvarchar](max) NULL,
	[LastUpdate] [datetime] NULL,
 CONSTRAINT [PK_WeatherForecast_1] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
USE [master]
GO
ALTER DATABASE [TestWeather] SET  READ_WRITE 
GO
