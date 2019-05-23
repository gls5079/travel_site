SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `cs340_stanekg`.`Activities_Price`;
DROP TABLE IF EXISTS `cs340_stanekg`.`Activities`;
DROP TABLE IF EXISTS `cs340_stanekg`.`Airline_Price`;
DROP TABLE IF EXISTS `cs340_stanekg`.`Airline`;
DROP TABLE IF EXISTS `cs340_stanekg`.`Trip_Criteria`;
DROP TABLE IF EXISTS `cs340_stanekg`.`Traveler`;
DROP TABLE IF EXISTS `cs340_stanekg`.`Hotel_Price`;
DROP TABLE IF EXISTS `cs340_stanekg`.`Hotel`;
DROP TABLE IF EXISTS `cs340_stanekg`.`Destination_Type`;
DROP TABLE IF EXISTS `cs340_stanekg`.`City`;

CREATE TABLE `City`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(48) NOT NULL,
state VARCHAR(2) NOT NULL DEFAULT 'ZZ'
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Hotel`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL,
phone_number BIGINT(9) NOT NULL,
city_id INT DEFAULT NULL,
FOREIGN KEY(`city_id`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Hotel_Price`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
hotel_id INT DEFAULT NULL,
book_date DATE NOT NULL,
price DECIMAL(5,2) NOT NULL,
FOREIGN KEY(`hotel_id`) REFERENCES `Hotel` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Airline`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL,
phone_number BIGINT(9) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Airline_Price`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
airline_id INT NOT NULL, 
starting_city_id INT NOT NULL,
ending_city_id INT NOT NULL,
flight_date DATE NOT NULL,
price DECIMAL (5,2) NOT NULL,
FOREIGN KEY (`airline_id`) REFERENCES `Airline` (`id`)  ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (`starting_city_id`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (`ending_city_id`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Activities`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL,
phone_number BIGINT(9) NOT NULL,
city_id INT NOT NULL,
FOREIGN KEY (`city_id`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Activities_Price`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
activity_id INT NOT NULL,
book_date DATE NOT NULL,
price DECIMAL (5,2) NOT NULL,
FOREIGN KEY (`activity_id`) REFERENCES `Activities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Traveler`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL,
address_street VARCHAR(100) NOT NULL,
address_city VARCHAR(48) NOT NULL,
address_state VARCHAR(2) NOT NULL DEFAULT "ZZ",
address_zip_code INT NOT NULL,
email_address VARCHAR(50) NOT NULL,
phone_number BIGINT(9) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Destination_Type`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
city_id INT NOT NULL,
type VARCHAR(100) NOT NULL,
FOREIGN KEY (`city_id`) REFERENCES `City` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Trip_Criteria`(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
travelers_id INT NOT NULL,
starting_city_id INT,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
max_budget DECIMAL(5,2) NOT NULL,
destination_type_id INT,
FOREIGN KEY (`destination_type_id`) REFERENCES `Destination_Type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
FOREIGN KEY (`travelers_id`)REFERENCES `Traveler` (`id`)  ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (`starting_city_id`) REFERENCES `City` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;

-- City Tests
INSERT INTO `City` (name, state)
VALUES ('Seattle', 'WA');

INSERT INTO `City` (name, state)
VALUES ('San Diego', 'CA');

-- Hotel Tests
INSERT INTO `Hotel`(name, phone_number, city_id)
VALUE ('Loews Hotel 1000', '2069571000', (SELECT id FROM `City` WHERE name = 'Seattle') );

-- Hotel Price Tests
INSERT INTO `Hotel_Price`(hotel_id, book_date, price)
VALUES ((SELECT id FROM `Hotel` WHERE name = 'Loews Hotel 1000'), '2019-05-05', '239');

-- Airline Tests
INSERT INTO `Airline` (name, phone_number)
VALUE ('Alaska Air', '8006545669');

-- Airline_Price Tests
INSERT INTO `Airline_Price` (airline_id, starting_city_id, ending_city_id, flight_date, price)
VALUES ((SELECT id FROM `Airline` WHERE name = 'Alaska Air'), (SELECT id FROM `City` WHERE name = 'Seattle'), (SELECT id FROM `City` WHERE name = 'San Diego'), '2019-5-5', '325');

-- Activities Tests
INSERT INTO `Activities` (name, phone_number, city_id)
VALUES ('Space Needle', '2069052100', (SELECT id FROM `City` WHERE name='Seattle'));

-- Activities_Price Tests
INSERT INTO `Activities_Price` (activity_id, book_date, price)
VALUES ((SELECT id FROM `Activities` WHERE name='Space Needle'), '2019-5-5', '37.50');

-- Traveler Tests
INSERT INTO `Traveler` (name, address_street, address_city, address_state, address_zip_code, email_address, phone_number)
VALUES('Billy Bob', '329 SW 8th St.', 'Corvallis', 'OR', '97333', 'testMcTesty@gmail.com', '5418765309');

-- Destination_Type Tests
INSERT INTO `Destination_Type` (city_id, type)
VALUES ((SELECT id FROM `City` WHERE name = 'Seattle'), 'Urban');

-- Trip_Criteria Tests
INSERT INTO `Trip_Criteria` (travelers_id, starting_city_id, start_date, end_date, max_budget, destination_type_id)
VALUES (
(SELECT id FROM `Traveler` WHERE name = 'Billy Bob'),
(SELECT id FROM `City` WHERE name = 'Seattle'),
'2019-5-5',
'2019-5-6',
'500',
(SELECT id FROM `Destination_Type` WHERE type='urban')
)
