DROP DATABASE [luckyDb]  
GO  
CREATE DATABASE [luckyDb]
GO

USE [luckyDb];
GO
/****** Object:  Table [dbo].[address]    Script Date: 21/10/2022 16:21:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[address](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[cityId] [int] NULL,
	[street] [nvarchar](255) NULL,
 CONSTRAINT [PK_address] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[city]    Script Date: 21/10/2022 16:21:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[city](
	[id] [int] NOT NULL,
	[countryId] [int] NULL,
	[name] [nvarchar](255) NULL,
 CONSTRAINT [PK_city] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[country]    Script Date: 21/10/2022 16:21:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[country](
	[id] [int] NOT NULL,
	[name] [nvarchar](255) NULL,
 CONSTRAINT [PK_country] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[profiles]    Script Date: 21/10/2022 16:21:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[profiles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[addressId] [int] NULL,
	[name] [nvarchar](255) NULL,
 CONSTRAINT [PK_profiles] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 21/10/2022 16:21:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](255) NULL,
	[password] [nvarchar](255) NULL,
 CONSTRAINT [PK_users] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[city] ([id], [countryId], [name]) VALUES (1, 1, N'Temperley')
INSERT [dbo].[city] ([id], [countryId], [name]) VALUES (2, 1, N'Llavallol')
INSERT [dbo].[city] ([id], [countryId], [name]) VALUES (3, 1, N'Lomas de Zamora')
INSERT [dbo].[city] ([id], [countryId], [name]) VALUES (4, 1, N'Banfield')
GO
INSERT [dbo].[country] ([id], [name]) VALUES (1, N'ARGENTINA')
INSERT [dbo].[country] ([id], [name]) VALUES (2, N'BRASIL')
INSERT [dbo].[country] ([id], [name]) VALUES (3, N'COLOMBIA')
INSERT [dbo].[country] ([id], [name]) VALUES (4, N'URUGUAY')
INSERT [dbo].[country] ([id], [name]) VALUES (5, N'ECUADOR')
GO
ALTER TABLE [dbo].[city]  WITH CHECK ADD  CONSTRAINT [FK_city_country1] FOREIGN KEY([countryId])
REFERENCES [dbo].[country] ([id])
GO
ALTER TABLE [dbo].[city] CHECK CONSTRAINT [FK_city_country1]
GO