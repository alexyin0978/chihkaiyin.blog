---
title: "Nice to meet you MySQL - part 3"
subtitle: "Create company tables, practice how to query on data, and introduce Functions, Wildcards …etc"
date: "2023-12-03"
tag: "mysql,database"
index: 3
---

The articles are notes I took on the [SQL Tutorial - Full Database Course for Beginners](https://www.youtube.com/watch?v=HXV3zeQKqGY) course.

They break into four parts:

1. [First article](https://chihkaiyin.blog/nice-to-meet-you-mysql-p1) will introduce what is a database, SQL, keys and walk through the installation of MySQL on Mac.
2. [Second article](https://chihkaiyin.blog/nice-to-meet-you-mysql-p2) introduces the common SQL data types, basic query syntax …etc.
3. [In third article](https://chihkaiyin.blog/nice-to-meet-you-mysql-p3) we will create company tables, practice how to query on data, and introduce Functions, Wildcards …etc.
4. [The last article](https://chihkaiyin.blog/nice-to-meet-you-mysql-p4) we introduce ER Diagrams, a way to diagram the requirements into figures, then we learn how to transform the ER Diagrams into actual SQL table schemas.

Now, let’s get started.

---

### TL:DR

- Company Database Intro
- Create tables
- Data insertion
- More Basic Queries
- Functions
- Wildcards
- Union
- Join
- Nested Queries
- On Delete
- Triggers
- Appendix: how to solve slow SQL command
- References

## Company Database Intro

In this article, we are going to build a company database using the schema below:

![company_table.png](/post/nice-to-meet-you-mysql-p3/company_table.png)

## Create tables

First, we create the employee table:

```sql
// employee
CREATE TABLE employee (
	emp_id INT PRIMARY KEY,
	first_name VARCHAR(40),
	last_name VARCHAR(40),
	birth_date DATE,
	sex VARCHAR(1),
	salary INT,
	super_id INT,
	branch_id INT
);
```

For the foreign key `super_id` and `branch_id` , we will have to wait for the employee and branch table to be created, then we can mark them as foreign keys.

```sql
// branch
CREATE TABLE branch (
	branch_id INT PRIMARY KEY,
	branch_name VARCHAR(40),
	mgr_id INT,
	mgr_start_date DATE,
	// mark mgr_id as foreign key
	FOREIGN KEY(mgr_id) REFERENCES employee(emp_id) ON DELETE SET NULL 
);
```

After employee and branch tables are created, we can mark `super_id` and `branch_id` inside employee table as foreign keys:

```sql
// mark super_id as foreign key
ALTER TABLE employee
ADD FOREIGN KEY(super_id)
REFERENCES employee(emp_id)
ON DELETE SET NULL;

// mark branch_id as foreign key
ALTER TABLE employee
ADD FOREIGN KEY(branch_id)
REFERENCES branch(branch_id)
ON DELETE SET NULL;
```

Next, we create client, works_with and branch_supplier tables:

```sql
// client
CREATE TABLE client (
	client_id INT PRIMARY KEY,
	client_name VARCHAR(40),
	branch_id INT,
	FOREIGN KEY(branch_id) REFERENCES branch(branch_id) ON DELETE SET NULL
);
```

```sql
// works_with
CREATE TABLE works_with (
	emp_id INT,
	client_id INT,
	total_sales INT,
	PRIMARY KEY(emp_id, client_id), // mark 2 columns as primary key
	FOREIGN KEY(emp_id) REFERENCES employee(emp_id) ON DELETE CASCADE,
	FOREIGN KEY(client_id) REFERENCES client(client_id) ON DELETE CASCADE
);
```

```sql
// branch supplier
CREATE TABLE branch_supplier (
	branch_id INT,
	supplier_name VARCHAR(40),
	supply_type VARCHAR(40),
	PRIMARY KEY(branch_id, supplier_name),
	FOREIGN KEY(branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
);
```

## Data insertion

### Insert supervisor

We will insert employee who is supervisor first since they are gonna be used as foreign keys in both employee and branch table:

```sql
// David - Corporate

INSERT INTO employee 
VALUES(100, 'David', 'Wallace', '1996-11-17', 'M', 250000, NULL, NULL);
// branch_id will be NULL for now, since branch table has no data inserted yet

INSERT INTO branch 
VALUES(1, 'Corporate', 100, '2006-02-09');

// branch_id 1 is settled, update branch_id of David inside employee
UPDATE employee
SET branch_id = 1
WHERE emp_id = 100;
```

```sql
// Michael - Scranton

INSERT INTO employee 
VALUES(102, 'Michael', 'Scott', '1964-03-15', 'M', 75000, 100, NULL);
// branch_id will be NULL for now, since branch table has no branch_id 2 yet

INSERT INTO branch 
VALUES(2, 'Scranton', 102, '1992-04-06');

// branch_id 2 is settled, update branch_id of Michael inside employee
UPDATE employee
SET branch_id = 2
WHERE emp_id = 102;
```

```sql
// Josh - Stamford

INSERT INTO employee
VALUES(106, 'Josh', 'Porter', '1969-09-05', 'M', 78000, 100, NULL);
// branch_id will be NULL for now, since branch table has no branch_id 3 yet

INSERT INTO branch
VALUES(3, 'Stamford', 106, '1998-02-13');

// branch_id 3 is settled, update branch_id of Michael inside employee
UPDATE employee
SET branch_id = 3
WHERE emp_id = 106;
```

After that, insert the rest part of the data, I will skip this part, if you would like to check the code, I put it on [this repo](https://github.com/alexyin0978/mysql_course_fcc/blob/master/insert_data.sql).

## More Basic Queries

1. Find all employees
    
    ```sql
    SELECT * FROM employee;
    ```
    
2. ORDER BY - Find all employees order by salary
    
    ```sql
    SELECT * FROM employee
    ORDER BY salary;
    ```
    
3. Find all employees order by sex then name
    
    ```sql
    SELECT * FROM employee
    ORDER BY sex, first_name, last_name;
    ```
    
4. LIMIT - Find the first 5 employees in the table
    
    ```sql
    SELECT * FROM employee
    LIMIT 5;
    ```
    
5. Find the first and last name of all employees
    
    ```sql
    SELECT first_name, last_name FROM employee;
    ```
    
6. AS - Find the forename and surname of all employees
    
    ```sql
    SELECT first_name AS forename, last_name AS surname
    FROM employee;
    ```
    
7. DISTINCT - Find out all the different genders
    
    ```sql
    SELECT DISTINCT sex FROM employee;
    ```
    
    ![distinct.png](/post/nice-to-meet-you-mysql-p3/distinct.png)
    

## Functions

1. COUNT
    1. Find the number of employees (employee list length)
        
        ```sql
        SELECT COUNT(emp_id) FROM employee;
        ```
        
    2. Find the number of female employees born after 1970
        
        ```sql
        SELECT COUNT(emp_id) FROM employee
        WHERE sex = 'F' AND birth_date >= '1971-01-01';
        ```
        
2. AVG
    1. Find the average of all employee’s salaries
        
        ```sql
        SELECT AVG(salary) FROM employee;
        ```
        
3. SUM
    1. Find the sum of all employees salaries
        
        ```sql
        SELECT SUM(salary) FROM employee;
        ```
        
4. GROUP BY
    1. Find out how many males and females there are
        
        ```sql
        SELECT COUNT(sex), sex
        FROM employee
        GROUP BY sex;
        ```
        
    2. Find the total sales of each salesman 
        
        ```sql
        SELECT SUM(total_sales), emp_id FROM works_with
        GROUP BY emp_id;
        ```
        
    3. Find out total spend of each client
        
        ```sql
        SELECT SUM(total_sales), client_id FROM works_with
        GROUP BY client_id;
        ```
        

## Wildcards

Wildcards provide a way for us to grab data that matches specific pattern.

- `LIKE`
- `%` - any characters, including white spaces or null
- `_` - one character
- examples
    
    Find any client who are an LLC
    
    ```sql
    SELECT * FROM client
    WHERE client_name LIKE '%LLC'; 
    // xxxLLC
    ```
    
    Find any branch suppliers who are in the label business
    
    ```sql
    SELECT * FROM branch_supplier
    WHERE supplier_name LIKE '%Labels%';
    // XXXLabelsXXX
    ```
    
    Find any employee born in Oct.
    
    ```sql
    SELECT * FROM employee
    WHERE birth_date LIKE '____-10%'; 
    // XXXX-10XXX...
    ```
    

## Union

1. Intro
    - use for combining selection result
    - must have same number of columns on each select statement
    - similar data type
2. Example: Find a list of employee and branch names
    
    ```sql
    SELECT first_name AS naming FROM employee
    UNION
    SELECT branch_name FROM branch_supplier;
    ```
    

## Join

`JOIN...ON...` is used to combine two or more tables base on a relative columns between them.

- Inner join - include rows on both table when specified of the rows from both tables matches the `ON` condition
    
    Find all branches with a manager and their manager’s name:
    
    ```sql
    SELECT employee.first_name, employee.last_name, branch.branch_name 
    FROM employee
    JOIN branch
    ON employee.emp_id = branch.mgr_id;
    ```
    
- Left join - include all rows from the **left** table, while on the right table, only show rows which the specified data of the row matches `ON` condition.
    
    Find all branches with a manager and the name of their managers along with other employees:
    
    ```sql
    SELECT employee.first_name, employee.last_name, branch.branch_name
    FROM employee
    LEFT JOIN branch
    ON employee.emp_id = branch.mgr_id;
    ```
    
- Right join - include all rows from the **rigth** table, while on the left table, only show rows which the specified data of the row matches `ON` condition.
    
    Find all branches and the name of their managers:
    
    ```sql
    SELECT employee.first_name, employee.last_name, branch.branch_name
    FROM employee
    RIGHT JOIN branch
    ON employee.emp_id = branch.mgr_id;
    ```
    

## Nested Queries

- Find names of all employees and it’s who have sold over 30000 to a single client
    
    ```sql
    // check if the employee.emp_id is in the result of inner query 
    SELECT employee.first_name, employee.last_name FROM employee
    WHERE employee.emp_id IN (
    	SELECT works_with.emp_id FROM works_with
    	WHERE works_with.total_sales > 30000;
    );
    
    // NOTED: the below query doesn't work
    // if one person sales to multiple clients for more than 30000
    // the person's name will be shown repeatedly
    SELECT employee.first_name, employee.last_name
    FROM employee
    JOIN works_with
    ON employee.emp_id = works_with.emp_id
    WHERE works_with.total_sales > 30000;
    ```
    
- Find names of all employees who have sold over 30000 to a single client and their min sales over 30000:
    
    ```sql
    SELECT employee.first_name, employee.last_name, MIN(works_with.total_sales)
    FROM employee
    JOIN works_with
    ON employee.emp_id = works_with.emp_id
    WHERE employee.emp_id IN (
    	SELECT works_with.emp_id FROM works_with
    	WHERE works_with.total_sales > 30000
    ) AND works_with.total_sales > 30000
    GROUP BY employee.emp_id
    ORDER BY employee.emp_id DESC;
    ```
    
- Find all employees who are handled by the branch that Michael Scott manages, assume you know Michael’s ID
    
    ```sql
    SELECT employee.first_name, employee.last_name FROM employee
    WHERE employee.emp_id IN (
    	SELECT branch.branch_id FROM branch
    	WHERE branch.mgr_id = 102;
    ) AND employee.emp_id <> 102;
    ```
    
- Find all clients who are handled by the branch that Michael Scott manages, assume you know Michael’s ID:
    
    ```sql
    SELECT client.client_name FROM client
    WHERE client.branch_id = (
    	SELECT branch.branch_id FROM branch
    	WHERE branch.mgr_id = 102
    	LIMIT 1
    );
    ```
    

## On Delete

This section explain what `ON DELETE SET NULL` and `ON DELETE CASCADE` are:

- `ON DELETE SET NULL`
    
    When the foreign key reference is deleted, set the value to be `null` .
    
    For example, branch Corporate’s manager is David, if David’s row inside `employee` is deleted, the `mgr_id` of branch Corporate will be set to `null`:
    
    ```sql
    CREATE TABLE branch (
    	branch_id INT PRIMARY KEY,
    	branch_name VARCHAR(40),
    	mgr_id INT,
    	mgr_start_date DATE,
    	FOREIGN KEY(mgr_id) REFERENCES employee(emp_id) ON DELETE SET NULL
    );
    ```
    
- `ON DELETE CASCADE`
    
    When the foreign key reference is deleted, delete the whole row of data.
    
    Usually when this foreign key is also part of the primary key, then it cannot be `null` , so we will always have to delete the entire row when the foreign key is being deleted in it’s own table, since the foreign key will become `null` , which is unacceptable for primary key.
    
    For example, if branch Corporate (with `branch_id` 1) is deleted, then the supplier no longer exists, so we should delete the whole supplier row whose supplier is branch Corporate.
    
    ```sql
    CREATE TABLE branch_supplier (
    	branch_id INT,
    	supplier_name VARCHAR(40),
    	supply_type VARCHAR(40)
    	PRIMARY KEY(branch_id, supplier_name),
    	FOREIGN KEY(branch_id) REFERENCES branch(branch_id) ON DELETE CASCADE
    );
    ```
    

## Triggers

Trigger is a block of SQL code which will define a certain action that should happen when a certain operation gets performed on the database. It can happen after / before the `INSERT` , `UPDATE` and `DELETE` on a table.

- Basic example
    
    ```sql
    // 1. create trigger table
    CREATE TABLE my_first_trigger_table (
    	message VARCHAR(100)
    );
    ```
    
    ```sql
    // 2. note that since this action command changes the delimiters,
    // we will have to execute it inside terminal
    // login to mysql, and enter password
    $ mysql -u root -p
    ```
    
    ```sql
    // 3. choose database
    mysql> use giraffe
    ```
    
    ```sql
    // 4. write down the trigger action
    DELIMITER $$
    CREATE
    	TRIGGER my_first_trigger BEFORE INSERT 
    	ON employee
    	FOR EACH ROW BEGIN
    		INSERT INTO my_first_trigger_table VALUES('add new employee');
    	END$$
    DELIMITER ;
    
    // NOTED that this part of code only works inside terminal
    // since Workbench doen't support chaning delimiter
    ```
    
    In the above SQL code, we first change the delimiter to `$$`, if we didn’t change it, the code will finish its execution when it reaches the first `;` inside the trigger code.
    
    Then we define the trigger name (`my_first_trigger`), timing (`BEFORE`) and what CRUD action is it listening to (`INSERT`).
    
    After that, we define the trigger message and the table to store the message (`my_first_trigger_table`). 
    
    At last, we change the delimiter back to `;` .
    
    We can test the trigger by inserting new employee to the employee table:
    
    ```sql
    INSERT INTO employee
    VALUES(109, 'Oscar', 'Martinez', '1968-02-19', 'M', 69000, 106, 3);
    ```
    
    ```sql
    // then see if the trigger is executed by checking the my_first_trigger_table
    SELECT * FROM my_first_trigger_table;
    ```
    
    ![trigger_1.png](/post/nice-to-meet-you-mysql-p3/trigger_1.png)
    
    The abstraction syntax will be like this:
    
    ```sql
    DELIMITER $$
    CREATE 
    	TRIGGER <name_for_this_trigger> <BEFORE | AFTER> <INSERT | UPDATE | SELECT | DELETE>
    	ON <target_table>
    	FOR EACH ROW BEGIN
    		INSERT INTO <table_to_store_this_trigger_message> VALUES(<trigger_message>);
    	END$$
    DELIMITER ;
    ```
    
- Another example: use `New` to access the data inserted
    
    Let's create another trigger:
    
    ```sql
    DELIMITER $$
    CREATE
    	TRIGGER trigger_with_new_data BEFORE INSERT
    	ON employee
    	FOR EACH ROW BEGIN
    		INSERT INTO my_first_trigger_table VALUES(CONCAT('insert ', NEW.first_name));
    	END$$
    DELIMITER ;
    ```
    
    Now test if we can access the new inserted data inside the trigger message:
    
    ```sql
    INSERT INTO employee
    VALUES(109, 'Kevin', 'Malone', '1978-02-19', 'M', 69000, 106, 3);
    ```
    
    ```sql
    SELECT * FROM my_first_trigger_table;
    ```
    
    ![trigger_2.png](/post/nice-to-meet-you-mysql-p3/trigger_2.png)
    
- Another example: with condition
    
    ```sql
    DELIMITER $$
    CREATE
    	TRIGGER trigger_with_condition BEFORE INSERT
        ON employee
        FOR EACH ROW BEGIN
        IF NEW.sex = 'M' THEN
    		INSERT INTO trigger_test VALUES(CONCAT('insert male employee ', NEW.first_name));
    	ELSEIF NEW.sex = 'F' THEN
    		INSERT INTO trigger_test VALUES(CONCAT('insert female employee ', NEW.first_name));
    	ELSE
    		INSERT INTO trigger_test VALUES(CONCAT('insert employee ', NEW.first_name));
    	END IF;
    END$$
    DELIMITER ;
    ```
    
- Another example: trigger on update
    
    When update a data, we can access either `NEW` or `OLD` value.
    
    ```sql
    DELIMITER $$
    CREATE 
    	TRIGGER trigger_when_update AFTER UPDATE
    	ON employee
    	FOR EACH ROW BEGIN
    		INSERT INTO trigger_test VALUES(CONCAT('original name: ', OLD.first_name, ', ', 'new name: ', NEW.first_name));
    	END$$
    DELIMITER ;
    ```
    
    Now, when we update a certain data:
    
    ```sql
    UPDATE employee
    SET employee.first_name = 'OOOscar'
    WHERE emp_id = 109;
    ```
    
    We will receive new trigger message like this:
    
    ![trigger_3.png](/post/nice-to-meet-you-mysql-p3/trigger_3.png)
    
- Another example: trigger on delete
    
    When delete, we are able to access `OLD` data, but not on `NEW` data, since there’s no new data exists after deletion.
    
    ```sql
    DELIMITER $$
    CREATE
    	TRIGGER trigger_when_delete BEFORE DELETE
        ON employee
        FOR EACH ROW BEGIN
    		INSERT INTO trigger_test VALUES(CONCAT('delete user ', OLD.first_name));
    	END$$
    DELIMITER ;
    ```
    
- Appendix
    
    Delete certain trigger:
    
    ```sql
    DROP TRIGGER trigger_with_new_data;
    ```
    
- Appendix
    
    When combining MySQL with Nodejs, it is recommended to use a library called [Sequalize](https://www.npmjs.com/package/sequelize). It provides ways to config the trigger command without needed to change the delimiters. ([Ref.](https://stackoverflow.com/questions/29716346/how-to-create-a-trigger-in-sequelize-nodejs))
    

## Appendix: how to solve slow SQL command

If you are having issue running `DROP` or other commands, it probably causes by some slow process.

You can run this to check current processes inside your MySQL

```sql
mysql> SHOW PROCESSLIST;
```

![appendix.png](/post/nice-to-meet-you-mysql-p3/appendix.png)

Kill the process you don’t need, or restart certain process which is running slow:

```sql
mysql> KILL <process_ID>;
```

### References

1. **[SQL Tutorial](https://www.youtube.com/watch?v=HXV3zeQKqGY&t=606s) - Full Database Course for Beginners**
2. **[MySQL: Slow Drop table command](https://stackoverflow.com/questions/24496918/mysql-slow-drop-table-command)**
3. **[Can I launch a trigger on select statement in mysql?](https://stackoverflow.com/questions/6137935/can-i-launch-a-trigger-on-select-statement-in-mysql)**
4. **[MySQL BEFORE DELETE Trigger](https://www.mysqltutorial.org/mysql-triggers/mysql-before-delete-trigger/)**