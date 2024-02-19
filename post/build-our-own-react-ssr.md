---
title: "Build our own React SSR framework"
subtitle: "Build our own SSR framework with React + Vite + Express"
date: "2024-02-19"
tag: "react,typescript,server-side-rendering,ssr,vite,express"
---

In this article, we are going to build our own SSR framework with React + Vite + Express. 

You can think of it as a really simple version of Next.js 12 with the ability to SSR according to the file-routes system, performing client-side route change and user event after hydration. 

Now let’s get started.

### TL:DR

- CSR vs. Traditional SSR
- Introduce React SSR
- Build our React SSR
- SSR with routing
- Wrap up 🚀

## CSR vs. Traditional SSR

### Client Side Rendering

CSR refers to Client Side Rendering. If you are familiar with React, then you are familiar with CSR.

When a user enters a website, browser will get an empty HTML file with a script requesting for our React JS file. 

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- ... -->
  </head>
  <body>
    <div id="root"><!-- we get empty div here --></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

After loading and finish executing the React, React will then mount the entire App to the browser, at this point can the user finally see and interact with the website UI. 

![fig_1.png](/post/build-our-own-react-ssr/fig_1.png)

As you may notice, the rendering of the page content can only starts after React takes over control, this can lead to some drawbacks:

1. Users initially see only empty HTML while waiting React to load and execute, this lead to bad user experience
2. Since empty HTML lacks the website information and body, it’s bad for the SEO.

### Traditional Server Side Rendering

SSR refers to Server Side Rendering. Traditionally, SSR means that when the user enters a website, the server renders the HTML with all the content it needs and respond to the client. This is better for SEO and the “initial” user experience.

Notice that I use “initial”. For the later user interaction, such as route change within the same page, the user will always have to request a new HTML, this can lead to bad interaction experience later.

![fig_2.png](/post/build-our-own-react-ssr/fig_2.png)

### Comparison on CSR and Traditional SSR

|  | CSR | Traditional SSR |
| --- | --- | --- |
| SEO | ❌ 
Empty HTML is bad for SEO. | ✅
Contentful HTML allows browser to crawl the page information. |
| Initial user experience | ❌ 
Empty HTML means empty page UI, which leads to bad initial experience. | ✅
With all the content server-side rendered, user sees a contentful page initially, which leads to better user experience. |
| Subsequent user experience | ✅
React takes over all subsequent user interactions, which is far faster then requesting new HTML every time. | ❌
Every time user navigates to new route, request for new HTML is needed, which is far slower then handling by React. |

![fig_3.png](/post/build-our-own-react-ssr/fig_3.png)

In the next section, we will introduce React SSR, which combines the advantages of traditional SSR and CSR.

## Introduce React SSR

So what do you mean by “React SSR combines the advantages of traditional SSR and CSR”?

Well, the concept behind React SSR is actually a combination of Traditional SSR and CSR.

### Concept of React SSR

When a user enters a website, the server will render the React App into HTML using a method called `renderToString` provided by React and sends the HTML back to the user. With this, user gets a contentful HTML initially.

And since the app is written with JSX, React can simply use the those JSX components on the client side too. This means, when the initial HTML is loaded on the browser, React “hydrates” the same components into the pre-rendered HTML, meaning it attaches client-side logic such as hooks and events onto the HTML, building a copy of vDOM, and taking control of the all subsequent user interactions.

![fig_4.png](/post/build-our-own-react-ssr/fig_4.png)

### Comparison on CSR, Traditional SSR and React SSR

|  | CSR | Traditional SSR | React SSR |
| --- | --- | --- | --- |
| SEO | ❌ 
Empty HTML is bad for SEO. | ✅
Contentful HTML allows browser to crawl the page information. | ✅
Contentful HTML allows browser to crawl the page information. |
| Initial user experience | ❌ 
Empty HTML means empty page UI, which leads to bad initial experience. | ✅
With all the content server-side rendered, user sees a contentful page initially, which leads to better user experience. | ✅
With all the content server-side rendered, user sees a contentful page initially, which leads to better user experience. |
| Subsequent user experience | ✅
React takes over all subsequent user interactions, which is far faster then requesting new HTML every time. | ❌
Every time user navigates to new route, request for new HTML is needed, which is far slower then handling by React. | ✅
React takes over all subsequent user interactions, which is far faster then requesting new HTML every time. |

