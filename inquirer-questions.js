let loginQuestions = [
    {
        type: "input",
        name: "username",
        message: "Enter your mysql username: "
    },
    {
        type: "password",
        name: "password",
        message: "Enter your mysql password: "
    }
];

let questions = [
    {
        type: "list",
        name: "tableOption",
        message: "Select a table: ",
        choices: ["Departments", "Roles", "Employees"]
    },
    {
        type: "list",
        name: "roleOperations",
        message: "Select operation: ",
        choices: ["Create", "Read", "Update"],
        when: (answers) => {
            return answers.tableOption === "Roles";
        }
    },
    {
        type: "list",
        name: "operations",
        message: "Select operation: ",
        choices: ["Create", "Read"],
        when: (answers) => {
            return (answers.tableOption === "Departments" || answers.tableOption === "Employees");
        }
    },
    {
        type: "input",
        name: "employeeFirstName",
        message: "Enter employee first name: ",
        when: (answers) => { return answers.roleOperations === "Create" }
    },
    {
        type: "input",
        name: "employeeLastName",
        message: "Enter employee last name: ",
        when: (answers) => { return answers.roleOperations === "Create" }
    },
    {
        type: "input",
        name: "employeeRole",
        message: "Enter employee role: ",
        when: (answers) => { return answers.roleOperations === "Create" }
    },
];

module.exports = loginQuestions;
module.exports = questions;