---
title: "Hello World Express TypeScript server"
subtitle: "In this article, I record all the steps I took and bugs I bombed into while setting up and deploying an express typescript server."
date: "2023-10-18"
tag: "express,typescript,npm"
---

In this article, I record all the steps I took and bugs I bombed into while setting up and deploying an express typescript server.

### TL:DR

- Initialization
- Install nodemon and ts-node
- Setup express server
- Deploy the project, fix typescript bug
- References

## Initialization

To start a new typescript project, make a new directory and run `npm init -y` , this will touch a `package.json` and `pack-lock.json` for our new project.

Then install typescript into the project by running `npm intall typescript` .

Now our `package.json` should look like this:

```json
// package.json
{
  "name": "Your_Dir_Name",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
	"dependencies": {
    "typescript": "^5.2.2"
  }
}
```

Then touch a `server.ts` , log a “test” message, and run the file using node ( define the script first )

```tsx
// server.ts

console.log("test");
```

```json
// package.json

"scripts": {
	"dev": "node server.ts" // tell npm to execute the file using node
}

// then run "npm run dev" in the terminal
// it should log the message "test"
```

## Install nodemon and ts-node

Next, we’re going to install nodemon, it allows us to re-run our server every time we save our file.

```tsx
// terminal

$ npm i nodemon --save-dev
// --save-dev tells npm that the package is installed in devDependencies 
// which means it will only be used in development, not on production
```

```tsx
// package.json

"devDependencies": {
  "nodemon": "^3.0.1"
}
```

Add a new command in the script to tell npm we are going to use nodemon to run our file.

```tsx
// package.json

"scripts": {
	"dev:watch": "nodemon server.ts" // define how we execute the file
},
"devDependencies": {
  "nodemon": "^3.0.1"
}

// then run "npm run dev:watch", 
// and then...
```

Oops, we shall encounter some errors here:

```bash
[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node server.ts`
sh: ts-node: command not found
[nodemon] failed to start process, "ts-node" exec not found
[nodemon] Error
```

The above command is basically saying that since the file `server.ts` we are running is typescript , it is going to use `ts-node` to run the file instead, but `ts-node` command is not found.

So, we need to install `ts-node` first.

```bash
$ npm i --save-dev ts-node

// and re-run
$ npm run dev:watch
```

Now the error should be resolved, and every time we save the file, it should automatically log the `"test"` for us.

## Setup express server

### Install express

Now we can start setting up our express server.

First, run `npm i express` to install express, then import `express` inside our `server.ts`

```tsx
import express from 'express';
```

We shall encounter another typescript error:

```bash
TSError: ⨯ Unable to compile TypeScript:
server.ts:1:21 - error TS7016: 
Could not find a declaration file for module 'express'. 
'/node_modules/express/index.js' implicitly has an 'any' type.
Try `npm i --save-dev @types/express` if it exists 
or add a new declaration (.d.ts) file containing `declare module 'express';`
```

This is because we didn’t install the type of express, run `npm i --save-dev @types/express` and this error should be resolved.

### Setting up the app

we can now setup our app and define the port to be listened to.

First, let’s create a `.env` file and define our port in it.

```tsx
// .env

PORT=5001
```

Then setup our app server.

```tsx
// server.ts

const app = express();
const port = process.env.PORT || 5000;

console.log(process.env.PORT);

app.listen(port, () => {
	console.log(`app is listening to port: ${port}`);
});
```

### Configure .env file

The app should run correctly now, but you will probably find out that `process.env.PORT` is `undefined` .

To solve the problem, install `dotenv` and configure it inside our `server.ts`

```bash
$ npm install dotenv --save
```

```tsx
// server.ts

import dotEnv from 'dotenv';
dotEnv.config();
```

Now we shall see our app is listening to port 5001 as we defined inside `.env` file.

### Write a simple GET route

```jsx
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (rep, res) => {
  res.send("hello world");
});

app.listen(port, () => {
	console.log(`app is listening to port: ${port}`);
});
```

Open the browser, go to `http://localhost:5001` , now we should see the `hello world`

## Deploy the project, fix typescript bug

