-- initial NewQuery
DROP DATABASE IF EXISTS mydb;
CREATE DATABASE mydb;
use myDB;
/* admins table */
DROP TABLE IF EXISTS `admins`;
CREATE TABLE admins(
admin_id bigint,
admin_user_name varchar(255) unique not null,
fullname varchar(255), 
email varchar(255),
contact varchar(255),
primary key (admin_id)
);
ALTER TABLE `admins` 
ADD CONSTRAINT `admins.email_validation` 
    CHECK (`email` REGEXP "^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$");

INSERT INTO admins (admin_id, admin_user_name, fullname, email, contact)
VALUES
	(30000, 'Lukas', 'Lukas Tino','lukas@gmail.com', '018293845');

/* lecturers table */
DROP TABLE IF EXISTS `lecturers`;
CREATE TABLE lecturers(
lecturer_id bigint,
lecturer_user_name varchar(255) unique not null,
fullname varchar(255),
title varchar(255),
email varchar(255),
supervisor varchar(255),
signature varchar(255),
number_of_theses int default 0,
maximum_of_theses int default 0,
primary key(lecturer_id)
);
ALTER TABLE `lecturers` 
ADD CONSTRAINT `lecturers.email_validation` 
    CHECK (`email` REGEXP "^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$");

/* theses table */
DROP TABLE IF EXISTS `theses`;
CREATE TABLE theses(
thesis_id bigint,
thesis_topic varchar(255),
thesis_field varchar(255),
available_day date,
defense_day date,
slot int default 0,
slot_maximum int default 0,
primary key(thesis_id)
);

	/* lecturers_theses ( lecturers - theses relationship) */
DROP TABLE IF EXISTS `lecturers_theses`;
CREATE TABLE lecturers_theses(
lecturer_id bigint,
thesis_id bigint unique,
lecturer2 bigint,
primary key(lecturer_id, thesis_id),
CONSTRAINT fk_inv_user_id_lecturers_theses
    FOREIGN KEY (lecturer_id)
    REFERENCES lecturers (lecturer_id)
    ON DELETE CASCADE,
CONSTRAINT fk_inv_thesis_id_lecturers_theses
    FOREIGN KEY (thesis_id)
    REFERENCES theses (thesis_id)
    ON DELETE CASCADE,
CONSTRAINT fk_inv_lecturer2_lecturers_theses
    FOREIGN KEY (lecturer2)
    REFERENCES lecturers (lecturer_id)
    ON DELETE SET NULL
);

/* students table */
DROP TABLE IF EXISTS `students`;
CREATE TABLE students(
student_id bigint,
student_user_name varchar(255) unique not null,
fullname varchar(255),
intake int,
email varchar(255),
ects varchar(255),
signature varchar(255),
primary key(student_id)
);

/* student's constraints */
ALTER TABLE `students`
ADD CONSTRAINT `fk_inv_ects_students` CHECK (ects >= 168);
ALTER TABLE `students` 
ADD CONSTRAINT `students.email_validation` 
    CHECK (`email` REGEXP "^([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)$");


/* students_theses ( students - theses relationship) */
DROP TABLE IF EXISTS `students_theses`;
CREATE TABLE students_theses(
student_id bigint unique,
thesis_id bigint,
primary key(student_id, thesis_id),
CONSTRAINT fk_inv_user_id_students_theses
    FOREIGN KEY (student_id)
    REFERENCES students (student_id)
    ON DELETE CASCADE,
CONSTRAINT fk_inv_thesis_id_students_theses
    FOREIGN KEY (thesis_id)
    REFERENCES theses (thesis_id)
    ON DELETE CASCADE
);


DROP TABLE IF EXISTS `registrations_for_bachelor_thesis`;
CREATE TABLE registrations_for_bachelor_thesis(
student_id bigint unique,
matriculation_number bigint,
surname varchar(255),
forename varchar(255),
date_of_birth date,
place_of_birth varchar(255),
signature varchar(255),
title_bachelor_thesis varchar(255),
thesis_type varchar(255),
further_participants varchar(255),
supervisor1_title varchar(255),
supervisor1_signature varchar(255),
supervisor1_date date,
supervisor2_title varchar(255),
supervisor2_signature varchar(255),
supervisor2_date date,
issued date,
deadline_copy int,
extension_granted date,
chairman_of_examination varchar(255),
date_of_issue date,
primary key(matriculation_number),
CONSTRAINT fk_inv_thesis_id_students_registrations_for_bachelor_thesis
    FOREIGN KEY (student_id)
    REFERENCES students (student_id)
    ON DELETE CASCADE
);
DROP TABLE IF EXISTS `registrations_for_oral_defense`;
CREATE TABLE registrations_for_oral_defense(
student_id bigint unique,
matriculation_number bigint,
surname varchar(255),
forename varchar(255),
supervisor1_title varchar(255),
supervisor2_title varchar(255),
spectators_present int,
weekdate varchar(255),
proposed_date date,
proposed_time time,
room varchar(255),
concerned_agreed int,
date_receive date,
date_submission date,
primary key(matriculation_number),
CONSTRAINT fk_inv_thesis_id_students_registrations_for_oral_defense
    FOREIGN KEY (student_id)
    REFERENCES students (student_id)
    ON DELETE CASCADE
);

DROP TABLE IF EXISTS `assessment_for_oral_defense`;
CREATE TABLE assessment_for_oral_defense(
student_id bigint unique,
matriculation_number bigint,
surname varchar(255),
forename varchar(255),
date_defense date,
place_defense varchar(255),
start_date date,
finish_date date,
state_of_health int,
supervisor1_title varchar(255),
supervisor1_grade float(2,1),
supervisor2_title varchar(255),
supervisor2_grade float(2,1),
record varchar(255),
assessment_date date,
supervisor1_signature varchar(255),
supervisor2_signature varchar(255),
primary key(matriculation_number),
CONSTRAINT fk_inv_student_id_students_assessment_for_oral_defense
    FOREIGN KEY (student_id)
    REFERENCES students (student_id)
    ON DELETE CASCADE
);
DROP TABLE IF EXISTS `assessment_for_bachelor_thesis`;
CREATE TABLE assessment_for_bachelor_thesis(
student_id bigint unique,
matriculation_number bigint,
surname varchar(255),
forename varchar(255),
thesis_type int,
further_participants varchar(255),
supervisor1_title varchar(255),
supervisor1_grade float(2,1),
supervisor2_title varchar(255),
supervisor2_grade float(2,1),
assessment_thesis varchar(255),
assessment_date date,
supervisor1_signature varchar(255),
supervisor2_signature varchar(255),
primary key(matriculation_number),
CONSTRAINT fk_inv_student_id_students_assessment_for_bachelor_thesis
    FOREIGN KEY (student_id)
    REFERENCES students (student_id)
    ON DELETE CASCADE
);

