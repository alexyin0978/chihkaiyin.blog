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
    
    ![截圖 2023-12-01 下午3.20.38.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/1574dab3-fc59-4873-9129-4ec7d635535c/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%883.20.38.png)
    
- Attributes - specific pieces of information about an entity.
    
    Name, grade and gpa are attributes:
    
    ![截圖 2023-12-01 中午12.27.41.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/037e1614-33fd-4781-b46d-6985d7daa629/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%AD%E5%8D%8812.27.41.png)
    
- Primary Key - an attribute(s) that uniquely identify an entry in the database table.
    
    Student ID is the primary key here, noted that we use lighter blue to identify it from other attributes:
    
    ![截圖 2023-12-01 中午12.29.47.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/792fd50b-9fb2-4948-bcad-0f6610c3023b/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%AD%E5%8D%8812.29.47.png)
    
- Composite attribute - an attribute that can be broken up into sub-attributes.
    
    Name can be broken up into first_name and last_name:
    
    ![截圖 2023-12-01 中午12.32.06.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/b83f7ae9-245f-4ddc-99aa-f2ee6eabdede/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%AD%E5%8D%8812.32.06.png)
    
- Multi-valued attribute - an attribute that can have more than one value.
    
    For example, a student may have attend more than one club:
    
    ![截圖 2023-12-01 中午12.35.05.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/b67e2de3-c382-4676-a104-e0104f965e01/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%AD%E5%8D%8812.35.05.png)
    
- Derived attribute - an attribute that can be derived from the other attributes.
    
    For example, has_honors can be derive from the gpa attribute (anyone whose gpa is higher than 3.9 will have honor …etc).
    
    ![截圖 2023-12-01 中午12.39.12.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/2ee6655d-dd14-4436-82f4-313327205df1/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%AD%E5%8D%8812.39.12.png)
    
- Multiple entities - you can define more than one entity in the diagram.
    
    For example, besides student entity, we could also have class entity:
    
    ![截圖 2023-12-01 中午12.42.44.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/b013623b-7dd2-4089-9585-565cc683fea6/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%AD%E5%8D%8812.42.44.png)
    
- Relationships & Participation
    
    **Relationship** defines a relationship between two **entities;**
    
    **Participation** can be **Partial Participation** or **Total Participation**. Total Participation means all members must participate in the relationship.
    
    For example, the relationship between entity student and class is the verb “take”, a student “takes” a class or a class is being “taken” by a student. 
    
    A student can decide if they want to take a class or not, and since students don’t necessarily have to take a class, this makes it a Partial Participation (single line); on the other hand, a class has to be taken by at least one student, making it a Total Participation (double lines).
    
    ![截圖 2023-12-01 下午1.07.39.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/acfda56d-43e9-4790-aad5-f196c5e84c4f/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%881.07.39.png)
    
- Relationship Attribute - an attribute about the relationship.
    
    For example, a student could take a class and get a “grade” from this relation:
    
    ![截圖 2023-12-01 下午2.57.48.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/e3d4484a-b847-42d1-a8b2-bfa2534ac439/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%882.57.48.png)
    
- Relationship Cardinality - the number of instances of an entity from a relation that can associated with the relation.
    
    For example, a student can take any number (**M**) of classes, while a class can also be taken by any number (**N**) of students, which makes this a N:M cardinality relationship. Other type of cardinality relationships are like: 1:1, 1:N.
    
    ![截圖 2023-12-01 下午3.03.03.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/79f1b6b1-4900-4a38-a41c-f85dc475a3ba/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%883.03.03.png)
    
- Weak Entity & Identifying Relationship
    
    **Weak Entity is** an entity that cannot be uniquely identified by its attributes alone. 
    
    **Identifying Entity** is a relationship that serves to uniquely identify the weak entity.
    
    For example, an exam must be associated (has) with a class. If the class is being removed, then the exam will no longer exist. 
    
    Noted that a weak entity must have **total participation** in the relationship. 
    
    ![截圖 2023-12-01 下午5.44.29.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/7ec6cf5f-b5d9-443e-a3a7-6bb5fe77624e/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%885.44.29.png)
    
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
    
    ![截圖 2023-12-01 下午4.42.40.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/f6ace705-5fe5-4a0b-8fd5-c483ab8e6f4d/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%884.42.40.png)
    
- The company makes it’s money by selling to clients. Each client has a name and a unique number to identify it:
    
    ![截圖 2023-12-01 下午4.45.42.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/54c6196c-98b1-4b89-a68a-e242fe6450f2/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%884.45.42.png)
    
- The foundation of the company is it’s employees. Each employee has a name, birthday, sex, salary and a unique number:
    
    ![截圖 2023-12-01 下午4.47.27.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/45052d9c-8173-4dd9-bbfc-1ffd0c020fa2/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%884.47.27.png)
    
- An employee can work for one branch at a time:
    
    ![截圖 2023-12-01 下午5.00.51.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/77d80418-df7b-4c8f-8721-e292be6d6ee7/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%885.00.51.png)
    
