CREATE TABLE stats (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    properties_listed INT,
    happy_clients INT,
    years_experience INT
);

INSERT INTO stats (properties_listed, happy_clients, years_experience) VALUES (500, 1000, 15);
