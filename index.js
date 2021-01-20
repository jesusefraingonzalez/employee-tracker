const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
// const {mysqlLogin, userPrompt} = require('./inquirer-questions.js')

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employees_db"
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Now connected to mysql');
    askQuestions();
})


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
    connection.query("SELECT * from employees", (err, res) => {
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
                type: "input",
                name: "role_id",
                message: "Enter role id: "
            }
        ])
        .then((res) => {
            console.log(res);
            connection.query("INSERT INTO employees SET ?;", res, (err, result) => {
                if (err) throw err;
                console.log(result);
                askAgain();
            });
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
            if(err) throw err;
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
    ).then((res)=> {
        if (res.continue) askQuestions();
        console.log("Bye!");
        connection.end();
    })
}