- and each branch will be managed by one of the employees that work there. We’ll also want to keep track of when the current manager started as a manager:
    
    ![截圖 2023-12-01 下午5.15.59.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/4854aca5-02ab-4fe5-9738-34394b14799d/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%885.15.59.png)
    
- An employee can act as a supervisor for other employees at the branch, an employee may also act as the supervisor for employees at other branches. An employee can have at most one supervisor:
    
    ![截圖 2023-12-01 下午5.19.55.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/68db360b-5e97-4a15-9773-5fae4c8aae58/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%885.19.55.png)
    
- A branch may handle a number of clients, with each client having a name and a unique number to identify it. A single client may only be handled by one branch at a time.
    
    ![截圖 2023-12-01 下午5.23.58.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/21682278-74b4-4c37-846b-94c97cc11e45/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%885.23.58.png)
    
- Employees can work with clients controlled by their branch to sell them stuff. If necessary, multiple employees can work with the same client. We’ll want to keep track of how many dollars worth of stuff each employee sells to each client they work with.
    
    ![截圖 2023-12-01 下午5.34.44.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/383e80e6-e36c-4686-abe2-466cd5d2f490/%E6%88%AA%E5%9C%96_2023-12-01_%E4%B8%8B%E5%8D%885.34.44.png)
    
- Many branches will need to work with suppliers to buy inventory. For each supplier we’ll keep track of their name and the type of product they’re selling the branch. A single supplier may supply products to multiple branches.
    
    ![截圖 2023-12-02 下午4.22.55.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/97f48e3e-d017-48e5-88cd-563d52c0acde/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.22.55.png)
    

## Converting ER Diagrams to schemas - company example

1. Mapping of Regular Entity Types
    
    For each regular entity type, create a relation table that includes all the simple attributes of the entity:
    
    ![截圖 2023-12-02 下午4.10.34.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/e965a1af-50db-4890-a9b3-c055c30e980c/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.10.34.png)
    
    ![截圖 2023-12-02 下午4.24.01.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/1cb4bea6-5a8c-400e-9676-3191b8615c5d/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.24.01.png)
    
2. Mapping of Weak Entity Types
    
    For each weak entity type, create a relation table that includes all simple attributes of the weak entity.
    
    The primary key of the weak entity table should be partial key of the entity itself and the primary key of its owner:
    
    ![截圖 2023-12-02 下午4.25.03.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/dff93d9e-4de2-4b7f-ab07-ea486c34789b/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.25.03.png)
    
    ![截圖 2023-12-02 下午4.25.47.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/00d9bb04-f7c8-4218-a969-4324b48f5d8e/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.25.47.png)
    
3. Mapping of Binary 1:1 relationship types
    
    Include one side of the relationship as a foreign key in the other in favor of total participation. For example, branch must be managed (total participation) by one of the employees, so include the primary key of the employee table as a foreign key of the branch table plus the relational attributes:
    
    ![截圖 2023-12-02 下午4.28.25.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/172da96f-6977-47c8-92d4-416b63608b78/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.28.25.png)
    
    ![截圖 2023-12-02 下午4.31.06.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/978d6f83-b06c-44ab-a4d8-2fa78da0de66/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.31.06.png)
    
4. Mapping of Binary 1:N relationship types
    
    Include the “1” side’s primary key as a foreign key on the “N” side table. For example, If an employee can only work for “1” branch at a time, include the branch table’s primary key into the employee table as one of its foreign keys:
    
    ![截圖 2023-12-02 下午4.32.13.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/2ed132ea-ed84-47ac-9306-029ef8a8c174/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.32.13.png)
    
    ![截圖 2023-12-02 下午4.37.37.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/3fa511dc-27eb-4697-9544-132c90ef071b/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.37.37.png)
    
5. Mapping of Binary M:N relationship types
    
    Create a new relation table who’s primary key is a combination of both regular entities’ primary keys. Also include any relationship attributes:
    
    ![截圖 2023-12-02 下午4.43.55.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/68c4bb19-d730-424f-947f-8e16fc5a2ed2/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.43.55.png)
    
    ![截圖 2023-12-02 下午4.44.15.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/10f630a5-68dc-4de8-8e79-2fd2ae5f3558/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.44.15.png)
    
6. Appendix: draw connection line of primary keys and foreign keys
    
    To be more specific, you may draw lines to indicate where the foreign keys’ come from:
    
    ![截圖 2023-12-02 下午4.49.01.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b28b6252-fa85-464f-83fa-e18c4211ebde/0320be5f-2dff-4ea0-a8e8-d906f0507e2b/%E6%88%AA%E5%9C%96_2023-12-02_%E4%B8%8B%E5%8D%884.49.01.png)
    
7. Wrap up
    
    Now we have done designing a database from reading requirements to ER Diagrams to the actual tables’ schemas, the rest of the steps will be creating tables and inserting datas into them, then you can start querying the tables.
    
    That’s it, hope you enjoy these articles (note).

### Reference

1. **[SQL Tutorial](https://www.youtube.com/watch?v=HXV3zeQKqGY&t=606s) - Full Database Course for Beginners**