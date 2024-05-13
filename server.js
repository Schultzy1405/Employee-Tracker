const express = require('express')
const inquirer = require('inquirer')
const { Pool } = require('pg')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 3001;

const pool = new Pool(
    {
    user: 'postgres',
    password: 'lyla21', 
    host: 'localhost',
    database: 'departments_db'
  },
  console.log(`Connected to the departments_db database!`)
);

pool.connect()

console.log('Before inquirer prompt');

function promptUser() {
    inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            {
                name: 'View all departments',
                value: 'VIEW_ALL_DEPARTMENTS'
            },{
                name: 'View all roles',
                value: 'VIEW_ALL_ROLES'
            },{
                name: 'View all employees',
                value: 'VIEW_ALL_EMPLOYEES'
            },{
                name: 'Add a department',
                value: 'ADD_DEPARTMENT'
            },{
                name: 'Add a role',
                value: 'ADD_ROLE'
            },{
                name: 'Add an employee',
                value: 'ADD_EMPLOYEE'
            },{
                name: 'Update an employee',
                value: 'UPDATE_EMPLOYEE'
            },{
                name: 'Exit',
                value: 'EXIT'
            },
        ]
    },
]).then((res)=>{
    let choice = res.action;
        switch (choice) {
            case 'ADD_DEPARTMENT':
                insertDepartment(res)
                break;
            case 'ADD_ROLE':
                insertRole();
                break;
            case 'ADD_EMPLOYEE':
                insertEmployee()
                break;
            case 'VIEW_ALL_EMPLOYEES':
                viewAllEmployees()
                break;
            case 'VIEW_ALL_ROLES':
                viewAllRoles()
                break;
            case 'VIEW_ALL_DEPARTMENTS':
                viewAllDepartments()
                break;
            case 'UPDATE_EMPLOYEE':
                updateEmployeeRole()
                break;
            case 'EXIT':
                exitApplication()
                break;
            default:
            }
})
    console.log('After inquirer prompt');
}
promptUser()

function insertDepartment() {
    const query = `INSERT INTO department (name) VALUES ($1);`;
    inquirer.prompt([
        {   
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?'
        }
        ]).then((res)=>{
            pool.query(query, [res.departmentName], (error, result) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(result, 'Department Succesfully Added!')
                    promptUser()
                }
            });
        }) 
};

function insertRole() {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';

    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: 'What department does the new role belong to?',
            choices: ['Engineering', 'Finance', 'Legal', 'Sales', 'Service']
        }
    ]).then((answers) => {
        let depId;
        switch (answers.roleDepartment) {
            case 'Engineering':
                depId = 1;
                break;
            case 'Finance':
                depId = 2;
                break;
            case 'Legal':
                depId = 3;
                break;
            case 'Sales':
                depId = 4;
                break;
            case 'Service':
                depId = 5;
                break;
            default:
        }

        pool.query(query, [answers.roleName, answers.roleSalary, depId], (error, result) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Role Successfully Added!');
                promptUser()
            }
        });
    });
}

function insertEmployee(){
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        inquirer.prompt([
            {   
                type: 'input',
                name: 'employeeFirstName',
                message: 'What is the first name of the employee?'
            },
            {
                type: 'input',
                name: 'employeeLastName',
                message: 'What is the last name of the employee?'
            },
            {
                type: 'list',
                name: 'employeeRole',
                message: 'What is the employees role?',
                choices: ['Software Engineer','Salesman','Human Resources','Accountant','Janitor']
            },
            {
                type: 'list',
                name: 'employeeManager',
                message: 'Who is the manager of the employee?',
                choices: ['John Doe','Jane Doe','Jim Doe','Jack Doe','Joel Doe']
            },
            ]).then((answers) => {
                let empRoleId;
                let empManagerId;
                switch (answers.employeeRole) {
                    case 'Software Engineer':
                        empRoleId = 1;
                        break;
                    case 'Salesman':
                        empRoleId = 2;
                        break;
                    case 'Human Resources':
                        empRoleId = 3;
                        break;
                    case 'Accountant':
                        empRoleId = 4;
                        break;
                    case 'Janitor':
                        empRoleId = 5;
                        break;
                    default:
                }
                switch (answers.employeeManager) {
                    case 'John Doe':
                        empManagerId = 1;
                        break;
                    case 'Jane Doe':
                        empManagerId = 2;
                        break;
                    case 'Jim Doe':
                        empManagerId = 3;
                        break;
                    case 'Jack Doe':
                        empManagerId = 4;
                        break;
                    case 'Joel Doe':
                        empManagerId = 5;
                        break;
                    default:
                }

                pool.query(query, [answers.employeeFirstName, answers.employeeLastName, empRoleId, empManagerId], (error, result) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(result, 'Employee Succesfully Added!')
                        promptUser()
                    }
                });
            }) 
    };

function viewAllEmployees() {
    const query = 'SELECT e.id, e.first_name, e.last_name, r.title AS role, r.salary, d.name AS department, e.manager_id FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id;'
        pool.query(query, (error, result) => {
            if (error) {
                console.error('Error executing query:', error);
            } else {
                console.table(result.rows);
                promptUser()
            }
        });
}


function viewAllRoles() {
    const query = `SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id;`
        pool.query(query, (error,result) => {
            if(error) {
                console.error(error)
            } else {
                console.table(result.rows)
                promptUser()
            }
    })
}

function viewAllDepartments() {
    const query = `SELECT * FROM department;`
    pool.query(query, (error, result) => {
        if(error) {
            console.error(error)
        } else {
            console.table(result.rows)
            promptUser()
        }
    })
}

function updateEmployeeRole() {
    inquirer.prompt([
        {   
            type: 'list',
            name: 'selectEmployee',
            message: 'Which employee do you want to update?',
            choices: ['John Doe','Jane Doe','Jim Doe','Jack Doe','Joel Doe']
        },
        {
            type: 'list',
            name: 'selectEmployeeRole',
            message: 'Which role should this employee change to?',
            choices: ['Software Engineer','Salesman','Human Resources','Accountant','Janitor']
        }
]).then((res) => {
    const employees = {
        'John Doe': {employeeId: 1 },
        'Jane Doe': {employeeId: 2 },
        'Jim Doe': {employeeId: 3 },
        'Jack Doe': {employeeId: 4 },
        'Joel Doe': {employeeId: 5 }
    };
    const employeeRoles = {
        'Software Engineer': { roleId: 1},
        'Salesman': { roleId: 2},
        'Human Resources': { roleId: 3},
        'Accountant': { roleId: 4},
        'Janitor': { roleId: 5}
    };
    const chosenRole = employeeRoles[res.selectEmployeeRole]
    const selectedEmployee = employees[res.selectEmployee]
    if (selectedEmployee) {
        const {roleId} = chosenRole
        const {employeeId} = selectedEmployee;
        const query = `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`;

        pool.query(query, (error, result) => {
            if (error) {
                console.error(error);
            } else {
                console.log(result, 'You Updated the Selected Employee!');
                promptUser()
            }
        });
    } else {
        console.log('Employee not found.');
    }
});
}

function exitApplication() {
    console.log('Exiting the application...');
    process.exit();
}

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
})