const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
// const {mysqlLogin, userPrompt} = require('./inquirer-questions.js')
let connection;
inquirer.prompt([
    {
        name: "mysqlUser",
        type: "input",
        message: "Enter mysql username"
    },
    {
        name: "mysqlPass",
        type: "password",
        message: "Enter mysql password"
    }
]).then((res) => {
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: res.mysqlUser,
        password: res.mysqlPass,
        database: "employees_db"
    });

    connection.connect((err) => {
        if (err) throw err;
        console.log('Now connected to mysql');
        askQuestions();
    });
});

function askQuestions() {
    let choices = [
        "Add a department",
        "Add a role",
        "Add an employee",
        "View the departments",
        "View available roles",
        "View employees",
        "Update employee roles",
        "Exit"
    ]
    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "What would you like to do? ",
            choices: choices
        }
    ])
        .then((res) => {
            switch (res.option) {
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "View the departments":
                    viewDepartments();
                    break;
                case "View available roles":
                    viewRoles();
                    break;
                case "View employees":
                    viewEmployees();
                    break;
                case "Update employee roles":
                    updateEmployeeRole();
                    break;
                default:
                    console.log('Bye!');
                    connection.end();
                    break;
            }
        });
}

function viewDepartments() {
    connection.query('SELECT * FROM departments;', (err, res) => {
        if (err) throw err;
        console.table(res);
        askAgain();
    });
}

function viewEmployees() {
    connection.query(
        "SELECT * from employees",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            askAgain();
        });
}

function viewRoles() {
    connection.query("SELECT * from roles", (err, res) => {
        if (err) throw err;
        console.table(res);
        askAgain();
    });
}

function addDepartment() {
    inquirer
        .prompt({
            name: "departmentName",
            type: "input",
            message: "Enter department name: "
        })
        .then((res) => {
            connection.query("INSERT INTO departments (name) VALUES (?);", res.departmentName, (err, result) => {
                if (err) throw err;
                console.log(result);
                askAgain();
            });
        });
}

function addEmployee() {
    connection.query("SELECT * FROM roles", (err, response) => {
        if (err) throw err;
        let titles = response.map((role) => {
            return role.title;
        });
        let roleIds = response.map(role => { return role.id })
        connection.query("SELECT * FROM EMPLOYEES", (err, response) => {
            if (err) throw err;
            let managers = response.map(employee => { return employee.first_name });
            let managerIds = response.map(employee => { return employee.id });
            inquirer
                .prompt([
                    {
                        name: "first_name",
                        type: "input",
                        message: "Enter employee first name: "
                    },
                    {
                        name: "last_name",
                        type: "input",
                        message: "Enter employee last name: "
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Choose role: ",
                        choices: titles
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Enter the employee's manager's ID: ",
                        choices: managers.concat(["null"])
                    }
                ])
                .then((res) => {
                    
                    //find the index of the title in the title array
                    let role_index = titles.findIndex((ans) => {
                        return ans === res.role; 
                    });
                    // save the value of the role id from the roleIds index
                    let role_id = roleIds[role_index];

                    //find the index of the correct manager in the managers array
                    let manager_index = managers.findIndex((ans) => {
                        return ans === res.manager;
                    });
                    //set manager_id to the value of the manager id from the managerIds array 
                    let manager_id = managerIds[manager_index];

                    // create employee object
                    let employee = {
                        first_name: res.first_name,
                        last_name: res.last_name,
                        role_id: role_id,
                        manager_id: manager_id
                    }

                    // insert the employee into employee database
                    connection.query(
                        "INSERT INTO employees SET ?;",
                        employee, (err, result) => {
                            if (err) throw err;
                            console.log(result);
                            askAgain();
                        });
                });
        })

    });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "Enter the role name: "
            },
            {
                name: "salary",
                type: "input",
                message: "Enter the role salary: "
            },
            {
                name: "department_id",
                type: "input",
                message: "Enter department id: "
            }
        ])
        .then((res) => {
            connection.query("INSERT INTO roles SET ?;", res, (err, result) => {
                if (err) throw err;
                console.log(result);
                askAgain();
            });
        });
}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "employeeId",
            message: "Enter employee ID: "
        },
        {
            type: "input",
            name: "newRoleId",
            message: "Enter new role ID: "
        }
    ]).then((res) => {
        connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [res.newRoleId, res.employeeId], (err, result) => {
            if (err) throw err;
            console.log(result);
            askAgain();
        });
    });
}

function askAgain() {
    console.log('\n\n')
    inquirer.prompt(
        {
            name: "continue",
            type: "confirm",
            message: "Continue?",
            default: true
        }
    ).then((res) => {
        if (res.continue) askQuestions()
        else {
            console.log("Bye!");
            connection.end();
        }

    })
}
