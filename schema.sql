DROP TABLE IF EXISTS round;
CREATE TABLE round(
    id SERIAL PRIMARY KEY NOT NULL,
    typeofactivity VARCHAR(256) NOT NULL,
    ownerName VARCHAR(256) NOT NULL,
    idtype VARCHAR(256) NOT NULL,
    idnum BIGINT NOT NULL,
    dob DATE NOT NULL,
    telnum BIGINT NOT NULL,
    notes VARCHAR(256) NOT NULL,
    namesofobservers TEXT NOT NULL
);

DROP TABLE IF EXISTS admins;
CREATE TABLE admins(
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(256) NOT NULL,
    passwords VARCHAR(256) NOT NULL
);

INSERT INTO admins (username,passwords) VALUES ('aghyadalbalkhi','Aghyad2020');
INSERT INTO admins (username,passwords) VALUES ('abdal3ali','abd2020');