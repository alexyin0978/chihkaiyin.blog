---
title: "Setup and deploy an express typescript server"
subtitle: "Tutorial on how to setup and deploy an express typescript server."
date: "2023-10-15"
---

### TL:DR

- Initialization
- Install nodemon and ts-node
- Setup express server
- push to github
- deploy the project
- references

## Initialization

To start a new express project, make a new directory and run `npm init -y` , this will touch a `package.json` and `pack-lock.json` for our new project.

```tsx
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
  "license": "ISC"
}
```

Then touch a `server.ts` , log a “test” message, and run the file using node ( define the script first )

```tsx
// server.ts

console.log("test");
```

```tsx
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

npm i nodemon --save-dev
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
	"dev_nodemon": "nodemon server.ts" // define how we execute the file
},
"devDependencies": {
  "nodemon": "^3.0.1"
}

// then run "npm run dev_nodemon", 
// and then...
```

Oops, we shall encounter some errors here:

```tsx
[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node server.ts`
sh: ts-node: command not found
[nodemon] failed to start process, "ts-node" exec not found
[nodemon] Error
```

The above command is bascly saying, since the extension of our `server.ts` is `ts` , it is going to use `ts-node` to run the file instead, but `ts-node` command is not found.

So, we need to install `ts-node` first.

```tsx
npm i --save-dev ts-node

// and re-run
npm run dev_node

// now the error should be resolved
```

## Setup express server

### Install express

Now we can start setting up our express server.

First, run `npm i express` to install express, then import `express` inside our `server.ts`

```tsx
import express from 'express';
```

We shall encounter another typescript error:

```tsx
TSError: ⨯ Unable to compile TypeScript:
server.ts:1:21 - error TS7016: 
Could not find a declaration file for module 'express'. 
'/node_modules/express/index.js' implicitly has an 'any' type.
Try `npm i --save-dev @types/express` if it exists 
or add a new declaration (.d.ts) file containing `declare module 'express';`
```

This is because we didn’t install the type of express, run `npm i --save-dev @types/express` and this error should be resolved.

### Setting up the app

we can setup our app and define the port to be listened now.

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

The app should run correctly now, but you will find that `process.env.PORT` is `undefined` .

To solve the problem, install `dotenv` and configure it inside our `server.ts`

```tsx
npm install dotenv --save
```

```tsx
// server.ts

import dotEnv from 'dotenv';
dotEnv.config();
```

Now we shall see our app is listening to port 5001 as we defined inside `.env` file.