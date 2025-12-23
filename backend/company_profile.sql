-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: company_profile
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `careers`
--

DROP TABLE IF EXISTS `careers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `careers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_title` varchar(200) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `department` varchar(100) DEFAULT NULL COMMENT 'e.g., IT, Sales, Marketing, HR',
  `location` varchar(100) DEFAULT NULL,
  `employment_type` enum('full_time','part_time','contract','internship','freelance') DEFAULT 'full_time',
  `experience_level` enum('entry','junior','mid','senior','lead','manager') DEFAULT NULL,
  `salary_range` varchar(100) DEFAULT NULL,
  `description` longtext NOT NULL,
  `responsibilities` longtext COMMENT 'JSON array of responsibilities',
  `requirements` longtext COMMENT 'JSON array of requirements',
  `qualifications` text COMMENT 'JSON array of qualifications',
  `benefits` text COMMENT 'JSON array of benefits',
  `application_deadline` datetime DEFAULT NULL,
  `posted_date` datetime DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `application_url` varchar(255) DEFAULT NULL,
  `views` int DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `status` enum('open','closed','on_hold') DEFAULT 'open',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `careers`
--

LOCK TABLES `careers` WRITE;
/*!40000 ALTER TABLE `careers` DISABLE KEYS */;
/*!40000 ALTER TABLE `careers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `logo_url` varchar(255) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL COMMENT 'e.g., Banking, Healthcare, Manufacturing',
  `project_description` text,
  `testimonial` text,
  `testimonial_author` varchar(100) DEFAULT NULL,
  `testimonial_position` varchar(100) DEFAULT NULL,
  `collaboration_since` int DEFAULT NULL COMMENT 'Year of collaboration start',
  `order_number` int DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_info`
--

DROP TABLE IF EXISTS `company_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(200) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `about` longtext,
  `history` longtext,
  `vision` text,
  `mission` text,
  `established_year` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'Indonesia',
  `logo_url` varchar(255) DEFAULT NULL,
  `favicon_url` varchar(255) DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `twitter_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `youtube_url` varchar(255) DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_info`
--

