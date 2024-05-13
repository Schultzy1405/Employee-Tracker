INSERT INTO department (name)
VALUES 
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales'),
    ('Service');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Software Engineer',60000,1),
    ('Salesman',80000,2),
    ('Human Resources',50000,3),
    ('Accountant',70000,4),
    ('Janitor',60000,5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John','Doe',1,1),
    ('Jane','Doe',2,1),
    ('Jim','Doe',3,2),
    ('Jack','Doe',4,3),
    ('Joel','Doe',5,5);
