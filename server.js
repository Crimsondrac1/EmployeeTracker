const connection = require('./config/connection');
const mysql = require('mysql2');
const inquirer = require('inquirer'); 
const cTable = require('console.table'); 

require('dotenv').config()

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: process.env.DB_USER,
      // Your MySQL password
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log('Connected to the Employee Tracker database.')
  );

  connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId);
    onConnect();
  });

  onConnect = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*        EMPLOYEE MANAGER         *")
    console.log("*                                 *")
    console.log("***********************************")
    mainMenu();
  };

  const mainMenu = () => {
    inquirer.prompt ([
      {
        type: 'list',
        name: 'choices', 
        message: 'What would you like to do?',
        choices: ['View all departments', 
                  'View all roles', 
                  'View all employees', 
                  'Add a department', 
                  'Add a role', 
                  'Add an employee', 
                  'Update an employee role',
                  'Update an employee manager',
                  "View employees by department",
                  'Delete a department',
                  'Delete a role',
                  'Delete an employee',
                  'View department budgets',
                  'Exit']
      }
    ])
      .then((answers) => {
        const { choices } = answers; 
  
        if (choices === "View all departments") {
          showDept();
        }
  
        if (choices === "View all roles") {
          showRoles();
        }
  
        if (choices === "View all employees") {
          showEmp();
        }
  
        if (choices === "Add a department") {
          addDept();
        }
  
        if (choices === "Add a role") {
          addRole();
        }
  
        if (choices === "Add an employee") {
          addEmp();
        }
  
        if (choices === "Update an employee role") {
          updateEmp();
        }
  
        if (choices === "Update an employee manager") {
          updateManager();
        }
  
        if (choices === "View employees by department") {
          byDept();
        }
  
        if (choices === "Delete a department") {
          deleteDept();
        }
  
        if (choices === "Delete a role") {
          deleteRole();
        }
  
        if (choices === "Delete an employee") {
          deleteEmp();
        }
  
        if (choices === "View department budgets") {
          viewBudget();
        }
  
        if (choices === "Exit") {
          db.end()
      };
    });
  };
  
