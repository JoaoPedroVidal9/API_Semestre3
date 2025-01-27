-- init.sql

CREATE TABLE `classroom` (
  `number` char(5) NOT NULL,
  `description` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Todos os dados do SENAI para a tabela `classroom`
INSERT INTO `classroom` (`number`, `description`, `capacity`) VALUES
('A1', 'CONVERSORES', 16),
('A2', 'ELETRÔNICA', 16),
('A3', 'CLP', 16),
('A4', 'AUTOMAÇÃO', 20),
('A5', 'METROLOGIA', 16),
('A6', 'PNEUMÁTICA/HIDRÁULICA', 20),
('COEL', 'OFICINA DE COMANDOS ELÉTRICOS', 16),
('ITEL1', 'OFICINA DE INSTALAÇÕES ELÉTRICAS - G1', 16),
('ITEL2', 'OFICINA DE INSTALAÇÕES ELÉTRICAS - G2', 16),
('TOR', 'OFICINA DE TORNEARIA', 20),
('AJFR', 'OFICINA DE AJUSTAGEM/FRESAGEM', 16),
('CNC', 'OFICINA DE CNC', 16),
('MMC', 'OFICINA DE MANUTENÇÃO MECÂNICA', 16),
('SOLD', 'OFICINA DE SOLDAGEM', 16),
('B2', 'SALA DE AULA', 32),
('B3', 'SALA DE AULA', 32),
('B5', 'SALA DE AULA', 40),
('B6', 'SALA DE AULA', 32),
('B7', 'SALA DE AULA', 32),
('B8', 'LAB. INFORMÁTICA', 20),
('B9', 'LAB. INFORMÁTICA', 16),
('B10', 'LAB. INFORMÁTICA', 16),
('B11', 'LAB. INFORMÁTICA', 40),
('B12', 'LAB. INFORMÁTICA', 40),
('ALI', 'LAB. ALIMENTOS', 16),
('C1', 'SALA DE AULA', 24),
('C2', 'LAB. DE INFORMÁTICA', 32),
('C3', 'SALA DE MODELAGEM VESTUÁRIO', 20),
('C4', 'SALA DE MODELAGEM VESTUÁRIO', 20),
('C5', 'SALA DE AULA', 16),
('VEST', 'OFICINA DE VESTUÁRIO', 20),
('MPESP', 'OFICINA DE MANUTENÇÃO PESPONTO', 16),
('AUTO', 'OFICINA DE MANUTENÇÃO AUTOMOTIVA', 20),
('D1', 'SALA MODELAGEM', 16),
('D2', 'SALA DE MODELAGEM', 20),
('D3', 'SALA DE AULA', 16),
('D4', 'SALA DE CRIAÇÃO', 18),
('CORT1', 'OFICINA DE CORTE - G1', 16),
('CORT2', 'OFICINA DE CORTE - G2', 16),
('PRE', 'OFICINA DE PREPARAÇÃO', 16),
('PESP1', 'OFICINA DE PESPONTO - G1', 16),
('PESP2', 'OFICINA DE PESPONTO - G2', 16),
('PESP3', 'OFICINA DE PESPONTO - G3', 16),
('MONT1', 'OFICINA DE MONTAGEM - G1', 16),
('MONT2', 'OFICINA DE MONTAGEM - G2', 16);


-- Estrutura para tabela `schedule`
CREATE TABLE `schedule` (
  `id` int(11) NOT NULL,
  `dateStart` date NOT NULL,
  `dateEnd` date NOT NULL,
  `days` varchar(255) NOT NULL,
  `user` char(11) NOT NULL,
  `classroom` char(5) NOT NULL,
  `timeStart` time NOT NULL,
  `timeEnd` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Estrutura para tabela `user`
CREATE TABLE `user` (
  `cpf` char(11) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Despejando dados para a tabela `user`
INSERT INTO `user` (`cpf`, `password`, `email`, `name`) VALUES
('12345680091', '1234', 'euler.ferreira19@gmail.com', 'Euller Silva'),
('46067858886', '1234', 'eu@eu', 'Euller Ferreira');

-- Índices para tabelas despejadas
ALTER TABLE `classroom`
  ADD PRIMARY KEY (`number`);

ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `classroom`(`classroom`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`cpf`);

-- AUTO_INCREMENT para tabelas despejadas
ALTER TABLE `schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

-- Restrições para tabelas despejadas
ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`cpf`),
  ADD CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`classroom`) REFERENCES `classroom` (`number`);
COMMIT;
