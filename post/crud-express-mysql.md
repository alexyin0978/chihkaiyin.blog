---
title: "CRUD with Express and MySQL"
subtitle: "Build a C.R.U.D server with Express and MySQL"
date: "2023-12-07"
tag: "express,typescript,MySQL"
---

In this article, we are going to build REST APIs of C.R.U.D. using Express + TypeScript + MySQL, deploying the server on [Render](https://render.com/) and host database on [Clever Cloud](https://www.clever-cloud.com/).

All the code is being pushed onto [this repo](https://github.com/alexyin0978/crud-express-mysql-demo), feel free to check it.

Now, let’s get started!

### TL:DR

- Project goal
- Setup MySQL
- Install project dependencies
- Setup Express server
- Router
- Model
- Controller
- Test the APIs
- Deploy our server and host the database
- References

## Project goal

Our project goal in this article is to build a post service which servers these APIs:

| METHOD | Router | Description |
| --- | --- | --- |
| GET | /post/ | get all posts |
| GET | /post/:postId | get post by postId |
| POST | /post/ | create new post |
| PUT | /post/:postId | update post by postId |
| DELETE | /post/:postId | delete post by postId |

## Setup MySQL

We will to create a database in our local environment first, and after the project is done with development and testing, we will start a machine on [Clever Cloud](https://www.clever-cloud.com/) and create the online database on the service later.

If you haven’t had a MySQL installed on your computer, you can read [this article first](https://chihkaiyin.blog/nice-to-meet-you-mysql-p1).

```bash
$ mysql -u root -p
# wait for the prompt and enter your MySQL password for root
```

After entering password, we shall be logged into MySQL.

### Create database and table

Now, let’s create the database `crud_express_mysql_demo`:

```sql
CREATE DATABASE crud_express_mysql_demo;
```

Then, let’s create the table `post` inside the database:

```sql
CREATE TABLE post (
	id INT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	content VARCHAR(1000) NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
)
ENGINE=innodb CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
```

Each post should contain `id`, `title` , `content` , `created_at` and `updated_at`. 

The primary key will be the `id`, and we also giving it `AUTO_INCREMENT` attribute so we don’t have to calculate the index every time we insert / update new post into the table.

We are giving `created_at` and `updated_at` a default value of current time by adding `CURRENT_TIMESTAMP` attribute. For `updated_at` inside a certain row, every time we update the row, it will be updated to the `CURRENT_TIMESTAMP`.

At last, we specify the engine, charset and case insensitive by adding:

```sql
ENGINE=innodb CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
```

After table creating, you can check the schema by running:

```sql
DESCRIBE TABLE post;
```

### Insert some data for later testing

We will inserted some fake data in order for later testing:

```sql
INSERT INTO post(title, content) VALUES
('title1', 'content1'),
('title2', 'content2'),
('title3', 'content3'),
('title4', 'content4'),
('title5', 'content5'),
('title6', 'content6');
```

To check if the data is being correctly inserted, run this:

```sql
SELECT * FROM post;
```

After all these are done, we can head over to create our Express server.

## Install project dependencies

First create a Github repo, clone it and use it as our project folder:

```bash
$ git clone git@github.com:<YOUR_GITHUB_ACCOUNT>/<PROJECT_NAME>.git
$ cd <PROJECT_NAME>
```

Then run `npm init -y` to install `package.json` inside the project.

### Project installation

To start a Express + TypeScript server, we will install these:

```bash
$ npm i express typescript 
$ npm i @types/express --save-dev
```

After TypeScript is being installed, run this to generate `tsconfig.json` .

```bash
$ npx tsc -init
# tsconfig.json tells the compiler how to compile typescript to javascript
```

Then we will install `nodemon` , it is a tool that helps us automatically restarting the node application every time we save the indicated file:

```bash
$ npm i nodemon ts-node --save-dev
# also install ts-node to prevent typescript error
```

Then we touch a `server.ts` in the root, and add command inside the script of `package.json` to start watching the server change with `nodemon`:

```bash
$ touch server.ts
```

```tsx
// server.ts
console.log("Hello world");
```

```json
// package.json
{
	// ...
  "scripts": {
		"dev": "node server.ts",
		"dev:watch": "nodemon server.ts",
    // ...
  },
}
```

```bash
$ npm run dev:watch
```

![sec_3_fig_1.png](/post/crud-express-mysql/sec_3_fig_1.png)

Now, every time we save `server.ts`, `nodemon` is going to refresh the server for us.

### `.env` and `.gitignore`

Touch `.gitignore` inside root and add these files’ name into it to prevent them from pushing onto Github:

```bash
$ touch .gitignore
```

```bash
# .gitignore

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# node-waf configuration
.lock-wscript

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release

# Dependency directory
# https://docs.npmjs.com/cli/shrinkwrap#caveats
node_modules

# Debug log from npm
npm-debug.log

.DS_Store

.env
```

These prevents some confidential or unnecessary information from being pushed onto Github.

We will store some confidential information inside `.env` , for instance: MySQL username and password. 

Let’s install `dotenv` first:

```bash
$ npm i dotenv
```

Then touch `.env` inside root and add the server port number into it:

```bash
$ touch .env
```

```bash
# .env
SERVER_PORT=8080
```

In order to read the `.env` values, do this:

```tsx
// server.ts
import dotEnv from "dotenv";
dotEnv.config();

console.log("Hello world with port: ", process.env.SERVER_PORT);
```

![sec_3_fig_2.png](/post/crud-express-mysql/sec_3_fig_2.png)

After all the installations are done, we can start configuring our server!

## Setup Express server

### Setup the server

Now let’s setup our server:

```tsx
// server.ts
import express from "express";
import dotEnv from "dotenv";
dotEnv.config();

const app = express();
const port = process.env.SERVER_PORT || 8081;

app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});
```

Then we add some middleware to parse our request data format:

```tsx
// server.ts
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);
```

### CORS (Cross-Origin Resource Sharing)

By default, inside the browser, only when the website has same origin as server does can it access the server’s resources. For example, if website `domain-a.com` request for resource from server `domain-a.com` , it will be a same-origin request, which is always allowed; on the other hand, if website `domain-b.com` request for resource from the same server, it will not be allowed since it is **cross origin resource sharing** (CORS).

![sec_4_fig_1.png](/post/crud-express-mysql/sec_4_fig_1.png)

To allow CORS, we will have to add this configure inside our server:

```bash
# install cors first
$ npm i cors
$ npm i @types/cors --save-dev
```

```tsx
// server.ts
import cors from "cors";

const corsOptions = {
  origin: "https://whatever_domain_you_want.com",
};
app.use(cors(corsOptions));
```

Now the request from this origin will be allowed.

If you would like to allow CORS to any origins, do this instead:

```tsx
app.use(cors());
```

We aren’t going to dive deep into what CORS is. For more detailed information, check [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), [here](https://stackoverflow.com/questions/46024363/what-does-the-function-call-app-usecors-do) and [here](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).

### Our first router

Now, we can add our first router and test with Postman to see if our server is working properly:

```tsx
// server.ts

// first router
app.get("/", (_, res) => {
  res.json({
    message: "ok",
  });
});
```

![sec_4_fig_2.png](/post/crud-express-mysql/sec_4_fig_2.png)

### Project structure

We will split our server’s logic into three layers: **router - controller - model**.

![sec_4_fig_3.png](/post/crud-express-mysql/sec_4_fig_3.png)

When we hit an API route from client, we first execute the router layer, for example: a `GET` post route:

```tsx
// post.router.ts
app.get('/post/', postController.get);
```

The router layer will then execute the corresponding controller, in this example, the `postController.get` callback:

```tsx
// post.controller.ts
import { Request, Response } from "express";
import { PostModel } from "../models/post.model";

export const postController = {
	getAll: async (req: Request, res: Response) => {
		// ...
	}
}
```

Inside the controller, it will execute the corresponding model method, which will directly run the SQL command. 

```tsx
// post.controller.ts
import { Request, Response } from "express";
import { PostModel } from "../models/post.model";

export const postController = {
	getAll: async (req: Request, res: Response) => {
    // ...
    const rst = await PostModel.getAllPosts();
    // ...
	}
}
```

```tsx
// post.model.ts

export const PostModel = {
	getAllPosts: (): Promise<Post[]> => {
    return new Promise((resolve, reject) => {
      connection.query<Post[]>("SELECT * FROM post", (err, res) => {
				if (err) reject(err);
        else resolve(res);
      });
    });
  }
}
```

After model layer returns the query result to the controller, the controller processes the result and respond to the client. 

```tsx
// post.controller.ts
export const postController = {
	get: async (req: Request, res: Response) => {
		const rst = await PostModel.getAllPosts();
		res.send(rst);
	}
}
```

With the **router - controller - model** structure, the server will be more maintainable and scalable.

To sum up, our project structure will look like this:

```tsx
.
├── app
│   ├── config
│   │   └── db.config.ts // constant variables for database connection
│   ├── controller
│   │   └── post.controller.ts
│   ├── model
│   │   ├── db.ts // db connection
│   │   └── post.model.ts
│   └── router
│       └── post.router.ts
├── package-lock.json
├── package.json
├── server.ts
└── tsconfig.json
```

### Connect server to the database

After introducing the project structure, the last step of this section will be connecting server to MySQL database.

Inside `.env` , write down these constants:

```tsx
// .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=xxxx // your mysql root password
DB_NAME=crud_express_mysql // the db name we use inside Setup MySQL section
```

Then we touch `db.config.ts` inside `app/config/`, and store connection-related constant variables inside `mySQLConfig` object:

```tsx
// db.config.ts
export const mySQLConfig = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
};
```

Lastly, inside `/app/model/db.ts` , let’s connect our server to the database.

Install `mysql2` library first, it allows us connect to MySQL database, and define SQL command inside the server:

```bash
$ npm i mysql2
```

Then we can finish the connection process: 

```tsx
// app/model/db.ts
import mysql from "mysql2";
import { mySQLConfig } from "../config/db.config";

export const connection = mysql.createConnection({
  host: mySQLConfig.HOST,
  user: mySQLConfig.USER,
  password: mySQLConfig.PASSWORD,
  database: mySQLConfig.DB,
});

connection.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Successfully connected to mysql");
  }
});
```

To check if the connection works fine, import the `connection` in order to let the server runs the connection:

```tsx
// server.ts
console.log(connection); // after testing, this log can be removed
```

![sec_4_fig_4.png](/post/crud-express-mysql/sec_4_fig_4.png)

## Router

Inside `post.router.ts`, let’s initialize the router and define each post-related routes:

```tsx
import { Router } from "express";

const router = Router();

// define each routes, we will define controllers later
router.get("/", (req, res) => {});
router.get("/:postId", (req, res) => {});
router.post("/", (req, res) => {});
router.put("/:postId", (req, res) => {});
router.delete("/:postId", (req, res) => {});

export const postRouter = router; // rename
```

Then inside `server.ts`, activate `postRouter` by doing this:

```tsx
import { postRouter } from "./app/router/post.router";

app.use("/post", postRouter);
```

## Model

In order to let controller knows what to pass to the model and what it will get, we will have to define the model first.

### Post type

Let’s define the post type first:

```tsx
// post.model.ts
import { RowDataPacket } from "mysql2";

// usually for data query from mysql, 
// we extend the row data type from RowDataPacket
export interface Post extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Post model

Create a model object which wraps all the model methods inside:

```tsx
export const postModel = {
  selectAllPosts: () => {},
  selectPostById: () => {},
  insertNewPost: () => {},
  updatePostById: () => {},
  deletePostById: () => {},
};
```

Then we can start defining each methods.

### Select all posts

```tsx
selectAllPosts: (): Promise<Post[]> => {
  return new Promise((resolve, reject) => {
    connection.query<Post[]>("SELECT * FROM post", (err, rst) => {
      if (err) reject(err);
      else resolve(rst);
    });
  });
},
```

The method returns a promise `Promise<Post[]>` . Inside the method, we use `connection` to directly query from the database `SELECT * FROM post` , and return the query result.

### Select post by id

```tsx
selectPostById: (postId: number): Promise<Post> => {
	return new Promise((resolve, reject) => {
		connection.query<Post[]>(
			"SELECT * FROM post WHERE id = ?",
			[postId],
			(err, rst) => {
				if (err) reject(err);
        else resolve(rst?.[0]);
			}
		);
	});
},
```

One thing worth noted is that, inside the query command `SELECT * FROM post WHERE id = ?` , we are not writing the `postId` directly inside the query, instead, we put it in an array as a second param of `connection.query` , the reason why we do this is to prevent **SQL injection**. 

SQL injection happens when the `postId` send from the client is something like `'' OR 1 = 1;`, in this case, the whole query will be like this:

```tsx
SELECT * FROM post WHERE id = '' OR 1 = 1;
```

The condition `1 = 1` will always be true, which in terms allowing the client to attack the database by retrieving, updating or even deleting on whatever data they want. 

By using query placeholders (putting `postId` inside array as second params), we can escape the input passed to it before it is inserted into the query.

We are not going to deep dive into SQL injection, for more detailed reading, check [here](https://www.stackhawk.com/blog/node-js-sql-injection-guide-examples-and-prevention/) and [here](https://www.comparitech.com/blog/information-security/sql-injection-prevention-tips-for-web-programmers/).

### Insert new post

```tsx
insertNewPost: (title: string, content: string): Promise<Post> => {
  return new Promise((resolve, reject) => {
    connection.query<ResultSetHeader>(
      "INSERT INTO post(title, content) VALUES(?, ?)",
      [title, content],
      async (err, rst) => {
        if (err) reject(err);
        else {
          try {
            const newPost = await postModel.selectPostById(rst.insertId);
            resolve(newPost);
          } catch (err) {
            reject(err);
          }
        }
      }
    );
  });
},
```

We are querying the `newPost` by executing `selectPostById` with the new post id returned by the query again.

Noted that for insertion, update and deletion, the returned object type will be `ResultSetHeader` provided by `mysql2`.

### Update post by id

```tsx
updatePostById: (
  postId: number,
  title: string,
  content: string
): Promise<Post> => {
  return new Promise((resolve, reject) => {
    connection.query<ResultSetHeader>(
      "UPDATE post SET title = ?, content = ? WHERE id = ?",
      [title, content, postId],
      async (err, rst) => {
        if (err) reject(err);
        else {
          try {
            const newPost = await postModel.selectPostById(postId);
            resolve(newPost);
          } catch (err) {
            reject(err);
          }
        }
      }
    );
  });
},
```

In this update query, we query the updated post again by using the `postId` passed in.

### Delete post by id

```tsx
deletePostById: (postId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    connection.query<ResultSetHeader>(
      "DELETE FROM post WHERE id = ?",
      [postId],
      (err, rst) => {
        if (err) reject(err);
        else {
          resolve();
        }
      }
    );
  });
},
```

Now that we finish coding the model layer, in the next section we will implement the controller layer, which will process the query result and respond to the client.

## Controller

### Post controller

Create a controller object which wraps all the controllers inside:

```tsx
// post.controller.ts
export const postController = {
	// ...
};
```

### Get all posts

`getAllPosts` controller will execute `selectAllPosts` , process the result and respond to client:

```tsx
import { Request, Response } from "express";
import { postModel } from "../model/post.model";

getAllPosts: async (req: Request, res: Response) => {
  try {
    const rst = await postModel.selectAllPosts();
    res.send(rst);
  } catch (err) {
    res.status(500).send({
      message: "Some error occurred while retrieving post list.",
    });
  }
},
```

### Get post by id

`getPostById` controller executes `selectPostById` , process the result and respond to client. Noted that we can extract the `postId` from the `req.params.postId`:

```tsx
getPostById: async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  try {
    const rst = await postModel.selectPostById(postId);
		res.send(rst);
  } catch (err) {
    res.status(500).send({
      message: `Some error occurred while retrieving post ${postId}`,
    });
  }
},
```

### Create new post

`createNewPost` controller executes `insertNewPost` , process the result and respond to client. We can extract `title` and `content` from `req.body` :

```tsx
createNewPost: async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty",
    });
  }

  try {
    const newPost = await postModel.insertNewPost(
      req.body.title,
      req.body.content
    );
    res.send(newPost);
  } catch (err) {
    res.status(500).send({
      message: `Some error occurred while creating new post`,
    });
  }
},
```

### Update post by id

`upatePostById` controller executes `postModel.updatePostById` , process the result and respond to client. We can extract `postId`, `title` and `content` from `req.body` :

```tsx
import { Post } from "../model/post.model";

