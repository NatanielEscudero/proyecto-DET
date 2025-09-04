-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-09-2025 a las 19:20:40
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `det`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento_tecnico`
--

CREATE TABLE `seguimiento_tecnico` (
  `id_equipo` int(11) NOT NULL,
  `numero_de_serie` varchar(50) DEFAULT NULL,
  `modelo_exacto` varchar(50) DEFAULT NULL,
  `generacion` int(11) NOT NULL,
  `observaciones` varchar(500) NOT NULL,
  `diagnostico` varchar(50) NOT NULL,
  `estado` varchar(10) NOT NULL,
  `fecha_diagnostico` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `seguimiento_tecnico`
--
ALTER TABLE `seguimiento_tecnico`
  ADD PRIMARY KEY (`id_equipo`),
  ADD UNIQUE KEY `numero_de_serie` (`numero_de_serie`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `seguimiento_tecnico`
--
ALTER TABLE `seguimiento_tecnico`
  MODIFY `id_equipo` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
