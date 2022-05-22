INSERT INTO dept (dName)
VALUES 
('Support'),
('Engineer'),
('Product Specialist'),
('Sales');

INSERT INTO roles (title, salary, dept_id)
VALUES
('Level 1 Support', 50000, 1),
('Level 2 Support', 60000, 1),
('Level 3 Support', 70000, 1),
('Front End Dev', 100000, 2), 
('Back End Dev', 100000, 2),
('Quality Assurance', 100000, 3), 
('Product Designer', 95000, 3),
('Sales', 100000, 4),
('Account Manager', 90000, 4);


INSERT INTO employee (fName, lName, role_id, manager_id)
VALUES 
('Daffy', 'Duck', 2, null),
('Porky', 'Pig', 1, 1),
('Yosemite', 'Sam', 4, null),
('Elmer', 'Fudd', 3, 3),
('Tweety', 'Bird', 6, null),
('Sylvester', 'Cat', 5, 5),
('Bugs', 'Bunny', 7, null),
('Marvin', 'Martian', 8, 7),
('Pepe', 'La Pew', 8, 7);
