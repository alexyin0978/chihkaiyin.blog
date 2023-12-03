---
title: "Nice to meet you MySQL - part 4"
subtitle: "Introduce ER Diagrams, and transform it into actual SQL table schemas"
date: "2023-12-03"
tag: "mysql,database"
index: 4
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

- ER Diagrams Intro - school example
- Designing an ER Diagram from requirements - company example
- Converting ER Diagrams to schemas - company example
- Reference

## ER Diagrams Intro - school example

**Entity Relationship Diagrams** (ER Diagrams), diagrams that help you take the business requirements and convert them into actual database schema.

For example, let’s design a database schema for students, classes and exams information:

- Entity - an object we want to model & store information about.
    
    Student is an entity:
    
    ![sec_1_fig_1.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_1.png)
    
- Attributes - specific pieces of information about an entity.
    
    Name, grade and gpa are attributes:
    
    ![sec_1_fig_2.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_2.png)
    
- Primary Key - an attribute(s) that uniquely identify an entry in the database table.
    
    Student ID is the primary key here, noted that we use lighter blue to identify it from other attributes:
    
    ![sec_1_fig_3.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_3.png)
    
- Composite attribute - an attribute that can be broken up into sub-attributes.
    
    Name can be broken up into first_name and last_name:
    
    ![sec_1_fig_4.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_4.png)
    
- Multi-valued attribute - an attribute that can have more than one value.
    
    For example, a student may have attend more than one club:
    
    ![sec_1_fig_5.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_5.png)
    
- Derived attribute - an attribute that can be derived from the other attributes.
    
    For example, has_honors can be derive from the gpa attribute (anyone whose gpa is higher than 3.9 will have honor …etc).
    
    ![sec_1_fig_6.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_6.png)
    
- Multiple entities - you can define more than one entity in the diagram.
    
    For example, besides student entity, we could also have class entity:
    
    ![sec_1_fig_7.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_7.png)
    
- Relationships & Participation
    
    **Relationship** defines a relationship between two **entities;**
    
    **Participation** can be **Partial Participation** or **Total Participation**. Total Participation means all members must participate in the relationship.
    
    For example, the relationship between entity student and class is the verb “take”, a student “takes” a class or a class is being “taken” by a student. 
    
    A student can decide if they want to take a class or not, and since students don’t necessarily have to take a class, this makes it a Partial Participation (single line); on the other hand, a class has to be taken by at least one student, making it a Total Participation (double lines).
    
    ![sec_1_fig_8.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_8.png)
    
- Relationship Attribute - an attribute about the relationship.
    
    For example, a student could take a class and get a “grade” from this relation:
    
    ![sec_1_fig_9.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_9.png)
    
- Relationship Cardinality - the number of instances of an entity from a relation that can associated with the relation.
    
    For example, a student can take any number (**M**) of classes, while a class can also be taken by any number (**N**) of students, which makes this a N:M cardinality relationship. Other type of cardinality relationships are like: 1:1, 1:N.
    
    ![sec_1_fig_10.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_10.png)
    
- Weak Entity & Identifying Relationship
    
    **Weak Entity is** an entity that cannot be uniquely identified by its attributes alone. 
    
    **Identifying Entity** is a relationship that serves to uniquely identify the weak entity.
    
    For example, an exam must be associated (has) with a class. If the class is being removed, then the exam will no longer exist. 
    
    Noted that a weak entity must have **total participation** in the relationship. 
    
    ![sec_1_fig_11.png](/post/nice-to-meet-you-mysql-p4/sec_1_fig_11.png)
    
    You may be wondering, in the class - student relationship, a class must be taken by at least one student, doesn’t that makes the class entity a weak entity? Well, I think it’s also true, so how you design this schema depends on your point of view, in my point of view, in the real world, a class must be taken by one student though, it will continue to exist even when no student has taken the class.
    

## Designing an ER Diagram from requirements - company example

Let’s see the requirements written in text content first:

1. The company is organized into branches. Each branch has a unique number, a name and a particular employee who manages it.
2. The company makes it’s money by selling to clients. Each client has a name and a unique number to identify it.
3. The foundation of the company is it’s employees. Each employee has a name, birthday, sex, salary and a unique number.
4. An employee can work for one branch at a time, and each branch will be managed by one of the employees that work there. We’ll also want to keep track of when the current manager started as a manager.
5. An employee can act as a supervisor for other employees at the branch, an employee may also act as the supervisor for employees at other branches. An employee can have at most one supervisor.
6. A branch may handle a number of clients, with each client having a name and a unique number to identify it. A single client may only be handled by one branch at a time.
7. Employees can work with clients controlled by their branch to sell them stuff. If necessary, multiple employees can work with the same client. We’ll want to keep track of how many dollars worth of stuff each employee sells to each client they work with.
8. Many branches will need to work with suppliers to buy inventory. For each supplier we’ll keep track of their name and the type of product they’re selling the branch. A single supplier may supply products to multiple branches.

