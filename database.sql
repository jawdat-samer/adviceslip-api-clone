-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: adviceslip
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('47552e55-eca1-4a05-a2c3-271f35c9a31f','43e6f07f1aa68cc9088709f6178e22e2347c5f1c5fdb38e1e4203155f0346b63','2024-11-19 01:56:14.950','20241119013018_create_advice_table',NULL,NULL,'2024-11-19 01:56:14.930',1),('53e646ba-3432-4c88-a701-574643978dd4','61797c2579dd56a8c7fcbf0ec8d48a494fed6838a93406a0fb51653683411a81','2024-11-30 11:25:49.118','20241130112549_add_user_table',NULL,NULL,'2024-11-30 11:25:49.095',1),('98df129a-b67a-4d20-a250-f00e2c96f545','36cbadd61c069d949bce8de4bb990e197574f95751d5c35e069693d40d24d5ea','2024-11-30 11:27:21.429','20241130112721_update_user_table',NULL,NULL,'2024-11-30 11:27:21.402',1),('ad07466b-24a9-4e99-ae03-f8db89e11bc1','74e78f9ab05b0282d215f4a84e1bfc21a334b4cba7a7614f7b82aca417dc0ba5','2024-11-30 11:36:04.860','20241130113604_update_user_table',NULL,NULL,'2024-11-30 11:36:04.846',1),('c97f1717-5556-4c3a-8c9b-c31cbd437b51','a2a8de0d9a4e650ebb93e575bfcc282b2db40501dde45de9e0d093e1b2e72d12','2024-11-19 01:56:14.973','20241119015201_create_advice_counter_table',NULL,NULL,'2024-11-19 01:56:14.952',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advice`
--

DROP TABLE IF EXISTS `advice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advice`
--

LOCK TABLES `advice` WRITE;
/*!40000 ALTER TABLE `advice` DISABLE KEYS */;
INSERT INTO `advice` VALUES (1,'Make choices and dont look back.'),(2,'Walking is a perfectly valid solution to traffic congestion problems.'),(3,'If you need cheering up, try searching online for photos of kittens.'),(4,'Don&#x27;t be afraid of silly ideas.'),(5,'Give up your seat for someone who needs it.'),(6,'Hold the door open for the next person.'),(7,'You can have too much of a good thing.'),(8,'Remedy tickly coughs with a drink of honey, lemon and water as hot as you can take.'),(9,'Pedantry is fine, unless you&#x27;re on the receiving end. And not a pedant.'),(10,'You can fail at what you don&#x27;t want. So you might as well take a chance on doing what you love.'),(11,'If you are feeling down, try holding a pencil between your top lip and your nose for five minutes.'),(12,'Never cut your own fringe.'),(13,'If you&#x27;re squashed close to strangers on public transport, try not to be rude to them. No one likes those situations.'),(14,'As you get older, learn never to trust a fart.'),(15,'Sing in the shower.'),(16,'Sing in the shower.');
/*!40000 ALTER TABLE `advice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advicecounter`
--

DROP TABLE IF EXISTS `advicecounter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advicecounter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `counter` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advicecounter`
--

LOCK TABLES `advicecounter` WRITE;
/*!40000 ALTER TABLE `advicecounter` DISABLE KEYS */;
INSERT INTO `advicecounter` VALUES (1,16);
/*!40000 ALTER TABLE `advicecounter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default.png',
  `password` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordUpdatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `passwordResetToken` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordResetExpiresAt` datetime(3) DEFAULT NULL,
  `role` enum('author','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'author',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Jawdat Samer','admin@advice.com','default.png','$2a$12$Ua7SjqYAhKz5hIEDpoJEzeEjjAI7qbOhYdPqii39L3MwmGkOKTnAO','2024-12-01 22:48:13.776',NULL,NULL,'admin',1),(2,'test','test@advice.com','default.png','$2a$12$jN16RNtKRThlQlFIDllJ8eKHm.1OJ8.MEIhUJwApqGqYwfinTzWIu','2024-11-30 12:22:48.774',NULL,NULL,'author',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-03  7:06:56