ALTER TABLE admins
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE registrations_for_bachelor_thesis
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- create trigger check_registration
use mydb;
DROP TRIGGER IF EXISTS insert_checkCondition_registrations_for_bachelor_thesis;
DROP TRIGGER IF EXISTS insert_checkCondition_registrations_for_oral_defense;
DROP TRIGGER IF EXISTS insert_checkCondition_assessment_for_oral_defense;
DROP TRIGGER IF EXISTS insert_checkCondition_assessment_for_bachelor_thesis;

DROP TRIGGER IF EXISTS insert_checkCondition_students;

DROP TRIGGER IF EXISTS insert_checkCondition_students_theses;
DROP TRIGGER IF EXISTS insert_autoUpdateSlot_students_theses;
DROP TRIGGER IF EXISTS delete_autoUpdateSlot_students_theses;
DROP TRIGGER IF EXISTS update_autoUpdateSlot_students_theses;
DROP TRIGGER IF EXISTS update_checkCondition_students_theses;

DROP TRIGGER IF EXISTS update_autoUpdateSlot_theses;

DROP TRIGGER IF EXISTS update_checkUpdateSupervisor_lecturers;
DROP TRIGGER IF EXISTS insert_checkCondition_lecturers;
DROP TRIGGER IF EXISTS updateAfter_updateTitle_lecturers;
DROP TRIGGER IF EXISTS update_checkUpdateL1ToL2_lecturers;


DROP TRIGGER IF EXISTS insert_checkLecturer1_lecturers_theses;
DROP TRIGGER IF EXISTS insert_checkLecturer2_lecturers_theses;
DROP TRIGGER IF EXISTS insert_checkCondition_lecturers_theses;
DROP TRIGGER IF EXISTS insert_autoUpdateNumberOfTheses_lecturers_theses;
DROP TRIGGER IF EXISTS delete_autoUpdateNumberOfTheses_lecturers_theses;
DROP TRIGGER IF EXISTS update_autoUpdateNumberOfTheses_lecturers_theses;
DROP TRIGGER IF EXISTS update_checkCondition_lecturers_theses;


DELIMITER $$
CREATE TRIGGER insert_checkCondition_registrations_for_bachelor_thesis BEFORE INSERT ON registrations_for_bachelor_thesis
	FOR EACH ROW
       BEGIN
			DECLARE MESSAGE VARCHAR(300) default '';
			IF (NEW.thesis_type NOT IN (1,0))
            THEN SET MESSAGE = concat(MESSAGE, ' ', 'thesis_type');
            END IF;
--             IF (NEW.supervisor1_title NOT IN (SELECT title from lecturers)) 
-- 			THEN SET MESSAGE = concat(MESSAGE, ' ', 'supervisor1_title');
--             END IF;
-- 			IF (NEW.supervisor2_title NOT IN (SELECT title from lecturers)) 
--             THEN SET MESSAGE =  concat(MESSAGE, ' ', 'supervisor2_title');
--             END IF;
            IF (NEW.title_bachelor_thesis NOT IN (SELECT thesis_topic from theses))
			THEN SET MESSAGE =  concat(MESSAGE, ' ', 'title_bachelor_thesis');
            END IF;
            IF(MESSAGE != '')
			THEN
				BEGIN
				SET MESSAGE = concat('Cannot insert this table because invalid ' , MESSAGE);
				SIGNAL sqlstate VALUE '99999' SET message_text = message;
            END;
            END IF;
       END
$$

DELIMITER $$
CREATE TRIGGER insert_checkCondition_registrations_for_oral_defense BEFORE INSERT ON registrations_for_oral_defense
	FOR EACH ROW
       BEGIN
			DECLARE MESSAGE VARCHAR(300) default '';
--             IF (NEW.supervisor1_title NOT IN (SELECT title from lecturers)) 
-- 			THEN SET MESSAGE = concat(MESSAGE, ' ', 'supervisor1_title');
--             END IF;
-- 			IF (NEW.supervisor2_title NOT IN (SELECT title from lecturers)) 
--             THEN SET MESSAGE =  concat(MESSAGE, ' ', 'supervisor2_title');
--             END IF;
            IF (NEW.weekdate != (SELECT WEEKDAY(NEW.proposed_date)))
			THEN SET MESSAGE =  concat(MESSAGE, ' ', ' WEEKDAY');
            END IF;
            IF(MESSAGE != '')
			THEN
				BEGIN
				SET MESSAGE = concat('Cannot insert this table because invalid ' , MESSAGE);
				SIGNAL sqlstate VALUE '99999' SET message_text = message;
            END;
            END IF;
       END
$$

DELIMITER $$
CREATE TRIGGER insert_checkCondition_assessment_for_oral_defense BEFORE INSERT ON assessment_for_oral_defense
	FOR EACH ROW
       BEGIN
			DECLARE MESSAGE VARCHAR(300) default '';
			IF (NEW.start_date > NEW.finish_date)
			THEN SET MESSAGE =  concat(MESSAGE, ' ', ' Start Date < Finish Date');
            END IF;
            IF ((1 > NEW.supervisor1_grade) OR (NEW.supervisor1_grade > 5)) 
            THEN SET MESSAGE =  concat(MESSAGE, ' ', 'supervisor1_grade');
            END IF;
			IF ((1 > NEW.supervisor2_grade) OR (NEW.supervisor2_grade > 5)) 
            THEN SET MESSAGE =  concat(MESSAGE, ' ', 'supervisor_grade');
			END IF;
