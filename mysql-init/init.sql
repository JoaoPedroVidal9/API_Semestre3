CREATE DATABASE  IF NOT EXISTS `semestre3` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `semestre3`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: semestre3
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `classroom`
--

DROP TABLE IF EXISTS `classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classroom` (
  `number` char(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int NOT NULL,
  PRIMARY KEY (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom`
--

LOCK TABLES `classroom` WRITE;
/*!40000 ALTER TABLE `classroom` DISABLE KEYS */;
INSERT INTO `classroom` VALUES ('A1','CONVERSORES',16),('A2','ELETRÔNICA',16),('A3','CLP',16),('A4','AUTOMAÇÃO',20),('A5','METROLOGIA',16),('A6','PNEUMÁTICA/HIDRÁULICA',20),('AJFR','OFICINA DE AJUSTAGEM/FRESAGEM',16),('ALI','LAB. ALIMENTOS',16),('AUTO','OFICINA DE MANUTENÇÃO AUTOMOTIVA',20),('B10','LAB. INFORMÁTICA',16),('B11','LAB. INFORMÁTICA',40),('B12','LAB. INFORMÁTICA',40),('B2','SALA DE AULA',32),('B3','SALA DE AULA',32),('B5','SALA DE AULA',40),('B6','SALA DE AULA',32),('B7','SALA DE AULA',32),('B8','LAB. INFORMÁTICA',20),('B9','LAB. INFORMÁTICA',16),('C1','SALA DE AULA',24),('C2','LAB. DE INFORMÁTICA',32),('C3','SALA DE MODELAGEM VESTUÁRIO',20),('C4','SALA DE MODELAGEM VESTUÁRIO',20),('C5','SALA DE AULA',16),('CNC','OFICINA DE CNC',16),('COEL','OFICINA DE COMANDOS ELÉTRICOS',16),('CORT1','OFICINA DE CORTE - G1',16),('CORT2','OFICINA DE CORTE - G2',16),('D1','SALA MODELAGEM',16),('D2','SALA DE MODELAGEM',20),('D3','SALA DE AULA',16),('D4','SALA DE CRIAÇÃO',18),('ITEL1','OFICINA DE INSTALAÇÕES ELÉTRICAS - G1',16),('ITEL2','OFICINA DE INSTALAÇÕES ELÉTRICAS - G2',16),('MMC','OFICINA DE MANUTENÇÃO MECÂNICA',16),('MONT1','OFICINA DE MONTAGEM - G1',16),('MONT2','OFICINA DE MONTAGEM - G2',16),('MPESP','OFICINA DE MANUTENÇÃO PESPONTO',16),('PESP1','OFICINA DE PESPONTO - G1',16),('PESP2','OFICINA DE PESPONTO - G2',16),('PESP3','OFICINA DE PESPONTO - G3',16),('PRE','OFICINA DE PREPARAÇÃO',16),('SOLD','OFICINA DE SOLDAGEM',16),('TOR','OFICINA DE TORNEARIA',20),('VEST','OFICINA DE VESTUÁRIO',20);
/*!40000 ALTER TABLE `classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dateStart` date NOT NULL,
  `dateEnd` date NOT NULL,
  `days` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` char(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `classroom` char(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timeStart` time NOT NULL,
  `timeEnd` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  KEY `classroom` (`classroom`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`cpf`),
  CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`classroom`) REFERENCES `classroom` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (44,'2025-04-04','2025-05-05','Seg, Ter, Qua','12345680091','A1','08:00:00','12:12:12'),(45,'2025-04-04','2025-05-05','Seg, Ter, Qua','12345680091','A2','08:00:00','12:12:12');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `cpf` char(11) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('12345680091','1234','euler.ferreira19@gmail.com','Euller Silva'),('46067858886','1234','eu@eu','Euller Ferreira');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'semestre3'
--

--
-- Dumping routines for database 'semestre3'
--
/*!50003 DROP FUNCTION IF EXISTS `calcula_user_reserva` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`alunods`@`%` FUNCTION `calcula_user_reserva`(user_cpf char(11)) RETURNS int
    READS SQL DATA
begin
declare total int;

select count(*) into total from schedule
WHERE schedule.user = CONVERT(user_cpf USING utf8mb4) COLLATE utf8mb4_unicode_ci;

return total;
end ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-16 13:50:08