// function to show all departments 
showDept = () => {
    console.log('Showing all departments...\n');
    const sql = `SELECT dept.id AS id, dept.dName AS department FROM dept`; 
  
    db.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      mainMenu();
    });
  };
  
  // function to show all roles 
  showRoles = () => {
    console.log('Showing all roles...\n');
  
    const sql = `SELECT r.id, r.title, r.salary, d.dName AS department
                 FROM roles r
                 INNER JOIN dept d ON r.dept_id = d.id`;
    
    db.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      mainMenu();
    })
  };
  
  // function to show all employees 
  showEmp = () => {
    console.log('Showing all employees...\n'); 
    const sql = `SELECT e.id, e.fName, e.lName, r.title, d.dName AS department, r.salary, 
                 CONCAT (s.fName, " ", s.lName) AS manager
                FROM employee e
                LEFT JOIN roles r ON e.role_id = r.id
                LEFT JOIN dept d ON r.dept_id = d.id
                LEFT JOIN employee s ON s.id = e.manager_id`;
  
    db.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
      mainMenu();
    });
  };
  
  // function to add a department 
  addDept = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'addDept',
        message: "What department do you want to add?",
        validate: addDept => {
          if (addDept) {
              return true;
          } else {
              console.log('Please enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO dept (dName)
                    VALUES (?)`;
        db.query(sql, answer.addDept, (err, result) => {
          if (err) throw err;
          console.log('Added ' + answer.addDept + " to departments!"); 
  
          showDept();
      });
    });
  };
  
  // function to add a role 
  addRole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'role',
        message: "What role do you want to add?",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log('Please enter a role');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        // validate: addSalary => {
        //   if (isNAN(addSalary)) {
        //       return true;
        //   } else {
        //       console.log('Please enter a salary');
        //       return false;
        //   }
        // }
      }
    ])
      .then(answer => {
        const params = [answer.role, answer.salary];
  
        // grab dept from department table
        const roleSql = `SELECT dName, id FROM dept`; 
  
        db.query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const dept = data.map(({ dName, id }) => ({ name: dName, value: id }));
  
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "What department is this role in?",
            choices: dept
          }
          ])
            .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);
  
              const sql = `INSERT INTO roles (title, salary, dept_id)
                          VALUES (?, ?, ?)`;
  
              db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.role + " to roles!"); 
  
                showRoles();
         });
       });
     });
   });
  };
  
  // function to add an employee 
  addEmp = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name?",
        validate: addFirst => {
          if (addFirst) {
              return true;
          } else {
              console.log('Please enter a first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLast => {
          if (addLast) {
              return true;
          } else {
              console.log('Please enter a last name');
              return false;
          }
        }
      }
    ])
      .then(answer => {
      const params = [answer.fistName, answer.lastName]
  
      // grab roles from roles table
      const roleSql = `SELECT id, title FROM roles`;
    
      db.query(roleSql, (err, data) => {
        if (err) throw err; 
        
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
                const managerSql = `SELECT * FROM employee`;
  
                db.query(managerSql, (err, data) => {
                  if (err) throw err;
  
                  const managers = data.map(({ id, fName, lName }) => ({ name: fName + " "+ lName, value: id }));
  
                  // console.log(managers);
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (fName, lName, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
  
                      db.query(sql, params, (err, result) => {
                      if (err) throw err;
                      console.log("Employee has been added!")
  
                      showEmp();
                });
              });
            });
          });
       });
    });
  };
  
  // function to update an employee 
  updateEmp = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    db.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, fName, lName }) => ({ name: fName + " "+ lName, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM roles`;
  
          db.query(roleSql, (err, data) => {
            if (err) throw err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
                  
  
                  // console.log(params)
  
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                  console.log("Employee has been updated!");
                
                  showEmployees();
            });
          });
        });
      });
    });
  };
  
  // function to update an employee 
  updateManager = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    db.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, fName, lName }) => ({ name: fName + " "+ lName, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          const params = []; 
          params.push(employee);
  
          const managerSql = `SELECT * FROM employee`;
  
            db.query(managerSql, (err, data) => {
              if (err) throw err; 
  
            const managers = data.map(({ id, fName, lName }) => ({ name: fName + " "+ lName, value: id }));
              
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                  }
                ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager); 
                      
                      let employee = params[0]
                      params[0] = manager
                      params[1] = employee 
                      
  
                      // console.log(params)
  
                      const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
  
                      db.query(sql, params, (err, result) => {
                        if (err) throw err;
                      console.log("Employee has been updated!");
                    
                      showEmployees();
            });
          });
        });
      });
    });
  };
  
  // function to view employee by department
  byDept = () => {
    console.log('Showing employee by departments...\n');
    const sql = `SELECT e.fName, 
                        e.lName, 
                        d.dName AS department
                 FROM employee e
                 LEFT JOIN roles r ON e.role_id = r.id 
                 LEFT JOIN dept d ON r.dept_id = d.id
                 ORDER BY department`;
  
    db.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      mainMenu();
    });          
  };
  
  // function to delete department
  deleteDept = () => {
    const deptSql = `SELECT * FROM dept`; 
  
    db.query(deptSql, (err, data) => {
      if (err) throw err; 
  
      const dept = data.map(({ dName, id }) => ({ name: dName, value: id }));
  
      inquirer.prompt([
        {
          type: 'list', 
          name: 'dept',
          message: "What department do you want to delete?",
          choices: dept
        }
      ])
        .then(deptChoice => {
          const dept = deptChoice.dept;
          const sql = `DELETE FROM dept WHERE id = ?`;
  
          db.query(sql, dept, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!"); 
  
          showDept();
        });
      });
    });
  };
  
  // function to delete role
  deleteRole = () => {
    const roleSql = `SELECT * FROM roles`; 
  
    db.query(roleSql, (err, data) => {
      if (err) throw err; 
  
      const role = data.map(({ title, id }) => ({ name: title, value: id }));
  
      inquirer.prompt([
        {
          type: 'list', 
          name: 'role',
          message: "What role do you want to delete?",
          choices: role
        }
      ])
        .then(roleChoice => {
          const role = roleChoice.role;
          const sql = `DELETE FROM roles WHERE id = ?`;
  
          db.query(sql, role, (err, result) => {
            if (err) throw err;
            console.log("Successfully deleted!"); 
  
            showRoles();
        });
      });
    });
  };
  
  // function to delete employees
  deleteEmp = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    db.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, fName, lName }) => ({ name: fName + " "+ lName, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to delete?",
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
  
          const sql = `DELETE FROM employee WHERE id = ?`;
  
          db.query(sql, employee, (err, result) => {
            if (err) throw err;
            console.log("Successfully Deleted!");
          
            showEmp();
      });
    });
   });
  };
  
  // view department budget 
  viewBudget = () => {
    console.log('Showing budget by department...\n');
  
    const sql = `SELECT r.dept_id AS id, 
                        d.dName AS department,
                        SUM(salary) AS budget
                 FROM roles r
                 JOIN dept d ON r.dept_id = d.id GROUP BY dept_id`;
    
    db.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows);
  
      mainMenu(); 
    });            
  };