![fig_5.png](/post/build-our-own-react-ssr/fig_5.png)

Now we know the concepts, in the next section, we will start to build our simple React SSR framework with React, Vite and Express.

## Build our React SSR

In this section, we will build our React SSR with Vite and Express.

Feel free to check the repo [here](https://github.com/alexyin0978/react_ssg_ssr) 👈🏻

### Project setup

Vite actually provides a CLI to setup all we need to build a React SSR.

```bash
$ npm create vite-extra@latest
# Project name: react_ssr_ssg_demo
# Select a template: › ssr-react
# Select a variant: › TypeScript
```

Then run:

```bash
$ cd react_ssr_ssg_demo
$ npm install
$ npm run dev
```

Here is the current project structure:

```bash
.
├── index.html # container HTML
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── server.js # server for HTML requests
├── src
│   ├── App.css
│   ├── App.tsx # our react app 
│   ├── assets
│   │   └── react.svg
│   ├── entry-client.tsx # react for hydration
│   ├── entry-server.tsx # react for rendering react app into HTML on server
│   ├── index.css
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### React SSR flow

When a user enters the website, our server will get a request for HTML, this request is handled by `server.js` . 

`server.js` processes the request, get the `url` and giving it to `entry-server.tsx`, this is where React renders the React components according to the `url` into HTML string using a method called `renderToString`. 

After `server.js` get the HTML string  returned from `entry-server.tsx`, it puts the string into `index.html` and sends back to the browser. Now the user sees the initial rendered HTML.

Parsing the server-rendered HTML, browser will see the script:

```html
<script type="module" src="/src/entry-client.tsx"></script>
```

and requests for our client side react `entry-client.tsx`. After loading client side React, React will “hydrate” the entire vDOM into current HTML, attaching all hooks and events onto it, and taking control over the later user interaction.

![fig_6.png](/post/build-our-own-react-ssr/fig_6.png)

Let’s walk through each file.

### server.js

First, create a server and listen to a port:

```jsx
// server.js

import express from 'express'

// Constants
const port = process.env.PORT || 5173

// Create http server
const app = express()

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
```

Second, Vite provides us Hot Module Reload functionality, which lets us refresh our project when saving files, however, we don’t need this function in production, thus, we will declare a flag to determine whether we are in production mode or not:

```jsx
// server.js

// Constants
const isProduction = process.env.NODE_ENV === 'production'

// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}
```

Third, handle the request from the browser, and server HTML back to browser. We will get the rendered HTML from `entry-server.tsx` here and put it into the `index.html`:

```jsx
// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url, ssrManifest)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})
```

### index.html

For index.html, the content will be replaced by the rendered HTML by `server.js` , and being send back to the browser. Noted that it will request `entry-client.tsx` once being parsed on the browser:

```html
<!--index.html-->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
    <!--app-head-->
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/entry-client.tsx"></script>
  </body>
</html>
```

### entry-server.tsx

For `entry-server.tsx`, what it does for now is to render the React App (JSX) into HTML string using a method provided by `react-dom/server` called `renderToString` :

```tsx
// entry-server.tsx

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './App'

export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  return { html }
}
```

### entry-client.tsx

For `entry-client.tsx`, what it will do is to build a vDOM by the same React App pre-rendered on server and “hydrates” all client side hooks and events into the HTML on the client side. 

One important thing to be noted is that we are using `hydrateRoot` method instead of `createRoot` , with `hydrateRoot` , we are not switching the HTML with our client React rendered App, instead we attach the client side logic into the HTML.

```tsx
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

Server-rendered HTML must have a same DOM tree as the client React DOM tree, or else React will throw a “hydration error” to you in the console.

For example, if the server renders:

```tsx
const html = ReactDOMServer.renderToString(
  <React.StrictMode>
    <div>hihi</div>
  </React.StrictMode>
);
```

While client React renders:

