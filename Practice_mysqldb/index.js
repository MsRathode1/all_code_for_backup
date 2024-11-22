const connectDB = require('./config')
const express = require("express")
const app = express()
const db = connectDB()

app.use(express.json())
app.get("/", async (req, res) => {
    db.query('select * from employeedetails', (err, result) => {
        if (!err) {
            res.send(result)
        }
    })
})

app.post('/add', (req, res) => {
    // This for on data at a time
    // const data = {
    //     FullName: "John Snow",
    //     ManagerId: "321",
    //     DateOfJoining: "2019/01/31",
    //     City: "Toronto"
    // }
    // db.query("insert into employeedetails set ?", data, (err, result) => {
    //     if (!err) {
    //         res.send(result)
    //     } else {
    //         console.log(err);
    //     }
    // })

    // This for many data a time
    const data = [
        {
            FullName: "John Snow",
            ManagerId: "321",
            DateOfJoining: "2019/01/31",
            City: "Toronto"
        },
        {
            FullName: "Jane Doe",
            ManagerId: "123",
            DateOfJoining: "2020/02/28",
            City: "New York"
        },
        {
            FullName: "Alice Smith",
            ManagerId: "456",
            DateOfJoining: "2021/03/15",
            City: "Los Angeles"
        },
        {
            FullName: "Bob Johnson",
            ManagerId: "789",
            DateOfJoining: "2022/04/20",
            City: "Chicago"
        },
        {
            FullName: "Emily Brown",
            ManagerId: "987",
            DateOfJoining: "2023/05/25",
            City: "San Francisco"
        },
    ];

    const values = data.map(el => [el.FullName, el.ManagerId, el.DateOfJoining, el.City])
    db.query("INSERT INTO employeedetails (FullName, ManagerId, DateOfJoining, City) VALUES ?", [values], (err, result) => {
        if (!err) {
            res.send(result)
        } else {
            console.log(err);
        }
    })
})

app.patch("/update", (req, res) => {
    const data = {
        FullName: "ram",
        ManagerId: "2287",
        DateOfJoining: "2023/05/25",
        City: "Ayodhya"
    }
    db.query('update employeedetails set FullName = ?, ManagerId = ?,DateOfJoining=?,City=? where EmpId=7 ', [data.FullName, data.ManagerId, data.DateOfJoining, data.City], (err, result) => {
        if (!err) {
            res.send(result)
        } else {
            console.log(err);
        }
    })
})

app.delete("/delete", (req, res) => {
    db.query('delete from employeedetails where EmpId=10', (err, result) => {
        if (!err) {
            res.send(result)
        } else {
            console.log(err);
        }
    })
})

app.get("/ace", (req, res) => {
    db.query("select * from employeedetails order by EmpId asc", (err, result) => {
        if (!err) {
            res.send(result)
        } else {
            console.log(err);
        }
    })
})

app.post('/addSalary', (req, res) => {
    const data = [
        ['ProjectA', 50000, 'VariableA'],
        ['ProjectB', 60000, 'VariableB'],
        ['ProjectC', 55000, 'VariableC'],
        ['ProjectD', 65000, 'VariableD'],
        ['ProjectE', 70000, 'VariableE'],
    ];

    db.query('insert into employeesalary (Project, Salary, Variable) values ?', [data], (err, result) => {
        if (!err) {
            res.send(result)
        } else {
            console.log(err);
        }
    })
})

// 1. Write an SQL query to fetch the EmpId and FullName of all the employees working under the Manager with id – ‘986’.
// db.query("select EmpId,FullName from employeedetails where ManagerId=789",(err,result) => {
//   if (!err) {
//     console.log(result);
//   } else {
//     console.log(err);
//   }
// })


// 2. Write an SQL query to fetch the different projects available from the EmployeeSalary table.
// db.query('select Project from employeesalary', (err, result) => {
//     if (!err) {
//         console.log(result);
//     } else {
//         console.log(err);
//     }
// })


// 3. Write an SQL query to fetch the count of employees working in project ‘P1’.
// db.query("select count(*) from employeesalary where Project='ProjectC'", (err, result) => {
//     if (!err) {
//         console.log(result);
//     } else {
//         console.log(err);
//     }
// })

// 4. Write an SQL query to find the maximum, minimum, and average salary of the employees.
// db.query('select max(Salary),min(Salary),avg(Salary) from employeesalary', (err, result) => {
//     if (!err) {
//         console.log(result);
//     } else {
//         console.log(err);
//     }
// })


// 5. Write an SQL query to find the employee id whose salary lies in the range of 9000 and 15000.
// db.query('select EmpId from employeesalary where employeesalary.Salary between 50000 and 90000 ', (err, result) => {
//     if (!err) {
//         console.log(result);
//     } else {
//         console.log(err);
//     }
// })


// 6. Write an SQL query to fetch those employees who live in Toronto and work under the manager with ManagerId – 321.
// db.query('select * from employeedetails where employeedetails.City="Toronto" and employeedetails.ManagerId=321', (err, result) => {
//     if (!err) {
//         console.log(result);
//     } else {
//         console.log(err);
//     }
// })


// 8. Write an SQL query to fetch all those employees who work on Projects other than P1.
// db.query("select * from employeesalary where employeesalary.Project not in ('ProjectA')", (err, result) => {
//     if (!err) {
//         console.log(result);
//     } else {
//         console.log(err);
//     }
// })


// 9. Write an SQL query to fetch the employees whose name begins with any two characters, followed by a text “hn” and ends with any sequence of characters
// db.query("select * from employeedetails where employeedetails.Fullname like '__hn%'", (err, result) => {
//     if (!err) {
//         console.log(result);
//     } else {
//         console.log(err);
//     }
// })

// 10. Write an SQL query to fetch all the EmpIds which are present in either of the tables – ‘EmployeeDetails’ and ‘EmployeeSalary’.
// db.query("select EmpId from employeedetails union select EmpId from employeesalary", (err, result) => {
//     if (!err) {
//         console.log(result);
//     } else {
//         console.log(err);
//     }
// })



app.listen(5000, () => {
    console.log("connecting to 5000!!");
})