LOCK TABLES `company_info` WRITE;
/*!40000 ALTER TABLE `company_info` DISABLE KEYS */;
INSERT INTO `company_info` VALUES (1,'Prima Integrasi Network','IT Solution, Oracle, database, server','Established since 2001, PT. Prima Integrasi Network begun its journey as a computer network and system integrator company. With a commitment to provide excellent services and solutions, we provide full integration system known as end-to-end services to our customers which make us achieve a high level of customer satisfaction.\n\nTo enhance our hardware solutions, database and network infrastructure, on 2012 we took a partnership with well-known Oracle. We believe that through our partnership and commitment we can deliver the best service and solution for our clients IT environment and needs.\n\nTo achieve our goals and fulfill our commitment we also have vision and mission as our guideline.','Established since 2001, PT. Prima Integrasi Network begun its journey as a computer network and system integrator company. With a commitment to provide excellent services and solutions, we provide full integration system known as end-to-end services to our customers which make us achieve a high level of customer satisfaction.','To become one of the world’s leading companies, the best place to work and profitable for stakeholders.','Helping our clients create their future by bringing innovations and competence to ICT world.',2001,'primaintegrasi@gmail.com','081284300979','Neo Soho Lt 20, Grogol Petamburan, Jakarta Barat','Grogol','Jakarta Barat','15326','Indonesia','/uploads/logos/logo-1764152607083-482035055.png',NULL,'https://prima-integrasi.co.id/about-us/','https://prima-integrasi.co.id/about-us/','https://prima-integrasi.co.id/about-us/','https://prima-integrasi.co.id/about-us/','https://prima-integrasi.co.id/about-us/','','','','2025-11-26 07:58:44','2025-11-26 10:23:27');
/*!40000 ALTER TABLE `company_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `company` varchar(200) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `category` enum('general','sales','support','partnership','career','other') DEFAULT 'general',
  `status` enum('new','read','replied','closed') DEFAULT 'new',
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `notes` text COMMENT 'Admin notes',
  `replied_at` datetime DEFAULT NULL,
  `replied_by` int DEFAULT NULL COMMENT 'User ID who replied',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(300) NOT NULL,
  `description` longtext,
  `event_type` enum('seminar','workshop','conference','webinar','training','exhibition','other') DEFAULT 'seminar',
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `address` text,
  `is_online` tinyint(1) DEFAULT '0',
  `meeting_link` varchar(255) DEFAULT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `gallery` text COMMENT 'JSON array of image URLs',
  `organizer` varchar(100) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `registration_url` varchar(255) DEFAULT NULL,
  `max_participants` int DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `is_published` tinyint(1) DEFAULT '0',
  `status` enum('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `heroes`
--

DROP TABLE IF EXISTS `heroes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `heroes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `button_text` varchar(50) DEFAULT NULL,
  `button_link` varchar(255) DEFAULT NULL,
  `order_number` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `heroes`
--

LOCK TABLES `heroes` WRITE;
/*!40000 ALTER TABLE `heroes` DISABLE KEYS */;
INSERT INTO `heroes` VALUES (1,'Prima Integrasi Network',' ','To become one of the world\'s leading companies, the best place to work and profitable for stakeholders.','/uploads/images/image-1765189674002-261367853.jpeg','Learn more','#about',0,1,'2025-12-08 08:24:30','2025-12-08 10:29:42'),(2,'Prima Integrasi Network','To become one of the world\'s leading companies, the best place to work and profitable for stakeholders.','Helping our clients create their future by bringing innovations and competence to ICT world.','/uploads/images/image-1765189769099-846464562.jpeg','Learn more','#about',1,1,'2025-12-08 10:29:29','2025-12-08 10:29:29');
/*!40000 ALTER TABLE `heroes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(300) NOT NULL,
  `category` varchar(100) DEFAULT NULL COMMENT 'e.g., Company News, Industry News, Product Launch',
  `excerpt` text,
  `content` longtext NOT NULL,
  `featured_image` varchar(255) DEFAULT NULL,
  `gallery` text COMMENT 'JSON array of image URLs',
  `author` varchar(100) DEFAULT NULL,
  `published_date` datetime DEFAULT NULL,
  `views` int DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_published` tinyint(1) DEFAULT '0',
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `tags` varchar(255) DEFAULT NULL COMMENT 'Comma-separated tags',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'Satellite sensor technology with Prima Integrasi Network','satellite sensor technology','Tech','','Unlock the power of satellite sensor technology with Prima Integrasi Network. With access to over 475 integrated satellites, we provide precise object detection, change monitoring, and classification. Extract vital information and actionable insights, delivered seamlessly through API, intuitive dashboards, and embedded applications, driving more intelligent decisions with cutting-edge data from the skies.','/uploads/images/featured_image-1765189609483-985511581.jpeg',NULL,'','2024-12-08 00:00:00',0,0,1,'','',NULL,'2025-12-08 10:26:49','2025-12-08 10:26:49');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `logo_url` varchar(255) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `partnership_type` enum('technology','strategic','vendor','solution','other') DEFAULT 'strategic',
  `partnership_since` int DEFAULT NULL COMMENT 'Year of partnership start',
  `order_number` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL COMMENT 'e.g., Hardware, Software, Solutions',
  `short_description` text,
  `description` longtext,
  `features` longtext COMMENT 'JSON array of features',
  `benefits` text COMMENT 'JSON array of benefits',
  `specifications` longtext COMMENT 'JSON object of specifications',
  `target_segment` varchar(255) DEFAULT NULL COMMENT 'Target customer segment',
  `image_url` varchar(255) DEFAULT NULL,
  `gallery` text COMMENT 'JSON array of image URLs',
  `brochure_url` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `price_range` varchar(100) DEFAULT NULL,
  `order_number` int DEFAULT '0',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` text,
  `description` longtext,
  `icon` varchar(100) DEFAULT NULL COMMENT 'Icon class or image URL',
  `image_url` varchar(255) DEFAULT NULL,
  `order_number` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  UNIQUE KEY `slug_2` (`slug`),
  UNIQUE KEY `slug_3` (`slug`),
  UNIQUE KEY `slug_4` (`slug`),
  UNIQUE KEY `slug_5` (`slug`),
  UNIQUE KEY `slug_6` (`slug`),
  UNIQUE KEY `slug_7` (`slug`),
  UNIQUE KEY `slug_8` (`slug`),
  UNIQUE KEY `slug_9` (`slug`),
  UNIQUE KEY `slug_10` (`slug`),
  UNIQUE KEY `slug_11` (`slug`),
  UNIQUE KEY `slug_12` (`slug`),
  UNIQUE KEY `slug_13` (`slug`),
  UNIQUE KEY `slug_14` (`slug`),
  UNIQUE KEY `slug_15` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Data Center & Cloud Platform','We can help your IT Infrastructure journey using the latest technology available on the market','Data center is where companies run the workload of their IT systems','We can help your IT Infrastructure journey using the latest technology available on the market such as customizable servers from Oracle SPARC, IBM Power as well as x86 servers from various reputable system builders (HP, Lenovo, Dell). We also provide storage with flexibility between NAS, SAN and All-Flash Array System with brands to choose from IBM, HP, Dell/EMC, PureStorage and Netapp. Last but not least, we can also guide you transforming from traditional server-storage-network design into a Hyperconverged System using the technology from Nutanix and VMware.','','/uploads/images/image-1765182983332-613247310.jpg',1,1,'2025-12-08 08:35:07','2025-12-08 08:36:23');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('super_admin','admin','editor') DEFAULT 'editor',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `email_15` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'rafael','rafaelrichie@gmail.com','$2b$10$ROzKFpJLJucU.th3KBqn4.nFhs1CT9PQP3vAekNpTKuU4LNimpxsC','Rafael Richie','super_admin',1,'2025-11-26 07:57:49','2025-11-25 14:39:20','2025-11-26 07:57:49'),(2,'rafael_admin','rafaelrichie03@gmail.com','$2b$10$rDb.Csu1cMgRd9yut5PrX.68jK.8/BmjptR7Wg3mwiZy.NDCISR6e','Rafael Richie','admin',1,'2025-12-03 04:53:27','2025-11-25 14:40:34','2025-12-03 04:53:27');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `values`
--

DROP TABLE IF EXISTS `values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `values` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` text,
  `icon` varchar(100) DEFAULT NULL COMMENT 'Icon class or image URL',
  `image_url` varchar(255) DEFAULT NULL,
  `order_number` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `values`
--

LOCK TABLES `values` WRITE;
/*!40000 ALTER TABLE `values` DISABLE KEYS */;
INSERT INTO `values` VALUES (1,'People','PRIMA is a group of people who have the same vision & mission','','/uploads/images/image-1765185965100-166869659.jpg',0,1,'2025-12-08 09:26:05','2025-12-08 09:27:56'),(2,'Resilience','PRIMA learn to cope with challenges and continually evolving to meet our increasing objectives','','',1,1,'2025-12-08 09:27:02','2025-12-08 09:27:21'),(3,'Integrity','PRIMA act with commitment, honesty & ethical behavior to all our customers & partners','','',2,1,'2025-12-08 09:28:48','2025-12-08 09:28:48'),(4,'Magnificent','PRIMA do magnificent work in Information and Communication Technology','','',3,1,'2025-12-08 09:29:21','2025-12-08 09:29:21'),(5,'Accountability','PRIMA will be accountable to each other, organization and customers','','',4,1,'2025-12-08 09:29:47','2025-12-08 09:29:47');
/*!40000 ALTER TABLE `values` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11 16:19:19