```tsx
ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

You will get a hydration error like this:

![fig_7.png](/post/build-our-own-react-ssr/fig_7.png)

## SSR with routing

For now, our App still lack of routing system, let’s add one to it.

We will mimic the Nextjs file routing system using React Router DOM.

```bash
$ npm i react-router-dom
```

Then create `/pages` folder inside `/src` , add some page components to it:

```bash
.
├── src
│   │
│   └── App.tsx
│   ├── pages
│   │   ├── About.tsx
│   │   └── Home.tsx
```

```tsx
// src/pages/Home.tsx

import { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      this is home page
      <button type="button" onClick={() => setCount(count + 1)}>
        add
      </button>
      <Link to={"/about"}>to about page</Link>
    </div>
  );
};

export default Home;
```

```tsx
// src/pages/About.tsx

import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      this is about page
      <Link to={"/"}>to home page</Link>
    </div>
  );
};

export default About;
```

For `App.tsx`, erase all default content and add some routing logic to it:

```tsx
// src/App.tsx

import { Route, Routes } from "react-router-dom";

// Vite supports importing multiple modules
// from the file system via the special import.meta.glob function
const PagePathsWithComponents = import.meta.glob("./pages/*.tsx", {
  eager: true,
}) as Record<string, Record<any, any>>;

const routes = Object.keys(PagePathsWithComponents).map((path: string) => {
  const name = path.match(/\.\/pages\/(.*)\.tsx$/)![1];

  return {
    name,
    path: name === "Home" ? "/" : `/${name.toLowerCase()}`,
    component: PagePathsWithComponents[path].default,
  };
});

export default function App() {
  return (
    <Routes>
      {routes.map(({ path, component: Component }) => {
        return <Route key={path} path={path} element={<Component />} />;
      })}
    </Routes>
  );
}
```

It imports all files with name `.tsx` as extension, and renders the component with matched route:

```tsx
<Routes>
  {routes.map(({ path, component: Component }) => {
    return <Route key={path} path={path} element={<Component />} />;
  })}
</Routes>
```

In `entry-client.tsx` , wrap the `<App />` with `BrowserRouter` provider just like what we will do in normal CSR react app, this allows user to perform client-side route change when going to another page through `<Link>` provided by React Router DOM: 

```tsx
// entry-client.tsx

import { BrowserRouter } from "react-router-dom";

// ...
ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

In `entry-server.tsx` , however, we will use `StaticRouter` , this is because we will not memorize the route change history when user hit the route directly in the url bar since we don’t have History API like `browserRouter` does in the browser, we will render whole new HTML that matches the current url:

```tsx
// entry-server.tsx

import { StaticRouter } from "react-router-dom/server";

// ...
const html = ReactDOMServer.renderToString(
  <React.StrictMode>
    <StaticRouter location={"/" + url}>
      <App />
    </StaticRouter>
  </React.StrictMode>
);
```

Now when user visit certain page through refresh or typing inside url bar, we will serve them whole new HTML, while navigating through `<Link>` button on browser, we will navigate to new page through client side routing:

![fig_8.gif](/post/build-our-own-react-ssr/fig_8.gif)

## Wrap up 🚀

That’s all for this article, we’ve learned what React SSR solves and how to build our own React SSR with file-routing system.

We still have a lot of functionalities to be built, such as Static Site Generation and pre-fetching data before rendering HTML. We will leave them to the future articles.

That’s it, thank you for reading, hope you enjoy it 🚀.

### Reference

- [React SSR | 從零開始實作 SSR 系列](https://medium.com/%E6%89%8B%E5%AF%AB%E7%AD%86%E8%A8%98/server-side-rendering-ssr-in-reactjs-part1-d2a11890abfc)
- [Vite - Server-Side Rendering](https://vitejs.dev/guide/ssr#server-side-rendering)
- [create-vite-extra/template-ssr-react-ts](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react-ts)
- [How to Build a Server-Side React App Using Vite and Express](https://thenewstack.io/how-to-build-a-server-side-react-app-using-vite-and-express/)
- [Build Your Own SSR/SSG From Scratch with Vite and React](https://ogzhanolguncu.com/blog/react-ssr-ssg-from-scratch)