Now that we finish developing our simple app, we can deploy the app to a platform called [Render](https://render.com/). Render is a platform which provides free service for us to host our app.

But before we deploy the app, we need to push the project to Github first.

### Push Our Project to Github

Let’s create a repo first. Go to your Github account, add new repository, and create the repo.

After creating the repo, we now initialize git inside our express project, add the repo to the remote branch of the project.

```bash
# open terminal inside the project
$ git init
$ git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_PROJECT_NAME.git
```

Before pushing all the files to Github, let’s create a `.gitignore` file, add `.env` and `node_modules` into it. 

```bash
# .gitignore
.env
node_modules
```

Let me explain why we add these two files to `.gitignore` .

`.env` usually stores some important information such as private key, which we don’t want people to know, so we usually config all the .env variables where we host our app; as for `node_modules` , they are the dependencies of the project, NPM can manage and install those dependencies for us by checking the `package.json` and `package-lock.json` every time we run `npm install` inside our project, so there’s no need to push them to Github.

After the adding, push all the files to the repo.

```bash
$ git add -A
$ git commit -m "push all files to repo"
$ git push --set-upstream origin main
```

Go to the repo and check if the files are pushed to it.

By the way, here’s the [repo](https://github.com/alexyin0978/express-ts) for this article, go and check it out.

### Deploy project to Render

Let’s start out deployment. Go to Render, add new web service, choose “Build and deploy from a Git repository”, then connect the repo we’ve just pushed to Github, you can connect the repo by entering its link if the repo is public.

Next step, enter the deployment config:

1. Name: express-ts
2. Region: Singapore
3. Branch: main
4. Runtime: Node
5. Build Command: npm install 
6. Start Command: npm run dev 
7. Click Advanced, then click Add Environment Variable, here we can add our .env variables:
    1. Key: PORT
    2. value: 5001

Then click Create Web Service, it will start installing project dependencies and build the project for us.

BUT, Oops, an error shall appear inside the building logs:

```bash
$ Running 'npm run dev'
$ > express-ts@1.0.0 dev /opt/render/project/src
$ > node server.ts
$ (node:63) Warning: To load an ES module, set "type": "module" in the package.json or use the .mjs extension
```

This happens because we forgot to compile typescript file into javascript file, no engine can run typescript directly, so remember to always compile `.ts` files into `.js` files before we actually runs it during the deployment. Let’s add some typescript config to fix this.

### Create tsconfig.json

Let’s initialized a `tsconfig.json` , it configs the command `tsc` which allows us to compile typescript into javascript. 

```bash
# terminal
$ npx tsc -init
```

After this command, our project should now looks like this:

```bash
.
├── package-lock.json
├── package.json
├── server.ts
└── tsconfig.json # the command should add tsconfig.json for us
```

For this simple project, we actually don’t need to do anything inside the `tsconfig.json`.

Now we can add `tsc` command inside the package.json.

```json
"scripts": {
  "tsc": "tsc",
},
```

Try to run `npm run tsc` , and you should see server.js appears inside our project.

```bash
.
├── package-lock.json
├── package.json
├── server.ts
├── server.js # over here!! It is compiled from server.ts
└── tsconfig.json
```

### Compile while building

Now we can go back to Render.

Before we re-deploy again, we should add `tsc` into our `package.json` script so as to compile during the deployment. Also, we should run `server.js` during the deployment instead. Let’s do a little modification in our script:

```json
// package.json

"scripts": {
  "build": "npm install && tsc",
  "start": "node server.js",
},
```

Then inside Render configuration, let’s change our Build Command to `npm run build` and Start Command to `npm run start` .

1. Build Command: npm run build
2. Start Command: npm run start

In this case, Render will execute `npm run build` which runs `npm install` then `tsc` to compile our `.ts` files under the hood, after that, it will run `npm run start` which runs `node server.js` for us.

```bash
$ app is listening to port: 5001
$ Your service is live 🎉
```

Voilà! Our server should now been successfully deployed. Go visit the link Render provides you, you should see the `Hello World` string when you open the page. Congrats!

### References

1. **[Node process.env.VARIABLE_NAME returning undefined](https://stackoverflow.com/questions/44915758/node-process-env-variable-name-returning-undefined)**
2. **[How to deploy a TS Node.js app in minutes](https://medium.com/nmc-techblog/how-to-deploy-a-ts-node-js-app-in-minutes-e3ab17ab0673)**