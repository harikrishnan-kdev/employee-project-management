-- Database creation
-- CREATE DATABASE employee_project_db;
-- \c employee_project_db;

-- Employee Table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    department VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active'
);

-- Project Table
CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    status VARCHAR(50) DEFAULT 'Active'
);

-- Project Members (Junction Table)
CREATE TABLE project_members (
    "projectId" INT NOT NULL,
    "employeeId" INT NOT NULL,
    PRIMARY KEY ("projectId", "employeeId"),
    CONSTRAINT fk_project
        FOREIGN KEY("projectId") 
        REFERENCES project(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_employee
        FOREIGN KEY("employeeId") 
        REFERENCES employee(id)
        ON DELETE CASCADE
);
