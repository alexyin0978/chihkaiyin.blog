---
title: "Nice to meet you MySQL - part 1"
subtitle: "Introduce database, SQL, keys and the installation process"
date: "2023-12-03"
tag: "mysql,database"
---

The articles are notes I took on the **[SQL Tutorial - Full Database Course for Beginners](https://www.youtube.com/watch?v=HXV3zeQKqGY)** course **.**

They break into four parts:

1. First article will introduce what is a database, SQL, keys and walk through the installation of MySQL on Mac.
2. Second article introduces the common SQL data types, basic query syntax …etc.
3. In third article we will create company tables, practice how to query on data, and introduce Functions, Wildcards …etc.
4. The last article we introduce ER Diagrams, a way to diagram the requirements into figures, then we learn how to transform the ER Diagrams into actual SQL table schemas.

Now, let’s get started.

---

### TL:DR

- What is a Database
- Tables and Keys
- SQL introduction
- Install MySQL on Mac
- Reference

## What is a Database

- Database is any collection of related information
- Database Management Systems (DBMS) make it easy to create, maintain and secure a database
- DBMS allow you to perform the C.R.U.D. operations and other administrative tasks
- Two types of Databases: Relational & Non-Relational
- Relational databases use SQL and store data in tables with rows and columns, eg: MySQL
- Non-Relational databases store data using other data structures, eg: JSON

## Tables and Keys

### Table

A table is consist of columns and rows:

![student_table.png](/post/nice-to-meet-you-mysql-p1/student_table.png)

### Keys

1. Primary Key
    - Attribute ****uniquely defines the row in the table / database
    - Must be **unique**
    - Can be anything, number, string …etc
    - Real World Related
        1. surrogate key
            
            No mapping to the real world, doesn’t mean anything, ie: random unique numbers.
            
        2. natural key
            
            Means something in the real world, ie: social security number.
            
    - for example:  column `branch_id` is the Primary Key of the table
        
        ![branch_table.png](/post/nice-to-meet-you-mysql-p1/branch_table.png)
        
2. Foreign Key
    - usually is the Primary Key of another table, providing a way to define relationships between 2 tables, eg: table `Employee` has a Foreign Key  `branch_id` , which is the Primary Key of the `Branch` table
    - it can also be from the same table, eg: `super_id` (Foreign Key) is the `emp_id` from the same table `Employee`
    
    ![employee_table.png](/post/nice-to-meet-you-mysql-p1/employee_table.png)
    
    ![branch_table.png](/post/nice-to-meet-you-mysql-p1/branch_table.png)
    
3. Composite Key
    - Primary Key is a composite of 2 columns
    - for example: the Primary Key below is composite of `branch_id` and `supplier_name`
        
        ![branch_supplier_table.png](/post/nice-to-meet-you-mysql-p1/branch_supplier_table.png)
        
    - composite key can also be Foreign Key, eg: the `emp_id` and `client_id` from the `Works_With` table is the also Foreign Keys, which is the Primary Keys of `Emplayee` table and `Client` table
        
        ![works_with_table.png](/post/nice-to-meet-you-mysql-p1/works_with_table.png)
        
        ![employee_table.png](/post/nice-to-meet-you-mysql-p1/employee_table.png)
        
        ![branch_table.png](/post/nice-to-meet-you-mysql-p1/branch_table.png)
        

## SQL introduction

### What is SQL

- SQL  (Structure Query Language) is a language used for interacting with RDBMS (Relational Database Management System)
- you can use SQL to tell RDBMS to do things for you:
    1. create / manage db
    2. design / create db tables
    3. CRUD 
- It’s a language that mashes the below 4 types of languages:
    1. Data Query Language (DQL)
        1. query the db for information
        2. get information (R)
    2. Data Definition Language (DDL)
        1. define db schemas
    3. Data Control Language (DCL)
        1. user & permission management
    4. Data Manipulation Language (DML) 
        1. insert (C), update (U), delete (D) data from db

### What is Query

- Query is a set of instruction to tell RDBMS the information you want it to retrieve for you, for example:
    
    ```sql
    SELECT employee.name, employee.age # select what column
    FROM employee # from which table
    WHERE emplyee.salary > 30000; # conditions
    ```
    

## Install MySQL on Mac

1. Download MySQL
    
    Go to this [website](https://dev.mysql.com/downloads/mysql/), click **`macOS 13 (ARM, 64-bit), DMG Archive`** to download, if your mac is intel chip, click **`macOS 13 (x86, 64-bit), DMG Archive`** instead.
    
2. remember the `user` , `address` and the `password` you set, we will have to use it to connect to our local database server.
3. start our MySQL server on our computer
4. allow bash / zsh to use `mysql` command
    
    Run this in the terminal first
    
    ```bash
    export PATH=${PATH}:/usr/local/mysql/bin/
    ```
    
    Then run this:
    
    ```bash
    source ~/.zshrc   # If you use Oh-My-Zsh
    
    # or, if you use Default Bash, run this instead
    source ~/.bashrc  
    ```
    
5. login to mysql local server
    
    Now the `mysql` command should be activated. But when you enter `mysql` command inside terminal, you will see this:
    
    ```bash
    $ mysql
    ERROR 1045 (28000): Access denied for user 'YOUR_COMPUTER_USERNAME'@'localhost' (using password: NO)
    ```
    
    It is saying we should type in password in order to login to our MySQL server:
    
    ```bash
    $ mysql -u root -p # hit enter
    Enter password: # type in password and you will be logged in
    
    # ...
    
    mysql> # you can start typing your MySQL command
    ```
    
6. Create our first database
    
    ```bash
    mysql> create database YOUR_DB_NAME; 
    # don't forget the ";" to finish the command
    ```
    
7. Download MySQL Workbench
    
    It is totally fine to use terminal to give MySQL commands, but we will use MySQL Workbench instead, it is a visualized editor for MySQL, providing us better DX.
    
    Download the app from this [link](https://dev.mysql.com/downloads/workbench/).
    
    After installation, login to the Local instance 3306 with the password you set.
    
    ![install_1.png](/post/nice-to-meet-you-mysql-p1/install_1.png)
    
    After login, you shall see the database you just created inside scheme, for my case, it’s `giraffe` :
    
    ![install_2.png](/post/nice-to-meet-you-mysql-p1/install_2.png)
    
8. Appendix
    - How to exit inside terminal
        
        type `exit` to exit the mysql server
        
    - If you wanna alter your MySQL server password inside terminal
        
        ```bash
        mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'YOUR_NEW_PASSWORD';
        ```
        

### Reference

1. **[SQL Tutorial](https://www.youtube.com/watch?v=HXV3zeQKqGY&t=606s) - Full Database Course for Beginners**
2. **[How to fix "command not found: mysql" in Zsh](https://stackoverflow.com/questions/35858052/how-to-fix-command-not-found-mysql-in-zsh)**