updatePostById: async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty",
    });
  }

  try {
    const { title, content }: Pick<Post, "title" | "content"> = req.body;
    const updatedPost = await postModel.updatePostById(
      postId,
      title,
      content
    );
    res.send(updatedPost);
  } catch (err) {
    res.status(500).send({
      message: `Some error occurred while updating post ${postId}`,
    });
  }
},
```

### Delete post by id

`deletePostById` controller executes `postModel.deletePostById` , process the result and respond to client. We can extract `postId` from `req.body` :

```tsx
deletePostById: async (req: Request, res: Response) => {
  const postId = Number(req.params.postId);
  try {
    const rst = postModel.deletePostById(postId);
    res.send(rst);
  } catch (err) {
    res.status(500).send({
      message: `Some error occurred while deleting post ${postId}`,
    });
  }
},
```

### Update controllers inside `post.router.ts`

```tsx
// post.router.ts
router.get("/", postController.getAllPosts);
router.get("/:postId", postController.getPostById);
router.post("/", postController.createNewPost);
router.put("/:postId", postController.updatePostById);
router.delete("/:postId", postController.deletePostById);
```

```tsx
// server.ts
import { postRouter } from "./app/router/post.router";
app.use("/post", postRouter);
```

## Test the APIs

We will use [Postman](https://www.postman.com/) to test our APIs.

### Test on GET `/post/`

![sec_8_fig_1.png](/post/crud-express-mysql/sec_8_fig_1.png)

### Test on GET `/post/postId`

![sec_8_fig_2.png](/post/crud-express-mysql/sec_8_fig_2.png)

### Test on POST `/post/`

![sec_8_fig_3.png](/post/crud-express-mysql/sec_8_fig_3.png)

### Test on PUT `/post/postId`

![sec_8_fig_4.png](/post/crud-express-mysql/sec_8_fig_4.png)

### Test on DELETE `/post/postId`

Delete post with id 1:

![sec_8_fig_5.png](/post/crud-express-mysql/sec_8_fig_5.png)

And check with GET `/post/` :

![sec_8_fig_6.png](/post/crud-express-mysql/sec_8_fig_6.png)

## Deploy our server and host the database

### Host the database

Before deploy the server, we have to host the database on the [Clever Cloud](https://www.clever-cloud.com/) platform, and create the another `database` and `table` on the machine which hosted our database.

Login to the [Clever Cloud](https://www.clever-cloud.com/) dashboard, click “an add-on”:

![sec_9_fig_1.png](/post/crud-express-mysql/sec_9_fig_1.png)

Select “MySQL”, choose the “DEV” plan and click next, then you will be navigate to the DB config page. Inside the page, it will show you these information:

![sec_9_fig_2.png](/post/crud-express-mysql/sec_9_fig_2.png)

We will login to the machine by copying the CLI it provides us:

```bash
$ mysql -h b0pxxxxxxxxxxxxx-mysql.services.clever-cloud.com -P 3306 -u uioxxxxxxxxxx -p
> # enter the password here
```

Then you will be logged into mysql on the machine. Then you can switch to the database it provides us:

```bash
mysql> use b0ppnyxxxxxxxxx # the Database Name it provides us
```

Now, create the table just like what we’ve done in **Setup MySQL** section:

```sql
CREATE TABLE post (
	id INT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	content VARCHAR(1000) NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
)
ENGINE=innodb CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;
```

You can also insert some initial data for later API testing:

```sql
INSERT INTO post(title, content) VALUES
('title1', 'content1'),
('title2', 'content2'),
('title3', 'content3'),
('title4', 'content4'),
('title5', 'content5'),
('title6', 'content6');
```

### Deploy the server

After hosting the database and re-created the post table, we can now deploy our server onto [Render](https://render.com/).

Login to the dashboard, create new Web Service:

![sec_9_fig_3.png](/post/crud-express-mysql/sec_9_fig_3.png)

Connect to the Github repo. Then we can start filling out the deploy config:

| Name | crud-express-mysql-demo |
| --- | --- |
| Region | Singapore |
| Branch | main |
| Runtime | Node |
| Build Command | npm run build |
| Start Command | npm run start |
| Instance Type | Free |

For Build Command and Start Command, we will have to add them into the script inside `package.json` :

```json
{
	"build": "npm install && tsc",
  "start": "node ./server.js",
}
```

Now, when running build command, it will first install all NPM packages, then run `tsc` to compile all TypeScript code into JavaScript. Then by running start command, we can use Node to run the compiled `server.js`.

The last step will be filling the environment variables:

| Key | Value |
| --- | --- |
| SERVER_PORT | 8080 |
| DB_HOST | b0pxxxxxxxxxxxxx-mysql.services.clever-cloud.com |
| DB_USER | uioxxxxxxxxxx |
| DB_PASSWORD | u4xxxxxxxxxxx |
| DB_NAME | b0ppnyxxxxxxxxx |

Noted to use the config the [Clever Cloud](https://www.clever-cloud.com/) provides us.

Now click create service, it will start the build and start process. If they all succeeded, you will see these in the log:

![sec_9_fig_4.png](/post/crud-express-mysql/sec_9_fig_4.png)

You can check if the APIs are working well by using the url Render provide you.

Voilà! Our server is now on production. Hope you enjoy and learn something from this article.

### References

1. [创建表时附带的ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic 的解释](https://blog.csdn.net/atu1111/article/details/105654151)
2. [What does character set and collation mean exactly?](https://stackoverflow.com/questions/341273/what-does-character-set-and-collation-mean-exactly)
3. [Build Node.js Rest APIs with Express & MySQL](https://www.bezkoder.com/node-js-rest-api-express-mysql/)
4. [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
5. [What does the function call app.use(cors()) do?](https://stackoverflow.com/questions/46024363/what-does-the-function-call-app-usecors-do)
6. [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
7. [How to Create MySQL Connection with Node JS using Sequelize and Express](https://www.turing.com/kb/mysql-connection-with-node-js-using-sequelize-and-express)
8. [Using MySQL in Node.js with TypeScript](https://dev.to/larswaechter/using-mysql-in-nodejs-with-typescript-ida)
9. [How do I express a date type in TypeScript?](https://stackoverflow.com/questions/45485073/how-do-i-express-a-date-type-in-typescript)
10. [TypeScript type annotation for res.body](https://stackoverflow.com/questions/48027563/typescript-type-annotation-for-res-body)
11. [Deploy Node ExpressJS MySQL to Render](https://www.youtube.com/watch?v=CXiT-DWn1zs)