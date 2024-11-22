CREATE TABLE users
(
    id         INTEGER CONSTRAINT users_pk PRIMARY KEY AUTOINCREMENT,
    user_id    TEXT,
    username   TEXT,
    password   TEXT,
    email      TEXT,
    role       TEXT DEFAULT 'STAFF',
    status     TEXT DEFAULT 'ACTIVE',
    created_at datetime DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime')),
    updated_at datetime,
    CONSTRAINT users_uniq
        UNIQUE (user_id, username)
);

CREATE INDEX users_index
    ON USERS (role, status);

INSERT INTO users (user_id, username, password)
VALUES ('04278a89-ebff-493e-bd00-bb18251596f3', 'admin', 'ca5652787ff88a36a3ae40372014655d:4a37f4914fce9139b395fc5ff3c17378');

-- 

CREATE TABLE books
(
    id          INTEGER CONSTRAINT books_pk PRIMARY KEY AUTOINCREMENT,
    title       TEXT,
    description TEXT,
    price       INTEGER,
    author      TEXT,
    created_at  datetime DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime')),
    updated_at  datetime
);

CREATE INDEX books_index
    ON BOOKS (author);

INSERT INTO books(title, description, price, author)
VALUES('International Intranet Engineer', 'indexing the capacitor won''t do anything, we need to generate the solid state AI bus!', 344, 'Dr. Alison Ryan');
INSERT INTO books(title, description, price, author)
VALUES('National Assurance Assistant', 'overriding the interface won''t do anything, we need to back up the back-end SAS sensor!', 150, 'Gerald Douglas');
INSERT INTO books(title, description, price, author)
VALUES('Corporate Solutions Assistant', 'Try to override the COM alarm, maybe it will quantify the bluetooth circuit!', 337, 'Dianne O''Hara');
INSERT INTO books(title, description, price, author)
VALUES('Customer Identity Consultant', 'You can''t compress the bus without copying the back-end IB monitor!', 794, 'Casey Streich');
INSERT INTO books(title, description, price, author)
VALUES('Forward Factors Agent', 'You can''t synthesize the panel without copying the primary SSL array!', 117, 'Otis Skiles');
INSERT INTO books(title, description, price, author)
VALUES('Senior Accounts Representative', 'You can''t calculate the alarm without calculating the multi-byte USB protocol!', 532, 'Molly Lesch');
INSERT INTO books(title, description, price, author)
VALUES('Dynamic Data Developer', 'If we transmit the program, we can get to the AI pixel through the neural PNG alarm!', 997, 'Sean Runolfsson');
