const db = require('./config/connection');
const mysql = require('mysql2');
const inquirer = require('inquirer'); 
const cTable = require('console.table');
const c = require('ansi-colors');

require('dotenv').config()

  db.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + db.threadId);
    onConnect();
  });

  onConnect = () => {
    console.log(c.yellow("_____________________________________________________________________________________"))
    console.log(c.yellow(" ______                 _                         _______             _"))
    console.log(c.yellow("|  ____|               | |                       |__   __|           | |"))
    console.log(c.yellow("| |__   _ __ ___  _ __ | | ___  _   _  ___  ___     | |_ __ __ _  ___| | _____ _ __"))
    console.log(c.yellow("|  __| | '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\    | | '__/ _` |/ __| |/ / _ \\ '__|"))
    console.log(c.yellow("| |____| | | | | | |_) | | (_) | |_| |  __/  __/    | | | | (_| | (__|   <  __/ |"))
    console.log(c.yellow("|______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|    |_|_|  \\__,_|\\___|_|\\_\\___|_|"))
    console.log(c.yellow("                 | |             __/ |"))
    console.log(c.yellow("                 |_|            |___/                                        v1.0"))
    console.log(c.yellow("_____________________________________________________________________________________"))
    mainMenu();
  };

  const mainMenu = () => {
    inquirer.prompt ([
      {
        type: 'list',
        name: 'choices', 
        message: 'Please select an option',
        choices: [ (c.green('Add department')),
                  (c.green('Add role')), 
                  (c.green('Add employee')),
                  new inquirer.Separator(),
                  (c.red('Delete department')),
                  (c.red('Delete role')),
                  (c.red('Delete employee')),
                  new inquirer.Separator(),
                  (c.yellow('Update employee role')),
                  (c.yellow('Update employee manager')),
                  new inquirer.Separator(),
                  (c.cyan('View all departments')), 
                  (c.cyan('View all roles')), 
                  (c.cyan('View all employees')),
                  (c.cyan('View employees by department')),
                  (c.cyan('View budgets by department')),
                  new inquirer.Separator(),
                  (c.magenta.bold('Exit')),
                  new inquirer.Separator()]
      }
    ])
      .then((answers) => {
        const { choices } = answers; 
  
        if (choices === (c.green('Add department'))) {
          addDept();
        }
  
        if (choices === (c.green('Add role'))) {
          addRole();
        }
  
        if (choices === (c.green('Add employee'))) {
          addEmp();
        }

        if (choices === (c.red('Delete department'))) {
          delDept();
        }
  
        if (choices === (c.red('Delete role'))) {
          delRole();
        }
  
        if (choices === (c.red('Delete employee'))) {
          delEmp();
        }

        if (choices === (c.yellow('Update employee role'))) {
          updEmp();
        }
  
        if (choices === (c.yellow('Update employee manager'))) {
          updManager();
        }
  
        if (choices === (c.cyan('View all departments'))) {
          viewDept();
        }
  
        if (choices === (c.cyan('View all roles'))) {
          viewRoles();
        }
  
        if (choices === (c.cyan('View all employees'))) {
          viewEmp();
        }  

        if (choices === (c.cyan('View employees by department'))) {
          viewByDept();
        }
  
        if (choices === (c.cyan('View budgets by department'))) {
          viewBudget();
        }
  
        if (choices === (c.magenta.bold('Exit'))) {
          db.end()
      };
    });
  };

    // Add department
    addDept = () => {
      console.log(c.green('.__..__ .__   .__ .___.__ .__..__ .___..  ..___.  ..___.'));
      console.log(c.green('[__]|  \\|  \\  |  \\[__ [__)[__][__)  |  |\\/|[__ |\\ |  |'));
      console.log(c.green('|  ||__/|__/  |__/[___|   |  ||  \\  |  |  |[___| \\|  |'));
      console.log(c.green('________________________________________________________'));
  
      inquirer.prompt([
        {
          type: 'input', 
          name: 'addDept',
          message: 'Please enter the name of the new department.',
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
            console.log(c.green('Added new department, ' + answer.addDept + '.')); 
    
            viewDept();
        })
      
      });
    };
    
    // Add role 
    addRole = () => {
      console.log(c.green('.__..__ .__   .__ .__..   .___'));
      console.log(c.green('[__]|  \\|  \\  [__)|  ||   [__'));
      console.log(c.green('|  ||__/|__/  |  \\|__||___[___'));
      console.log(c.green('_____________________________'));
  
      inquirer.prompt([
        {
          type: 'input', 
          name: 'role',
          message: 'Please enter a name for the new role',
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
          message: 'Please enter a base salary for this role.',
          validate(answer) {
            salaryRegex = /^[$]?\d[\d,]*$/
            if(!salaryRegex.test(answer))  {
              console.log('This field accepts only numbers.');
              return false
          } return true    
        }
      }
      ])
        .then(answer => {
          const params = [answer.role, answer.salary];
           
          const roleSql = `SELECT dName, id FROM dept`; 
    
          db.query(roleSql, (err, data) => {
            if (err) throw err; 
        
            const dept = data.map(({ dName, id }) => ({ name: dName, value: id }));
    
            inquirer.prompt([
            {
              type: 'list', 
              name: 'dept',
              message: 'Please assign the role to a department.',
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
                  console.log(c.green('Added new role, ' + answer.role + '.')); 
    
                  viewRoles();
           });
         });
       });
     });
    };
    
    // Add employee 
    addEmp = () => {
      console.log(c.green('.__..__ .__   .___.  ..__ .   .__..   ,.___.___'));
      console.log(c.green('[__]|  \\|  \\  [__ |\\/|[__)|   |  | \\./ [__ [__ '));
      console.log(c.green('|  ||__/|__/  [___|  ||   |___|__|  |  [___[___'));
      console.log(c.green('_______________________________________________'));
  
      inquirer.prompt([
        {
          type: 'input',
          name: 'fName',
          message: 'Please enter the employee\'s first name.',
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
          name: 'lName',
          message: 'Please enter the employee\'s last name.',
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
        const params = [answer.fName, answer.lName]

        const roleSql = `SELECT id, title FROM roles`;
      
        db.query(roleSql, (err, data) => {
          if (err) throw err; 
          
          const roles = data.map(({ id, title }) => ({ name: title, value: id }));
    
          inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: 'Please assign a role to the new employee.',
                  choices: roles
                }
              ])
                .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role);
    
                  const managerSql = `SELECT * FROM employee`;
    
                  db.query(managerSql, (err, data) => {
                    if (err) throw err;
    
                    const managers = data.map(({ id, fName, lName }) => ({ name: fName + ' '+ lName, value: id }));
    
                    inquirer.prompt([
                      {
                        type: 'list',
                        name: 'manager',
                        message: 'Please select a manager for the employee.',
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
                        console.log(c.green(answer.fName + ' ' + answer.lName + ' has been added!'))
    
                        viewEmp();
                  });
                });
              });
            });
         });
      });
    };

      // Delete department
  delDept = () => {
    console.log(c.red('.__ .___.   .___.___..___  .__ .___.__ .___.'));
    console.log(c.red('|  \\[__ |   [__   |  [__   |  \\[__ [__)  |'));
    console.log(c.red('|__/[___|___[___  |  [___  |__/[___|     |'));
    console.log(c.red('__________________________________________'));

    const deptSql = `SELECT * FROM dept`; 
  
    db.query(deptSql, (err, data) => {
      if (err) throw err; 
  
      const dept = data.map(({ dName, id }) => ({ name: dName, value: id }));
  
      inquirer.prompt([
        {
          type: 'list', 
          name: 'dept',
          message: 'Please select a department to delete.',
          choices: dept
        }
      ])
        .then(deptChoice => {
          const dept = deptChoice.dept;
          const sql = `DELETE FROM dept WHERE id = ?`;
  
          db.query(sql, dept, (err, result) => {
            if (err) throw err;
            console.log(c.green('Successfully deleted department.')); 
  
          viewDept();
        });
      });
    });
  };
  
  // Delete role
  delRole = () => {
    console.log(c.red('.__ .___.   .___.___..___  .__ .__..   .___'));
    console.log(c.red('|  \\[__ |   [__   |  [__   [__)|  ||   [__'));
    console.log(c.red('|__/[___|___[___  |  [___  |  \\|__||___[___'));
    console.log(c.red('___________________________________________'));
    
    const roleSql = `SELECT * FROM roles`; 
  
    db.query(roleSql, (err, data) => {
      if (err) throw err; 
  
      const role = data.map(({ title, id }) => ({ name: title, value: id }));
  
      inquirer.prompt([
        {
          type: 'list', 
          name: 'role',
          message: 'Please select a role to delete',
          choices: role
        }
      ])
        .then(roleChoice => {
          const role = roleChoice.role;
          const sql = `DELETE FROM roles WHERE id = ?`;
  
          db.query(sql, role, (err, result) => {
            if (err) throw err;
            console.log(c.green('Successfully deleted role.')); 
  
            viewRoles();
        });
      });
    });
  };
  
  // Delete employee
  delEmp = () => {
    console.log(c.red('.__ .___.   .___.___..___  .___.  ..__ '));
    console.log(c.red('|  \\[__ |   [__   |  [__   [__ |\\/|[__)'));
    console.log(c.red('|__/[___|___[___  |  [___  [___|  ||'));
    console.log(c.red('_______________________________________'));
 
    const employeeSql = `SELECT * FROM employee`;
  
    db.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, fName, lName }) => ({ value: id, name: fName + ' '+ lName }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Please select an employee to delete.',
          choices: employees
        }
      ])
        .then(empChoice => {
          const employee = empChoice.name;
          
          const sql = `DELETE FROM employee WHERE id = ?`;
  
          db.query(sql, employee, (err, result) => {
            if (err) throw err;
            console.log(c.green('Successfully deleted employee.'));
          
            viewEmp();
      });
    });
   });
  };

    // Update employee 
  updEmp = () => {
    console.log(c.yellow('.  ..__ .__ .__..___..___  .___.  ..__ .   .__..   ,.___.___'));
    console.log(c.yellow('|  |[__)|  \\[__]  |  [__   [__ |\\/|[__)|   |  | \\./ [__ [__'));
    console.log(c.yellow('|__||   |__/|  |  |  [___  [___|  ||   |___|__|  |  [___[___'));
    console.log(c.yellow('____________________________________________________________'));

    const employeeSql = `SELECT * FROM employee`;
  
    db.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, fName, lName }) => ({ name: fName + ' ' + lName, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Please select an employee to update.',
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
                  message: 'Please select a new role.',
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee
  
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                  console.log(c.green('Employee updated'));
                
                  viewEmp();
            });
          });
        });
      });
    });
  };
  
  // Update an employee's manager 
  updManager = () => {
    console.log(c.yellow('.  ..__ .__ .__..___..___  .  ..__..  ..__..__ .___.__ '));
    console.log(c.yellow('|  |[__)|  \\[__]  |  [__   |\\/|[__]|\\ |[__][ __[__ [__)'));
    console.log(c.yellow('|__||   |__/|  |  |  [___  |  ||  || \\||  |[_./[___|  \\'));
    console.log(c.yellow('_______________________________________________________'));

    const employeeSql = `SELECT * FROM employee`;
  
    db.query(employeeSql, (err, data) => {
      if (err) throw err; 
  
    const employees = data.map(({ id, fName, lName }) => ({ name: fName + ' '+ lName, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: 'Please select an employee to update',
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
  
            const managers = data.map(({ id, fName, lName }) => ({ name: fName + ' ' + lName, value: id }));
              
                inquirer.prompt([
                  {
                    type: 'list',
                    name: 'manager',
                    message: 'Please select a new manager.',
                    choices: managers
                  }
                ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager); 
                      
                      let employee = params[0]
                      params[0] = manager
                      params[1] = employee 
                      
                      const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
  
                      db.query(sql, params, (err, result) => {
                        if (err) throw err;
                      console.log(c.green('Employee updated'));
                    
                      viewEmp();
            });
          });
        });
      });
    });
  };
  