--             IF (NEW.supervisor1_title NOT IN (SELECT title from lecturers)) 
-- 			THEN SET MESSAGE = concat(MESSAGE, ' ', 'supervisor1_title');
--             END IF;
-- 			IF (NEW.supervisor2_title NOT IN (SELECT title from lecturers)) 
--             THEN SET MESSAGE =  concat(MESSAGE, ' ', 'supervisor2_title');
--             END IF;
            IF(MESSAGE != '')
			THEN
				BEGIN
				SET MESSAGE = concat('Cannot insert this table because invalid ' , MESSAGE);
				SIGNAL sqlstate VALUE '99999' SET message_text = message;
            END;
            END IF;
       END
$$


DELIMITER $$
CREATE TRIGGER insert_checkCondition_assessment_for_bachelor_thesis BEFORE INSERT ON assessment_for_bachelor_thesis
	FOR EACH ROW
       BEGIN
			DECLARE MESSAGE VARCHAR(300) default '';
			IF (NEW.thesis_type NOT IN (1,0))
            THEN SET MESSAGE = concat(MESSAGE, ' ', 'thesis_type');
            END IF;
            IF ((1 > NEW.supervisor1_grade) OR (NEW.supervisor1_grade > 5)) 
            THEN SET MESSAGE =  concat(MESSAGE, ' ', 'supervisor1_grade');
            END IF;
			IF ((1 > NEW.supervisor2_grade) OR (NEW.supervisor2_grade > 5)) 
            THEN SET MESSAGE =  concat(MESSAGE, ' ', 'supervisor_grade');
			END IF;
--             IF (NEW.supervisor1_title NOT IN (SELECT title from lecturers)) 
-- 			THEN SET MESSAGE = concat(MESSAGE, ' ', 'supervisor1_title');
--             END IF;
-- 			IF (NEW.supervisor2_title NOT IN (SELECT title from lecturers)) 
--             THEN SET MESSAGE =  concat(MESSAGE, ' ', 'supervisor2_title');
--             END IF;
            IF(MESSAGE != '')
			THEN
				BEGIN
				SET MESSAGE = concat('Cannot insert this table because invalid ' , MESSAGE);
				SIGNAL sqlstate VALUE '99999' SET message_text = message;
            END;
            END IF;
       END
$$


DELIMITER $$
CREATE TRIGGER insert_checkCondition_lecturers BEFORE INSERT ON lecturers
	FOR EACH ROW
       BEGIN
			DECLARE MESSAGE VARCHAR(300) default '';
			IF (NEW.supervisor NOT IN ('lecturer1','lecturer2'))
            THEN SET MESSAGE = concat(MESSAGE, ' ', 'supervisor');
            END IF;
            IF(NEW.lecturer_id > 100000 OR NEW.lecturer_id < 1)
			THEN SET MESSAGE = concat(MESSAGE, ' ', 'lecturer_id');
            END IF;
            IF(MESSAGE != '')
			THEN
				BEGIN
				SET MESSAGE = concat('Cannot insert this table because invalid ' , MESSAGE);
				SIGNAL sqlstate VALUE '99999' SET message_text = message;
            END;
            END IF;
       END
$$

DELIMITER $$
CREATE TRIGGER insert_checkCondition_students_theses BEFORE INSERT ON students_theses
	FOR EACH ROW
       BEGIN
			DECLARE MESSAGE VARCHAR(300) default '';
            IF((select slot from theses where thesis_id = new.thesis_id) >= (select slot_maximum from theses where thesis_id = new.thesis_id))
			THEN SET MESSAGE = concat(MESSAGE, ' ', 'SLOT');
            END IF;
            IF(MESSAGE != '')
			THEN
				BEGIN
				SET MESSAGE = concat('Cannot insert this table because INVALID  ' , MESSAGE);
				SIGNAL sqlstate VALUE '99999' SET message_text = message;
            END;
            END IF;
       END
$$

DELIMITER $$
CREATE TRIGGER update_checkCondition_students_theses BEFORE UPDATE ON students_theses
	FOR EACH ROW
       BEGIN
			DECLARE MESSAGE VARCHAR(300) default '';
            IF((select slot from theses where thesis_id = new.thesis_id) >= (select slot_maximum from theses where thesis_id = new.thesis_id))
			THEN SET MESSAGE = concat(MESSAGE, ' ', 'SLOT');
            END IF;
            IF(MESSAGE != '')
			THEN
				BEGIN
				SET MESSAGE = concat('Cannot insert this table because INVALID  ' , MESSAGE);
				SIGNAL sqlstate VALUE '99999' SET message_text = message;
            END;
            END IF;
       END
$$

DELIMITER $$
CREATE TRIGGER insert_autoUpdateSlot_students_theses AFTER INSERT ON students_theses
FOR EACH ROW
   BEGIN
      UPDATE theses SET slot = slot + 1 where thesis_id = NEW.thesis_id;
   END;
$$ 

DELIMITER $$
CREATE TRIGGER delete_autoUpdateSlot_students_theses AFTER DELETE ON students_theses
FOR EACH ROW
   BEGIN
      UPDATE theses SET slot = slot - 1 where thesis_id = OLD.thesis_id;
   END;
$$ 

DELIMITER $$
CREATE TRIGGER update_autoUpdateSlot_students_theses AFTER UPDATE ON students_theses
FOR EACH ROW
   BEGIN
      UPDATE theses SET slot = slot + 1 where thesis_id = NEW.thesis_id;
      UPDATE theses SET slot = slot - 1 where thesis_id = OLD.thesis_id;
   END;
$$ 

DELIMITER $$
CREATE TRIGGER update_checkUpdateSupervisor_lecturers BEFORE UPDATE ON lecturers
	FOR EACH ROW
       BEGIN
			IF(NEW.supervisor = 'lecturer2' OR NEW.supervisor = 'lecturer1')
					THEN SIGNAL sqlstate VALUE '01000' SET message_text = "successfully change";
					ELSEIF(NEW.supervisor is not null AND NEW.supervisor != 'lecturer1' AND NEW.supervisor != 'lecturer2')
						THEN SIGNAL sqlstate VALUE '99999' SET message_text = 'Cannot UPDATE this supervisor because they have invalid value';
					ELSEIF(NEW.supervisor is null)
						THEN SIGNAL sqlstate VALUE '99999' SET message_text = 'Cannot UPDATE this supervisor because they have null value';
            END IF;
       END
