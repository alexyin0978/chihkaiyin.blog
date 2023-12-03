---
title: "Nice to meet you MySQL - part 2"
subtitle: "Introduce common SQL data types, basic query syntax …etc"
date: "2023-12-03"
tag: "mysql,database"
index: 2
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

- Data types in MySQL
- Create, Delete and Alter Table schema
- Insert and Select Data
- Data constraints
- Data comparison options
- Update & Delete
- Basic Queries
- References

## Data types in MySQL

```sql
INT
// integers, numbers without decimal

DECIMAL(M,N)
// numbers with floating
// Maximum total digits
// Maximum total digits after decimal point

VARCHAR(l)
// String of text of maximum length of l
// need to be wrapped in single quote ''

BLOB
// Binary large object, stores large data
// ususally store images or files

DATE
// 'YYYY-MM-DD'

TIMESTAMP
// 'YYYY-MM-DD HH:MM:SS'
```

## Create, Delete and Alter Table schema

1. Create table
    
    Let’s write our first query: create the first table inside database `giraffe`:
    
    ```sql
    CREATE TABLE student (
    	student_id INT PRIMARY KEY,
    	name VARCHAR(20),
    	major VARCHAR(20),
    );
    
    // or you can specify PRIMARY KEY in this way:
    CREATE TABLE student (
    	student_id INT,
    	name VARCHAR(20),
    	major VARCHAR(20),
    	PRIMARY KEY(student_id)
    );
    ```
    
2. Delete table
    
    ```sql
    DROP TABLE student;
    ```
    
3. Alter table schema ( add or delete column )
    
    ```sql
    // add column
    ALTER TABLE student ADD gpa DECIMAL(3, 2);
    
    // delete column
    ALTER TABLE student DROP COLUMN gpa;
    
    ```
    
4. Describe table schema ( print table schema )
    
    ```sql
    DESCRIBE table_name;
    ```
    

## Insert and Select Data

1. insert row data
    
    ```sql
    // insert with all fields
    INSERT INTO student VALUES(1, 'John', 'history');
    
    // insert with certain fields (others assign to null)
    INSERT INTO student(student_id, name) VALUES(2, 'Alex');
    ```
    
    ![insert_fig1.png](/post/nice-to-meet-you-mysql-p2/insert_fig1.png)
    
2. select (print) table data
    
    ```sql
    SELECT * FROM student;
    ```
    

## Data constraints

1. Not Null
    
    ```sql
    CREATE TABLE student (
    	// ...,
    	major VARCHAR(20) NOT NULL,
    );
    ```
    
2. Unique
    
    Note that Primary Key is actually the combination of `NOT NULL` and `UNIQUE`
    
    ```sql
    CREATE TABLE student (
    	// ...,
    	major VARCHAR(20) UNIQUE,
    );
    ```
    
3. Default
    
    ```sql
    CREATE TABLE student (
    	// ...,
    	major VARCHAR(20) DEFAULT 'undecided',
    );
    ```
    
4. Auto Increment
    
    If the data type is `INT`, we can use the `AUTO_INCREMENT` constraint
    
    ```sql
    CREATE TABLE student (
    	student_id INT PRIMARY KEY AUTO_INCREMENT,
    	// ...
    );
    ```
    

## Data comparison options

```sql
// equals
A = B 

// not equals
A <> B

// greater than
A > B

// less than
A < B

// greater than or equal to
A >= B

// less than or equal to
A <= B
```

## Update & Delete

1. Update all rows
    
    ```sql
    // update "one" column
    UPDATE student
    SET major = 'Chinese';
    
    // update "multiple" columns
    UPDATE student 
    SET major = 'Chinese', gpa = '3.8';
    ```
    
2. Update rows that match certain condition
    
    ```sql
    // basic
    UPDATE student
    SET major = 'Chinese'
    WHERE name = 'Alex';
    
    // OR
    UPDATE student
    SET major = 'Chinese'
    WHERE name = 'Alex' OR name = 'alex';
    
    // AND
    UPDATE student
    SET major = 'Chinese'
    WHERE name = 'Alex' AND major = 'CH';
    ```
    
3. Delete all rows
    
    ```sql
    DELETE FROM student;
    ```
    
4. Delete rows that match certain condition
    
    ```sql
    DELETE FROM student
    WHERE student_id = 1;
    ```
    

## Basic Queries

1. Select All
    
    ```sql
    SELECT * FROM student;
    ```
    
2. Select certain column
    
    ```sql
    SELECT student.major FROM student;
    ```
    
3. Order by
    
    ```sql
    // order by data with INT or DECIMAL, default to ascending
    SELECT student.major FROM student
    ORDER BY student_id;
    
    // order other kinds of data, eg: VARCHAR
    SELECT student.major FROM student
    ORDER BY name; // alphabetical order
    
    // ascending (default)
    SELECT student.major FROM student
    ORDER BY student_id ASC;
    
    // descenging
    SELECT student.major FROM student
    ORDER BY student_id DESC;
    
    // order by multiple columns
    SELECT student.major FROM student
    ORDER BY major, student_id DESC;
    // order first by major, then student_id in DESC
    ```
    
4. Limit
    
    ```sql
    // show only 2 rows
    SELECT * FROM student
    LIMIT 2;
    
    // combine with WHERE and ORDER BY
    SELECT * FROM student
    WHERE student_id < 3
    ORDER BY student_id DESC
    LIMIT 2;
    ```
    
5. In (chain of or)
    
    ```sql
    // IN & AND
    SELECT * FROM student
    WHERE name IN ('Alex', 'Allen');
    ```
    

### Reference

1. **[SQL Tutorial](https://www.youtube.com/watch?v=HXV3zeQKqGY&t=606s) - Full Database Course for Beginners**