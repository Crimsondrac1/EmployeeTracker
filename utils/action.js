const db = require("../config/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const c = require("ansi-colors");

addDept = () => {
  console.log(
    c.green(".__..__ .__   .__ .___.__ .__..__ .___..  ..___.  ..___.")
  );
  console.log(
    c.green("[__]|  \\|  \\  |  \\[__ [__)[__][__)  |  |\\/|[__ |\\ |  |")
  );
  console.log(
    c.green("|  ||__/|__/  |__/[___|   |  ||  \\  |  |  |[___| \\|  |")
  );
  console.log(
    c.green("________________________________________________________")
  );

  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "Please enter the name of the new department.",
        validate: (addDept) => {
          if (addDept) {
            return true;
          } else {
            console.log("Please enter a department");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO dept (dName)
                        VALUES (?)`;
      db.query(sql, answer.addDept, (err, result) => {
        if (err) throw err;
        console.log(c.green("Added new department, " + answer.addDept + "."));

        viewDept();
      });
    });
};

// Delete department
delDept = () => {
  console.log(c.red(".__ .___.   .___.___..___  .__ .___.__ .___."));
  console.log(c.red("|  \\[__ |   [__   |  [__   |  \\[__ [__)  |"));
  console.log(c.red("|__/[___|___[___  |  [___  |__/[___|     |"));
  console.log(c.red("__________________________________________"));

  const deptSql = `SELECT * FROM dept`;

  db.query(deptSql, (err, data) => {
    if (err) throw err;

    const dept = data.map(({ dName, id }) => ({ name: dName, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: "Please select a department to delete.",
          choices: dept,
        },
      ])
      .then((deptChoice) => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM dept WHERE id = ?`;

        db.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log(c.green("Successfully deleted department."));

          viewDept();
        });
      });
  });
};

module.exports = { addDept, delDept };