$$
DELIMITER $$
CREATE TRIGGER update_checkUpdateL1ToL2_lecturers BEFORE UPDATE ON lecturers 
	FOR EACH ROW
       BEGIN
			IF(NEW.supervisor = 'lecturer2'  AND ((SELECT lecturer_id FROM lecturers WHERE lecturer_id = NEW.lecturer_id) IN (SELECT lecturer_id FROM lecturers_theses)))
					THEN SIGNAL sqlstate VALUE '99999' SET message_text = 'Cannot UPDATE this supervisor 1 to 2 because they have projects';
			END IF;
       END
$$

DELIMITER $$
CREATE TRIGGER insert_checkLecturer1_lecturers_theses BEFORE INSERT ON lecturers_theses
	FOR EACH ROW
       BEGIN
			IF( NEW.lecturer_id NOT IN (SELECT lecturer_id FROM lecturers where supervisor = 'lecturer1'))
				THEN SIGNAL sqlstate VALUE '99999' SET message_text = 'Cannot create this relationship because lecturer1 not in lecturer table';
			END IF;
       END
$$

DELIMITER $$
CREATE TRIGGER insert_checkLecturer2_lecturers_theses BEFORE INSERT ON lecturers_theses
	FOR EACH ROW
       BEGIN
			IF( NEW.lecturer2 NOT IN (SELECT lecturer_id FROM lecturers where supervisor = 'lecturer2'))
				THEN SIGNAL sqlstate VALUE '99999' SET message_text = 'Cannot create this relationship because lecturer2 not in lecturer table';
			END IF;
       END
$$

-- DELIMITER $$ 
-- CREATE TRIGGER insert_checkLecturer2_lecturers_theses BEFORE UPDATE ON theses
-- FOR EACH ROW
--        BEGIN
-- 			DECLARE MESSAGE VARCHAR(300) default '';
--             IF((select slot from theses where thesis_id = new.thesis_id) > (select slot_maximum from theses where thesis_id = new.thesis_id))
-- 			THEN SET MESSAGE = concat(MESSAGE, ' ', 'SLOT');
--             END IF;
--             IF(MESSAGE != '')
-- 			THEN
-- 				BEGIN
-- 				SET MESSAGE = concat('Cannot insert this table because INVALID  ' , MESSAGE);
-- 				SIGNAL sqlstate VALUE '99999' SET message_text = message;
--             END;
--             END IF;
--        END
-- $$

DELIMITER $$
CREATE TRIGGER insert_checkCondition_lecturers_theses BEFORE INSERT ON lecturers_theses
	FOR EACH ROW
       BEGIN
			DECLARE MESSAGE VARCHAR(300) default '';
            IF((select number_of_theses from lecturers where lecturer_id = new.lecturer_id) >= (select maximum_of_theses from lecturers where lecturer_id = new.lecturer_id))
			THEN SET MESSAGE = concat(MESSAGE, ' ', 'NUMBER OF THESES');
            END IF;
            IF(MESSAGE != '')
			THEN
				BEGIN
				SET MESSAGE = concat('Cannot insert this table because INVALID  ' , MESSAGE);
				SIGNAL sqlstate VALUE '99999' SET message_text = message;
            END;
            END IF;
       END
$$

DELIMITER $$
CREATE TRIGGER insert_autoUpdateNumberOfTheses_lecturers_theses AFTER INSERT ON lecturers_theses
FOR EACH ROW
   BEGIN
      UPDATE lecturers SET number_of_theses = number_of_theses + 1 WHERE lecturer_id = NEW.lecturer_id; 
   END;
$$ 

DELIMITER $$
CREATE TRIGGER delete_autoUpdateNumberOfTheses_lecturers_theses AFTER DELETE ON lecturers_theses
FOR EACH ROW
   BEGIN
      UPDATE lecturers SET number_of_theses = number_of_theses - 1 where lecturer_id = OLD.lecturer_id;
   END;
$$ 

DELIMITER $$
CREATE TRIGGER update_autoUpdateNumberOfTheses_lecturers_theses AFTER UPDATE ON lecturers_theses
FOR EACH ROW
   BEGIN
      UPDATE lecturers SET number_of_theses = number_of_theses + 1 where lecturer_id = NEW.lecturer_id;
      UPDATE lecturers SET number_of_theses = number_of_theses - 1 where lecturer_id = OLD.lecturer_id;
   END;
$$ 

DELIMITER $$
CREATE TRIGGER update_checkCondition_lecturers_theses BEFORE UPDATE ON lecturers_theses
	FOR EACH ROW
       BEGIN
			DECLARE MESSAGE VARCHAR(300) default '';
            IF((select number_of_theses from lecturers where lecturer_id = new.lecturer_id) >= (select maximum_of_theses from lecturers where lecturer_id = new.lecturer_id))
			THEN SET MESSAGE = concat(MESSAGE, ' ', 'NUMBER OF THESES');
            END IF;
            IF(MESSAGE != '')
			THEN
				BEGIN
				SET MESSAGE = concat('Cannot insert this table because INVALID  ' , MESSAGE);
				SIGNAL sqlstate VALUE '99999' SET message_text = message;
            END;
            END IF;
       END