// View departments 
viewDept = () => {
  console.log(c.cyan('.__ .___.__ .__..__ .___..  ..___.  ..___. __.'));
  console.log(c.cyan('|  \\[__ [__)[__][__)  |  |\\/|[__ |\\ |  |  (__'));
  console.log(c.cyan('|__/[___|   |  ||  \\  |  |  |[___| \\|  |  .__)'));
  console.log(c.cyan('______________________________________________'));
  const sql = `SELECT id, dName AS department FROM dept`; 

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    mainMenu();
  });
};
  
  // View roles 
  viewRoles = () => {
    console.log(c.cyan('.__ .__..   .___ __.'));
    console.log(c.cyan('[__)|  ||   [__ (__ '));
    console.log(c.cyan('|  \\|__||___[___.__)'));
    console.log(c.cyan('____________________'));
  
    const sql = `SELECT r.id, r.title, r.salary, d.dName AS department
                 FROM roles r
                 INNER JOIN dept d ON r.dept_id = d.id
                 ORDER BY r.id`;
    
    db.query(sql, (err, rows) => {
      if (err) throw err; 
      console.table(rows); 
      mainMenu();
    })
  };
  
  // View employees 
    viewEmp = () => {
      console.log(c.cyan('.___.  ..__ .   .__..   ,.___.___ __.'));
      console.log(c.cyan('[__ |\\/|[__)|   |  | \\./ [__ [__ (__'));
      console.log(c.cyan('[___|  ||   |___|__|  |  [___[___.__)'));
      console.log(c.cyan('_____________________________________'));
    
    const sql = `SELECT e.id, e.fName, e.lName, r.title, d.dName AS department, r.salary, 
                 CONCAT (s.fName, ' ', s.lName) AS manager
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
    
  // View employee by department
  viewByDept = () => {
    console.log(c.cyan('.___.  ..__ .   .__..   ,.___.___  .__ .   ,  .__ .___.__ .___.'));
    console.log(c.cyan('[__ |\\/|[__)|   |  | \\./ [__ [__   [__) \\./   |  \\[__ [__)  |'));
    console.log(c.cyan('[___|  ||   |___|__|  |  [___[___  [__)  |    |__/[___|     |'));
    console.log(c.cyan('_____________________________________________________________'));

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
  

  // View department budget 
  viewBudget = () => {
    console.log(c.cyan('.__ .___.__ .___.  .__ .  ..__ .__ .___.___. __.'));
    console.log(c.cyan('|  \\[__ [__)  |    [__)|  ||  \\[ __[__   |  (__'));
    console.log(c.cyan('|__/[___|     |    [__)|__||__/[_./[___  |  .__)'));
    console.log(c.cyan('________________________________________________'));

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