---

Now, let’s convert them into ER Diagrams.

- The company is organized into branches. Each branch has a unique number, a name:
    
    ![sec_2_fig_1.png](/post/nice-to-meet-you-mysql-p4/sec_2_fig_1.png)
    
- The company makes it’s money by selling to clients. Each client has a name and a unique number to identify it:
    
    ![sec_2_fig_2.png](/post/nice-to-meet-you-mysql-p4/sec_2_fig_2.png)
    
- The foundation of the company is it’s employees. Each employee has a name, birthday, sex, salary and a unique number:
    
    ![sec_2_fig_3.png](/post/nice-to-meet-you-mysql-p4/sec_2_fig_3.png)
    
- An employee can work for one branch at a time:
    
    ![sec_2_fig_4.png](/post/nice-to-meet-you-mysql-p4/sec_2_fig_4.png)
    
- and each branch will be managed by one of the employees that work there. We’ll also want to keep track of when the current manager started as a manager:
    
    ![sec_2_fig_5.png](/post/nice-to-meet-you-mysql-p4/sec_2_fig_5.png)
    
- An employee can act as a supervisor for other employees at the branch, an employee may also act as the supervisor for employees at other branches. An employee can have at most one supervisor:
    
    ![sec_2_fig_6.png](/post/nice-to-meet-you-mysql-p4/sec_2_fig_6.png)
    
- A branch may handle a number of clients, with each client having a name and a unique number to identify it. A single client may only be handled by one branch at a time.
    
    ![sec_2_fig_7.png](/post/nice-to-meet-you-mysql-p4/sec_2_fig_7.png)
    
- Employees can work with clients controlled by their branch to sell them stuff. If necessary, multiple employees can work with the same client. We’ll want to keep track of how many dollars worth of stuff each employee sells to each client they work with.
    
    ![sec_2_fig_8.png](/post/nice-to-meet-you-mysql-p4/sec_2_fig_8.png)
    
- Many branches will need to work with suppliers to buy inventory. For each supplier we’ll keep track of their name and the type of product they’re selling the branch. A single supplier may supply products to multiple branches.
    
    ![sec_2_fig_9.png](/post/nice-to-meet-you-mysql-p4/sec_2_fig_9.png)
    

## Converting ER Diagrams to schemas - company example

1. Mapping of Regular Entity Types
    
    For each regular entity type, create a relation table that includes all the simple attributes of the entity:
    
    ![sec_3_fig_1.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_1.png)
    
    ![sec_3_fig_2.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_2.png)
    
2. Mapping of Weak Entity Types
    
    For each weak entity type, create a relation table that includes all simple attributes of the weak entity.
    
    The primary key of the weak entity table should be partial key of the entity itself and the primary key of its owner:
    
    ![sec_3_fig_3.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_3.png)
    
    ![sec_3_fig_4.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_4.png)
    
3. Mapping of Binary 1:1 relationship types
    
    Include one side of the relationship as a foreign key in the other in favor of total participation. For example, branch must be managed (total participation) by one of the employees, so include the primary key of the employee table as a foreign key of the branch table plus the relational attributes:
    
    ![sec_3_fig_5.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_5.png)
    
    ![sec_3_fig_6.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_6.png)
    
4. Mapping of Binary 1:N relationship types
    
    Include the “1” side’s primary key as a foreign key on the “N” side table. For example, If an employee can only work for “1” branch at a time, include the branch table’s primary key into the employee table as one of its foreign keys:
    
    ![sec_3_fig_7.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_7.png)
    
    ![sec_3_fig_8.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_8.png)
    
5. Mapping of Binary M:N relationship types
    
    Create a new relation table who’s primary key is a combination of both regular entities’ primary keys. Also include any relationship attributes:
    
    ![sec_3_fig_9.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_9.png)
    
    !![sec_3_fig_10.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_10.png)
    
6. Appendix: draw connection line of primary keys and foreign keys
    
    To be more specific, you may draw lines to indicate where the foreign keys’ come from:
    
    ![sec_3_fig_11.png](/post/nice-to-meet-you-mysql-p4/sec_3_fig_11.png)
    
7. Wrap up
    
    Now we have done designing a database from reading requirements to ER Diagrams to the actual tables’ schemas, the rest of the steps will be creating tables and inserting datas into them, then you can start querying the tables.
    
    That’s it, hope you enjoy these articles (note).

### Reference

1. **[SQL Tutorial](https://www.youtube.com/watch?v=HXV3zeQKqGY&t=606s) - Full Database Course for Beginners**