$$
-- initial insert_data
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (12390, 'asdasd', 'asdasd' ,'12312@gmail.com','Dr. Dat', 'lecturer1', 2);
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (21029, 'alexnguyen', 'Alexander Nguyen','21029@gmail.com','Dr. Alex Nguyen', 'lecturer1', 2);
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (22323, 'mikadang', 'Mika Dang','22323@gmail.com','Dr. Mika Dang ','lecturer2', 2);
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (21933, 'longle', 'Phan Le Long', '21933@gmail.com','Dr. Phan Le Long', 'lecturer1', 2);
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (23483, 'tiffany', 'Tiffany Do','23483@gmail.com','Dr. Tiffany Do', 'lecturer1', 2);
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (23953, 'gulshan', 'Gulshan Jakob', '25903@gmail.com','Dr. Gulshan Jakob', 'lecturer2', 2);
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (27903, 'ayotunde', 'Ayotunde Adrián', '27903@gmail.com','Dr. Ayotunde Adrián', 'lecturer2', 2);
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (20489, 'romein', 'Romein Mihkkal', '20489@gmail.com','Dr. Romein Mihkkal', 'lecturer2', 2);
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (26029, 'walther', 'Walther Jyoti', '26029@gmail.com','Dr. Walther Jyoti', 'lecturer1', 2);
INSERT INTO lecturers (lecturer_id, lecturer_user_name, fullname, email, title, supervisor, maximum_of_theses)
VALUES (25489, 'philandros', 'Philandros Björn', '25489@gmail.com','Prof. Philandros Björn', 'lecturer2', 2);


INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum) 
VALUES (210292, 'Web Project', 'web','2022-03-29','2022-05-29', 1);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum) 
VALUES (210291, 'Data Project', 'data','2022-07-04','2022-07-07', 2);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum)
VALUES (329852,'Data Mining', 'data', '2022-07-04', '2022-9-03', 1);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum)
VALUES (123124,'machine learning for AI', ' machine learning', '2022-09-04', '2022-12-12', 1);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum)
VALUES (123122,'digital image processing', 'computer vision', '2022-07-04', '2022-12-03', 1);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum)
VALUES (123342,'Artificial Intelligence', 'AI', '2022-07-04', '2022-12-03', 1);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum)
VALUES (123454,'Networking', 'Networking', '2022-08-01', '2022-11-03', 1);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum)
VALUES (453252,'cloud computing', 'data', '2022-07-04', '2022-12-03', 1);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum)
VALUES (454634,'Data aggregation in Big data', 'data', '2022-07-04', '2022-12-03', 1);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum)
VALUES (123566,'Financial Sector', 'Data warehousing', '2022-07-04', '2022-12-03', 1);
INSERT INTO theses (thesis_id, thesis_topic, thesis_field, available_day, defense_day, slot_maximum)
VALUES (123554,'Home automation', 'internet of things', '2022-07-04', '2022-12-03', 1);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (12345, 'datnguyen','datnguyenlamduy', 2018,'12345@gmail.com', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (12323, 'tuannguyen','tuanphamnguyen', 2018,'12323@gmail.com', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (12357, 'longphannguyen','lenguyenphanlong',2018,'12357@gmail.com', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (12211, 'longphan','phannguyenlong',2018,'12211@gmail.com', 168);

INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (13961, 'cmewis0', 'Cammela Wish', 2017, 'kdevennie0@aboutads.info', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (12486, 'dnoakes1', 'Donki Hote', 2016, 'cwasielewski1@sourceforge.net', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (18593, 'bpoletto2', 'Letto Bombi', 2016, 'dbullimore2@t.co', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (19363, 'arickell3', 'Aris Kelly', 2017, 'mtourle3@unesco.org', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (15345, 'dbehnecke4', 'Davis Ben', 2017, 'latwood4@rediff.com', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (11475, 'dpamplin5', 'Paul Linter', 2018, 'rkorfmann5@jugem.jp', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (13444, 'abezzant6', 'zant abe', 2018, 'bbly6@redcross.org', 168);
INSERT INTO students (student_id, student_user_name, fullname, intake, email, ects)
VALUES (12365, 'test', 'test_student', 2018, 'test@redcross.org', 168);
INSERT INTO students_theses (student_id, thesis_id)
VALUES (12345, 210292);
INSERT INTO students_theses (student_id, thesis_id)
VALUES (12323, 210291);
INSERT INTO students_theses (student_id, thesis_id)
VALUES (12357, 123566);
INSERT INTO students_theses (student_id, thesis_id)
VALUES (12211, 453252);
INSERT INTO students_theses (student_id, thesis_id)
VALUES (12486, 123342);
INSERT INTO students_theses (student_id, thesis_id)
VALUES (18593, 123124);
-- INSERT INTO students_theses (student_id, thesis_id)
-- VALUES (19363, 123342);
INSERT INTO students_theses (student_id, thesis_id)
VALUES (15345, 123454);
-- INSERT INTO students_theses (student_id, thesis_id)
-- VALUES (11475, 123566);

INSERT INTO lecturers_theses (lecturer_id, thesis_id,lecturer2)
VALUES (21029,210291,23953);
INSERT INTO lecturers_theses (lecturer_id, thesis_id,lecturer2)
VALUES (21029,210292,25489);
INSERT INTO lecturers_theses (lecturer_id, thesis_id,lecturer2)
VALUES (21933,123454,27903);
INSERT INTO lecturers_theses (lecturer_id, thesis_id,lecturer2)
VALUES (23483,453252,20489);
INSERT INTO lecturers_theses (lecturer_id, thesis_id,lecturer2)
VALUES (26029,123554,22323);
use mydb;
-- insert user_query
/* total user */ 
DROP TABLE IF EXISTS `tbl_user`;
CREATE TABLE tbl_user(
id bigint,
username varchar(255) unique,
password varchar(255),
salt varchar(255),
role varchar(255),
refreshToken varchar(255) default null,
socket_id varchar(255) default null,
primary key (id)
);

-- INSERT INTO tbl_user (user_id, user_name,roles)
-- select admin_id, admin_user_name, 'admin' from admins;
-- INSERT INTO tbl_user (user_id, user_name, roles)
-- select lecturer_id, lecturer_user_name,'supervisor 1' from lecturers
-- where lecturers.supervisor = '1';
-- INSERT INTO tbl_user (user_id, user_name, roles)
-- select lecturer_id, lecturer_user_name,'supervisor 2' from lecturers
-- where lecturers.supervisor = '2';
-- INSERT INTO tbl_user (user_id, user_name, roles)
-- select student_id, student_user_name, 'student' from students;
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (1,'james1','$2b$10$x9bUz5Z8zhlLyXHnoTeINeiDQF.FsHTFTSyAgy9ApHqzRcQYl7GEa','$2b$10$x9bUz5Z8zhlLyXHnoTeINe','[\"admin\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (11475,'dpamplin5','$2b$10$LP1YujoN.L/XDC8B78wdpeNo0LPCTaYkN3EXmOLL8bKaYDnADHhKa','$2b$10$LP1YujoN.L/XDC8B78wdpe','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (12211,'longphan','$2b$10$/a5pc8rUK/KtFH/GerZhkO8uRQ2jWe3YUt6pKeDhPoAfcwOq81Ez.','$2b$10$/a5pc8rUK/KtFH/GerZhkO','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (12323,'tuannguyen','$2b$10$izYR1M8uNI5yLzyCUhBIzeM3rRWZZI6G5mhrIXEPQ7nc8TrwU0Sze','$2b$10$izYR1M8uNI5yLzyCUhBIze','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (12345,'datnguyen','$2b$10$tDdxiXIYZMJ80DynXCqCAeI5TpoedK53vuPYgL96P9ojLwJg9FDza','$2b$10$tDdxiXIYZMJ80DynXCqCAe','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (12357,'longphannguyen','$2b$10$ghUmiG/OcGrEK1BkGquI4eJvxO5U5n1jKHu5tZIIvBJX.cixV2kjC','$2b$10$ghUmiG/OcGrEK1BkGquI4e','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (12486,'dnoakes1','$2b$10$OuQ9YGoAuTtuiB4bQ3JIkejs5VlXG5bSobt1ZMdhLlMGNtuDviOu.','$2b$10$OuQ9YGoAuTtuiB4bQ3JIke','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (13444,'abezzant6','$2b$10$5PQCA74kI/Xf.FlnDv0wweC5vQ2pSXCCTHz0.G57H.nSHrirFi54i','$2b$10$5PQCA74kI/Xf.FlnDv0wwe','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (13961,'cmewis0','$2b$10$pFFhdibdC3ItjKbs2x5uGexCdGGD2pnSe/2NaER074SyKhIj0CC4i','$2b$10$pFFhdibdC3ItjKbs2x5uGe','[\"student\"]', NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (15345,'dbehnecke4','$2b$10$bBlVm.5AYVT7H1ETidScj.VtUpypwBs60Ls/4teHsMzht0ViwPMeu','$2b$10$bBlVm.5AYVT7H1ETidScj.','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (18593,'bpoletto2','$2b$10$0QciWbMz96UIvqOb7VZvy.B4Pv0Nx5S2uoBWlvz/PAVoz2tct6PUq','$2b$10$0QciWbMz96UIvqOb7VZvy.','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (19363,'arickell3','$2b$10$FdJy9bKXkIq7lp5Vb/iVB.Z/ZhC0d74D7e.US59MpsNwd6PiKIqrK','$2b$10$FdJy9bKXkIq7lp5Vb/iVB.','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (2,'james2','$2b$10$jwh9AeLOSOlRVYBcJBl9keyzBHvtu8XaOvhpWkjN.L9Z2aWidXNDu','$2b$10$jwh9AeLOSOlRVYBcJBl9ke','[\"lecturer1\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (20489,'romein','$2b$10$K2lj3M8DFmSvc09dFj4dSOqkkpCAfek44lWnz3Qr7aaxi5Lu9LWMK','$2b$10$K2lj3M8DFmSvc09dFj4dSO','[\"lecturer2\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (21029,'alexnguyen','$2b$10$P6l8AVNjNapv5QUrnTT.VOKrau9kWb9hkKhB/sBXa9cqE./lus9Y6','$2b$10$P6l8AVNjNapv5QUrnTT.VO','[\"lecturer1\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (21933,'longle','$2b$10$V4.JHJSlHyLSbJ3wAqbm3.xSxXFMN5WY4Qt0AZk0CxnpHkezprjSm','$2b$10$V4.JHJSlHyLSbJ3wAqbm3.','[\"lecturer1\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (22323,'mikadang','$2b$10$3t1xmYrazIzqNPEI7synPeXRVXfbGdfXJebhTdbI/cDwSXkHl6S0.','$2b$10$3t1xmYrazIzqNPEI7synPe','[\"lecturer2\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (23483,'tiffany','$2b$10$CQ4P3ZWzl52gH6VLR9IHgOLKBUAr9bwb5n3F3/rYcT5TOBc9samta','$2b$10$CQ4P3ZWzl52gH6VLR9IHgO','[\"lecturer1\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (23953,'gulshan','$2b$10$sRjnI2JWBa1EO0TC9FTlOOaddu45fs6mV52XugRytccXrEz4/vOKy','$2b$10$sRjnI2JWBa1EO0TC9FTlOO','[\"lecturer2\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (25489,'philandros','$2b$10$dQDMpeUCcVXwms581Jy0M.RuJAiTmSBNr0B5fGB72CKWYSGgEqjt.','$2b$10$dQDMpeUCcVXwms581Jy0M.','[\"lecturer2\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (26029,'walther','$2b$10$GDdzfgjttVl/99M3W/5p5e2ltjwCdpF0Wwvqypz.j795iaIz3WdWi','$2b$10$GDdzfgjttVl/99M3W/5p5e','[\"lecturer1\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (27903,'ayotunde','$2b$10$7/RACPjwtdHpcTMdfFunFO6VLqC8bkm4.0vMKIU7roiq9ButuleXW','$2b$10$7/RACPjwtdHpcTMdfFunFO','[\"lecturer2\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (3,'james3','$2b$10$m3dn951BzAaTtdghAZXbfO7Sa5zWsiHk4E9SIf3F4Z4vsRkItdkT6','$2b$10$m3dn951BzAaTtdghAZXbfO','[\"lecturer2\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (30000,'lukas','$2b$10$NXrXllPQl.sx6klbDuhX.OfCx.tDQmqKiZLWFo/J05bzorqaUDb7u','$2b$10$NXrXllPQl.sx6klbDuhX.O','[\"admin\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (4,'james4','$2b$10$N30UBoYMvbOUAQY9Go0GQumVyEh2RtO1yiiVmV1rSMRuV1b0pC1Um','$2b$10$N30UBoYMvbOUAQY9Go0GQu','[\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (6,'james101','$2b$10$WFFgfIPHJFsEUp5kES2B7e4zPffwoMI6uaBTbtckq5NC9qA37RvOu','$2b$10$WFFgfIPHJFsEUp5kES2B7e','[\"admin\",\"lecturer1\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (7,'james102','$2b$10$biV2OSBRTmBMRSeLMNnN7OMKgHcpEoi4//OP/NzJUPHl48M.Xf.Ny','$2b$10$biV2OSBRTmBMRSeLMNnN7O','[\"admin\",\"student\"]',NULL);
INSERT INTO `tbl_user` (`id`,`username`,`password`,`salt`,`role`,`refreshToken`) VALUES (8,'james103','$2b$10$CKH2Xg/63PHCVck2Q9giZeZ/Ym9r1M9JfajxDmCFwK8HVyM.mjdxy','$2b$10$CKH2Xg/63PHCVck2Q9giZe','[\"admin\",\"lecturer2\"]',NULL);

/* set up permission tbl_permission */
DROP TABLE IF EXISTS `tbl_permission`;
CREATE TABLE tbl_permission(
per_id bigint primary key,
per_name varchar(255)
);
INSERT INTO tbl_permission (per_id, per_name)
VALUES
	(1,'fullAccess'),
    (2,'admin'),
    (3,'lecturer 1'),
    (4,'lecturer 2'),
    (5,'student');
    
/* create table tbl_user_per */
DROP TABLE IF EXISTS `tbl_user_per`;
CREATE TABLE tbl_user_per(
	user_per_id bigint auto_increment primary key,
    per_id bigint,
    user_id bigint,
    license int,
    CONSTRAINT fk_inv_user_id_tbl_user_per
    FOREIGN KEY (user_id)
    REFERENCES tbl_user (id)
    ON DELETE CASCADE,
	CONSTRAINT fk_inv_per_id_tbl_user_per
    FOREIGN KEY (per_id)
    REFERENCES tbl_permission (per_id)
    ON DELETE CASCADE
);
INSERT INTO tbl_user_per (per_id, user_id, license)
VALUES
-- 	(5,'12211',1),
-- 	(5,'12323',1),
	(5,12345,1),
-- 	(5,12357,1),
	(3,21029,1),
	(4,22323,1),
	(2,30000,1);
/* set up created_at and edited_at */
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE notifications(
notification_id int auto_increment,
title varchar(255),
author bigint,
content varchar(255),
primary key (notification_id),
CONSTRAINT fk_inv_author_notifications
    FOREIGN KEY (author)
    REFERENCES tbl_user (id)
    ON DELETE CASCADE
);
INSERT INTO notifications (title, author, content) values ("title1s", 21029, "content1");
INSERT INTO notifications (title, author, content) values ("title1", 30000, "content1");
INSERT INTO notifications (title, author, content) values ("title2", 30000, "content2");
INSERT INTO notifications (title, author, content) values ("title3", 30000, "content3");
INSERT INTO notifications (title, author, content) values ("title4", 30000, "content4");
INSERT INTO notifications (title, author, content) values ("title5", 30000, "content5");
INSERT INTO notifications (title, author, content) values ("title6", 30000, "content6");
INSERT INTO notifications (title, author, content) values ("title7", 30000, "content7");
INSERT INTO notifications (title, author, content) values ("title8", 30000, "content8");
INSERT INTO notifications (title, author, content) values ("title9", 30000, "content9");
INSERT INTO notifications (title, author, content) values ("title10", 30000, "content10");
INSERT INTO notifications (title, author, content) values ("title11", 30000, "content11");
INSERT INTO notifications (title, author, content) values ("title12", 30000, "content12");


DROP TABLE IF EXISTS `users_notifications`;
CREATE TABLE users_notifications(
user_id bigint,
notification_id int,
primary key(user_id, notification_id),
CONSTRAINT fk_inv_user_id_users_notifications
    FOREIGN KEY (user_id)
    REFERENCES tbl_user (id)
    ON DELETE CASCADE,
CONSTRAINT fk_inv_notification_id_users_notifications
    FOREIGN KEY (notification_id)
    REFERENCES notifications (notification_id)
    ON DELETE CASCADE
);
INSERT INTO users_notifications (user_id, notification_id) values (21029, 1);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 2);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 3);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 4);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 5);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 6);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 7);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 8);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 9);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 10);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 11);
INSERT INTO users_notifications (user_id, notification_id) values (30000, 12);

DROP TABLE IF EXISTS `tbl_per_detail`;
CREATE TABLE tbl_per_detail(
detail_id int auto_increment primary key,
per_id bigint,
action_name varchar(255),
action_code varchar(255),
check_action int,
CONSTRAINT fk_inv_tbl_per_detail_per_id
    FOREIGN KEY (per_id)
    REFERENCES tbl_permission (per_id)
    ON DELETE CASCADE
);
INSERT INTO tbl_per_detail (per_id, action_name, action_code, check_action)
VALUES
/* full access */
/* database */
(1,'Access database', 'DATABASE', 1),

/* add/delete lecturer */
(1,'Add lecturer', 'ADD LECTURER', 1),
(1,'Delete lecturer', 'DELETE LECTURER', 1),

/* CRUD student */
(1,'Add student', 'ADD STUDENT', 1),
(1,'Update student', 'UPDATE STUDENT', 1),
(1,'Read student', 'READ STUDENT', 1),
(1,'Delete student', 'DELETE STUDENT', 1),

/* CRUD thesis */
(1,'Add thesis', 'ADD THESIS', 1),
(1,'Update thesis', 'UPDATE THESIS', 1),
(1,'Read thesis', 'READ THESIS', 1),
(1,'Delete thesis', 'DELETE THESIS', 1),

/* Another feature */
(1,'Notification', 'NOTIFICATION', 1),
(1,'Assign supervisor 2', 'ASSIGN SUPERVISOR 2', 1),
(1,'Sign', 'SIGN', 1),

/* Assign student to thesis */
(1,'Add student to thesis', 'ADD STUDENT TO THESIS', 1),
(1,'Delete student to thesis', 'DELETE STUDENT TO THESIS', 1),

/* Assign lecturer to thesis */
(1,'assign thesis to lecturer', 'ASSIGN THESIS TO LECTURER', 1);

INSERT INTO tbl_per_detail (per_id, action_name, action_code, check_action)
VALUES
/* admin */
/* database */
(2,'Access database', 'DATABASE', 1),

/* add/delete lecturer */
(2,'Add lecturer', 'ADD LECTURER', 1),
(2,'Delete lecturer', 'DELETE LECTURER', 1),

/* CRUD student */
(2,'Add student', 'ADD STUDENT', 1),
(2,'Update student', 'UPDATE STUDENT', 1),
(2,'Read student', 'READ STUDENT', 1),
(2,'Delete student', 'DELETE STUDENT', 1),

/* CRUD thesis */
(2,'Add thesis', 'ADD THESIS', 1),
(2,'Update thesis', 'UPDATE THESIS', 1),
(2,'Read thesis', 'READ THESIS', 1),
(2,'Delete thesis', 'DELETE THESIS', 1),

/* Another feature */
(2,'Notification', 'NOTIFICATION', 1),
(2,'Assign supervisor 2', 'ASSIGN SUPERVISOR 2', 1),
(2,'Sign', 'SIGN', 0),

/* Assign student to thesis */
(2,'Add student to thesis', 'ADD STUDENT TO THESIS', 1),
(2,'Delete student to thesis', 'DELETE STUDENT TO THESIS', 1),

/* Assign lecturer to thesis */
(2,'assign thesis to lecturer', 'ASSIGN THESIS TO LECTURER', 1);

INSERT INTO tbl_per_detail (per_id, action_name, action_code, check_action)
VALUES
/* lecturer 1 */
/* database */
(3,'Access database', 'DATABASE', 0),

/* add/delete lecturer */
(3,'Add lecturer', 'ADD LECTURER', 0),
(3,'Delete lecturer', 'DELETE LECTURER', 0),

/* CRUD student */
(3,'Add student', 'ADD STUDENT', 0),
(3,'Update student', 'UPDATE STUDENT', 0),
(3,'Read student', 'READ STUDENT', 1),
(3,'Delete student', 'DELETE STUDENT', 0),

/* CRUD thesis */
(3,'Add thesis', 'ADD THESIS', 1),
(3,'Update thesis', 'UPDATE THESIS', 1),
(3,'Read thesis', 'READ THESIS', 1),
(3,'Delete thesis', 'DELETE THESIS', 1),

/* Another feature */
(3,'Notification', 'NOTIFICATION', 1),
(3,'Assign supervisor 2', 'ASSIGN SUPERVISOR 2', 1),
(3,'Sign', 'SIGN', 1),

/* Assign student to thesis */
(3,'Add student to thesis', 'ADD STUDENT TO THESIS', 1),
(3,'Delete student to thesis', 'DELETE STUDENT TO THESIS', 1),

/* Assign lecturer to thesis */
(3,'assign thesis to lecturer', 'ASSIGN THESIS TO LECTURER', 1);

INSERT INTO tbl_per_detail (per_id, action_name, action_code, check_action)
VALUES
/* lecturer 2 */
/* database */
(4,'Access database', 'DATABASE', 0),

/* add/delete lecturer */
(4,'Add lecturer', 'ADD LECTURER', 0),
(4,'Delete lecturer', 'DELETE LECTURER', 0),

/* CRUD student */
(4,'Add student', 'ADD STUDENT', 0),
(4,'Update student', 'UPDATE STUDENT', 0),
(4,'Read student', 'READ STUDENT', 1),
(4,'Delete student', 'DELETE STUDENT', 0),

/* CRUD thesis */
(4,'Add thesis', 'ADD THESIS', 0),
(4,'Update thesis', 'UPDATE THESIS', 0),
(4,'Read thesis', 'READ THESIS', 1),
(4,'Delete thesis', 'DELETE THESIS', 0),

/* Another feature */
(4,'Notification', 'NOTIFICATION', 1),
(4,'Assign supervisor 2', 'ASSIGN SUPERVISOR 2', 0),
(4,'Sign', 'SIGN', 1),

/* Assign student to thesis */
(4,'Add student to thesis', 'ADD STUDENT TO THESIS', 0),
(4,'Delete student to thesis', 'DELETE STUDENT TO THESIS', 0),

/* Assign lecturer to thesis */
(4,'assign thesis to lecturer', 'ASSIGN THESIS TO LECTURER', 1);

INSERT INTO tbl_per_detail (per_id, action_name, action_code, check_action)
VALUES
/* student */
/* database */
(5,'Access database', 'DATABASE', 0),

/* add/delete lecturer */
(5,'Add lecturer', 'ADD LECTURER', 0),
(5,'Delete lecturer', 'DELETE LECTURER', 0),

/* CRUD student */
(5,'Add student', 'ADD STUDENT', 0),
(5,'Update student', 'UPDATE STUDENT', 0),
(5,'Read student', 'READ STUDENT', 1),
(5,'Delete student', 'DELETE STUDENT', 0),

/* CRUD thesis */
(5,'Add thesis', 'ADD THESIS', 0),
(5,'Update thesis', 'UPDATE THESIS', 0),
(5,'Read thesis', 'READ THESIS', 1),
(5,'Delete thesis', 'DELETE THESIS', 0),

/* Another feature */
(5,'Notification', 'NOTIFICATION', 1),
(5,'Assign supervisor 2', 'ASSIGN SUPERVISOR 2', 0),
(5,'Sign', 'SIGN', 0),

/* Assign student to thesis */
(5,'Add student to thesis', 'ADD STUDENT TO THESIS', 1),
(5,'Delete student to thesis', 'DELETE STUDENT TO THESIS', 1),

/* Assign lecturer to thesis */
(5,'assign thesis to lecturer', 'ASSIGN THESIS TO LECTURER', 0);
ALTER TABLE notifications
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE users_notifications
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;