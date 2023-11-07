---
title: "Beginner’s Vitest with React"
subtitle: "Implement unit tests with Vitest into React app"
date: "2023-11-07"
tag: "react,typescript,vitest,react-testing-library"
---

In this article, I built a simple react app, setup and implemented unit test to it with Vitest.

### TL:DR

- Basic concept of unit testing
- Our simple react app overview
- Vitest setup
- Custom render function
- CASE - basic UI testing with `<App />`
- CASE - global component `<SearchBar>`
- CASE - MSW and React Query hooks
- CASE - `<Posts />` with api call
- Wrap up 🚀
- Reference

## Basic concept of unit testing

Before getting into testing the react app, I want to talk about the very basic concept of unit test.

Let’s take this `sum` function as our example:

```tsx
// sum.ts
export function sum(a: number, b: number) {
  return a + b
}
```

```tsx
// sum.test.ts
import { sum } from "./sum";
import { expect, describe, test } from "vitest";

describe("check if sum works well", () => {
  test("1 add 2 should equal to 3", () => {
    expect(sum(1, 2)).toBe(3);
  });

  test("1 add 3 should not equal to 5", () => {
    expect(sum(1, 3)).not.toBe(5);
  });

  test("1 add 3 should  equal to 4", () => {
    // this assertion will pass:
    expect(sum(1, 3)).toBe(4);

    // this assertion will fail, making the whole test to fail
    expect(sum(1, 3)).toBe(5);
  });
});
```

As you can see from the above test suite, a unit test consists of 3 parts: 

- Description
    - `describe('tests suite name', () => {})`
    - used to name and wrap a series of related tests.
- Test
    - `test('single test name', () => {})`
    - can contain multiple assertions and matchers, if any of the assertion failed, the whole test failed.
- Assertion & Matchers
    - `expect(SOMETHING).ToBe(SOMETHING)`
    - place inside a test
    - if any of the assertion failed, the test failed
    - Assertion refers to `expect`
    - Matchers refers to `.ToBe`

Run the test file and you will see this result showing in the terminal:

```json
// package.json
"scripts": {
  "test": "vitest",
},
```

```bash
# terminal
$ npm run test
```

![fig_1.png](/post/beginners-vitest-with-react/fig_1.png)

Now that we know the basic concept of unit test, let’s dive into our react app.

## Our simple react app overview

Feel free to checkout and clone the branch `starter` [from the repo here](https://github.com/alexyin0978/vitest-starter/tree/starter). We will be using the starter app as template, and implement Vitest into it later.

<!-- TODO: embed .mov type -->
<!-- ![movie_1.mov](/post/beginners-vitest-with-react/movie_1.mov) -->

The app is built by React + Vite + TypeScript, along with two common used libraries: React Router DOM and React Query. 

It contains 3 pages: a Home page, a Posts page and a Post page.

```tsx
// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import App from "./pages/App.tsx";
import Posts from "./pages/Posts.tsx";
import PostPage from "./pages/PostPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/posts/",
    element: <Posts />,
  },
  {
    path: "/posts/:postId",
    element: <PostPage />,
  },
]);

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

Home page contains a button which allows user to navigate to Posts page.

```tsx
// App.tsx
import { useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();

  return (
    <div>
      {'this is Home page'}
      <div>
        {'click here to go to Posts page:'}
        <button onClick={() => navigate("/posts")}>
          {'Go to Posts page'}
        </button>
      </div>
    </div>
  );
}

export default App;
```

Posts page contains a controlled `SearchBar.tsx` and a post list which is fetched from the custom `useGetPostList` hook. 

In `SearchBar.tsx`, user can type into the input to filter the post list, and clear the current input by clicking clear search button.

User can also click each post to navigate to a specific Post page. 

```tsx
// SearchBar.tsx
type SearchBarProps = {
  onChange: (str: string) => void;
  onClear: () => void;
  value: string;
};

const SearchBar = (props: SearchBarProps) => {
  const { onChange, onClear, value } = props;

  return (
    <div>
      {'Search: '}
      <input value={value} onChange={(e) => onChange(e.target.value)} />
      <button style={{ marginLeft: "8px" }} onClick={onClear}>
        {'clear'}
      </button>
    </div>
  );
};

export default SearchBar;
```

```tsx
// Posts.tsx
import { useState } from "react";
import { useNavigate } from "react-router";

import { useGetPostList } from "../hooks";
import SearchBar from "../components/SearchBar";

const Posts = () => {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState<string>("");

  const { data: postList } = useGetPostList();

  const onChange = (str: string) => setKeyword(str);

  const onClear = () => {
    setKeyword("");
  };

  return (
    <div>
      <SearchBar value={keyword} onChange={onChange} onClear={onClear} />
      {!postList ? (
        "loading posts..."
      ) : (
        <>
          {postList
            .filter((post) => {
              if (keyword === "") return true;
              return post.title.includes(keyword);
            })
            .map((post, idx) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  marginTop: "10px",
                  cursor: "pointer",
                  width: "fit-content",
                }}
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <div>{idx}</div>
                <div>{post.title}</div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Posts;
```

Post page is a page to display the post detail, including title and body fetched from the `useGetPost` hook.

```tsx
// PostPage.tsx
import { useParams } from "react-router";
import { useGetPost } from "../hooks";

const PostPage = () => {
  const { postId } = useParams();

  const { data: post } = useGetPost({ postId });

  return (
    <div>
      this is post-page {postId}
      <div>
        {!post ? (
          "loading..."
        ) : (
          <>
            <h3>Title: {post.title}</h3>
            <p>Body: {post.body}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PostPage;
```

As for api, I am going to use [JSONPlaceholder](https://jsonplaceholder.typicode.com/), a public api which we can fetch freely. The endpoints we are going to use are:

```tsx
[GET] https://jsonplaceholder.typicode.com/posts // for PostList page
[GET] https://jsonplaceholder.typicode.com/posts/${postId} // for Post page/
```

```tsx
// api.ts
import { PostType } from "./type";

export const fetchPostList = async () => {
  try {
    const resp = await fetch("https://jsonplaceholder.typicode.com/posts");
    const rst = await resp.json();
    return rst as PostType[];
  } catch (err) {
    return Promise.reject(err);
  }
};

export const fetchPost = async ({ postId }: { postId: string }) => {
  try {
    const resp = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    const rst = await resp.json();

    return rst as PostType;
  } catch (err) {
    return Promise.reject(err);
  }
};
```

```tsx
// type.ts
export type PostType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};
```

I use React Query to help us handle the api response state. Inside `hooks.tsx` file, I create two custom hooks wrapping over `useQuery` , by doing this, we can test the hook without repeating to write the same config inside the test files.

```tsx
import { useQuery } from "@tanstack/react-query";
import { fetchPost, fetchPostList } from "./api";

export const useGetPostList = () =>
  useQuery({
    queryKey: ["fetchPostList"],
    queryFn: () => fetchPostList(),
    refetchOnWindowFocus: false,
    select: (resp) => {
      return resp.slice(0, 15);
    },
  });

export const useGetPost = ({ postId }: { postId: string | undefined }) =>
  useQuery({
    queryKey: ["fetchPost", postId],
    queryFn: () => fetchPost({ postId: postId as string }),
    enabled: postId !== undefined,
    refetchOnWindowFocus: false,
  });
```

The complete project tree looks like this:

```bash
.
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── api.ts 
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   └── SearchBar.tsx
│   ├── hooks.tsx 
│   ├── main.tsx
│   ├── pages
│   │   ├── App.tsx
│   │   ├── PostPage.tsx
│   │   └── Posts.tsx
│   ├── type.ts
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Vitest setup

Now we can start setting up our Vitest environment.

### Install Vitest

Install vitest and add a test command to run it.

```bash
$ npm install -D vitest
```

```json
"scripts": {
  "test": "vitest",
},
```

Now, by running `npm run test` , the command will run over every `*.test.ts` files inside the project, and shows the results in the terminal.

### Install React Testing Library, js-dom and jsdom

Since we are going to test the react component, we need to install `react-testing-library` , `js-dom` and `jsdom`. 

`react-testing-library` provides us a way to render the react component in our test file.

`js-dom` provides lots of useful matcher such as `toBeDisabled` , `toHaveClass` , …etc.

`jsdom` provides an environment for us to run HTML when running our test in the terminal.

```bash
# install jsdom
$ npm install jsdom --save-dev

# install react-testing-library
$ npm install @testing-library/react --save-dev

# install js-dom 
$ npm install @testing-library/jest-dom --save-dev
```

### Set `jsdom` as our test environment

In `vite.config.ts` file, specify the test environment to `jsdom` by doing this:

```tsx
// ...

export default defineConfig({
	// ...
  test: {
    environment: "jsdom",
  },
});
```

You may encounter warning like below:

![fig_2.png](/post/beginners-vitest-with-react/fig_2.png)

Add this line `/// <reference types="vitest" />` into the file and the warning shall resolve:

```tsx
/// <reference types="vitest" />

// ...

export default defineConfig({
	// ...
  test: {
    environment: "jsdom",
  },
});
```

### Setup react-testing-library and extend js-dom matchers

Create a `test` directory under `src/` , and create a `setup.ts` file, write these into the file:

```tsx
// src/test/setup.ts
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// run the cleanup to clear jsdom after every test
afterEach(() => {
  cleanup();
});
```

To enable the matchers `js-dom` provides us, add these into the `setup.ts` :

```tsx
// src/test/setup.ts
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

// ...
```

Lastly, include the setting file into our `vite.config.ts` file, set `globals` to `true` in order to allow all imports from Vitest to be globally, so we don’t have to import the Vitest methods every time.

```tsx
/// <reference types="vitest" />

// ...

// https://vitejs.dev/config/
export default defineConfig({
	// ...
  test: {
		// ...
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
```

Now, try to run `npm run test` to see if any configuration failed, you may encounter this error:

![fig_3.png](/post/beginners-vitest-with-react/fig_3.png)

By doing this inside `setup.ts` can resolve the error:

```tsx
// /src/test/setup.ts
// change:
import matchers from "@testing-library/jest-dom/matchers";

// to this:
import * as matchers from "@testing-library/jest-dom/matchers";
```

You can check the [repo branch “setup”](https://github.com/alexyin0978/vitest-starter/tree/setup) to see the code change in this section.

## Custom render function

Before diving into CASE - basic UI testing with <App /> section, let’s test if we can successfully render the component in the test file first. Let’s use `App.tsx` as our first example. 

### Our first test suite

Create a `App.test.tsx` file next to it. Then write a `describe` to create a test suite:

```tsx
// /src/pages/App.test.tsx
describe("App: UI", () => {});
```

Since we set the test globals to `true` , we don’t have to import `describe` from Vitest, but you may notice an TypeScript warning:

![fig_4.png](/post/beginners-vitest-with-react/fig_4.png)

Add this line into our `tsconfig.json` and the warning shall resolve:

```tsx
// tsconfig.json

{
	// ...,
	"compilerOptions": {
		// ...,
		"types": ["vitest/globals"]
	}
}
```

Now we can use Vitest method without needed to import them in our test files. 

### Custom render function

Before writing assertions, we need to render the target component first.

```tsx
describe("App: UI", () => {
  test("should renders App", () => {
    render(<App />);
  });
});
```

When rendering `<App />` using the `render` method, we will encounter an error:

![fig_5.png](/post/beginners-vitest-with-react/fig_5.png)

This error is basically saying that we are not wrapping React Router DOM provider outside our `<App />`  when rendering it in the test, so the `useNavigate` will throw an error to us. 

As you may deduce, when rendering `<Posts />` and `<PostPage />` , besides React Router DOM error, we will also encounter `useQuery` error threw by React Query.

To fix the bug, we can write a custom render function by ourselves. 

Create a `utils.tsx` file inside `test/` , and write down `wrapPageWithProviders` and `pageRender` functions:

```tsx
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapPageWithProviders = (page: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>{page}</BrowserRouter>
    </QueryClientProvider>
  );
};

export const pageRender = (page: React.ReactElement) => {
  const { rerender, ...result } = render(wrapPageWithProviders(page));

  return {
    ...result,
		// re-writing the rerender function to make it always rerender
		// the wrapPageWithProviders(rerenderPage)
    rerender: (rerenderPage: React.ReactElement) => {
      return rerender(wrapPageWithProviders(rerenderPage));
    },
  };
};
```

In the above code, we create a test-used `queryClient` , then create a wrapper function `wrapPageWithProviders` which wraps the page passed in with the `QueryClientProvider` and `BrowserRouter`, after that, we write a custom render function `pageRender` to render the page with the wrapper. 

Go back to the test file, switch the render method from `render` to `pageRender` , the error should be resolved.

```tsx
import { screen } from "@testing-library/react";
import App from "./App";

import { pageRender } from "../test/utils";

describe("App: UI", () => {
  test("should renders App", () => {
    pageRender(<App />);
  });
});
```

### `screen.debug()` method

If you are not sure if the component you rendered is the right target, maybe you will want to try `screen.debug()`.

It is a useful helper function which logs the DOM rendered in the test inside the terminal. By checking the log, we can make sure we are rendering the right component.

```tsx
import { screen } from "@testing-library/react";

test("should renders App", () => {
  pageRender(<App />);

	screen.debug()
});

// should log the DOM of <App /> inside terminal:
```

![fig_6.png](/post/beginners-vitest-with-react/fig_6.png)

## CASE - basic UI testing with `<App />`

After all this setup, we can finally start testing our react app. 

We will start from the very basic: UI test.

Let’s stick with `App.test.tsx` file. Before writing test, let’s give some `data-testid` to the node inside `App.tsx` component so we can grab specific element and test if they are being rendered.

```tsx
function App() {
	// ...
  return (
    <div data-testid="app">
      {'this is Home page'}
      <div>
        {'click here to go to Posts page:'}
        <button data-testid="app__link" onClick={/*...*/}>
          {'Go to Posts page'}
        </button>
      </div>
    </div>
  );
}
```

```tsx
test("should renders App", () => {
  pageRender(<App />);

  const app = screen.getByTestId("app");
  expect(app).toBeInTheDocument();
});
```

 You may encounter a Typescript warning here:

![fig_7.png](/post/beginners-vitest-with-react/fig_7.png)

Add `@testing-library/jest-dom` into `tsconfig.json` and the warning should be resolved:

```json
// tsconfig.json
{
	"compilerOptions": {
		// ...
    /* Vitest */
    "types": [..., "@testing-library/jest-dom"]
  },
}
```

---

We can also test if the button is being rendered and is clickable:

```tsx
test("should renders link and being able to be clicked", () => {
  pageRender(<App />);

  const link = screen.getByTestId("app__link");
  expect(link).toBeInTheDocument(); // check is being rendered
  expect(link).not.toBeDisabled(); // check is clickable
});
```

You can also test on an element’s children:

```tsx
test("should only have one children node inside app", () => {
  pageRender(<App />);

  const app = screen.getByTestId("app");
  expect(app.children.length).toBe(1);
});
```

You may find that we are repeatedly rendering the same `<App />` in each test cases, Vitest actually provides us a method called `beforeEach` which gives us a way to do something before each tests trigger, in our case, we can render `<App />` before each tests:

```tsx
describe("App: UI", () => {
  beforeEach(() => {
    pageRender(<App />);
  });

  test("should renders App", () => {
    const app = screen.getByTestId("app");
    expect(app).toBeInTheDocument();
  });

  test("should renders link and being able to be clicked", () => {
    const link = screen.getByTestId("app__link");
    expect(link).toBeInTheDocument();
    expect(link).not.toBeDisabled();
  });

  test("should only have one children node inside app", () => {
    const app = screen.getByTestId("app");
    expect(app.children.length).toBe(1);
  });
});
```

You may be thinking: if we need to render the component before each test, shouldn’t we cleanup the DOM afterward so that DOM being rendered in each tests won’t mess up altogether? You are right, be we actually have already done the cleanup inside the `setup.ts` file:

```tsx
// /stc/test/setup.ts

// run the cleanup to clearing jsdom after every test
afterEach(() => {
  cleanup();
});
```

So we don’t have to do the cleanup each time!

![fig_8.png](/post/beginners-vitest-with-react/fig_8.png)

That’s it for the basic UI test. Feel free to checkout the [branch `case/UI` repo here](https://github.com/alexyin0978/vitest-starter/tree/case/UI).

Now we can dive into testing our global component: `SearchBar.tsx` .

## CASE - global component `<SearchBar/>`

In real world react app, we often see global components or shared components, usually all the components’ props are passed from the parent in order to make the components easier to control and reused. 

In this section, I am going to test `<SearchBar />`, which is sort of a global component that we have to pass `onChange` , `onClear` and `value` into it to control it. Let’s get started.

![fig_9.png](/post/beginners-vitest-with-react/fig_9.png)

First things first, let’s write `data-testid` to the target node:

```tsx
// ...

const SearchBar = (props: SearchBarProps) => {
  // ...

  return (
    <div data-testid="search-bar">
      {'Search:'}{" "}
      <input
        data-testid="search-bar__input"
        // ...
      />
      <button
        data-testid="search-bar__clear-btn"
        // ...
      >
        {'clear'}
      </button>
    </div>
  );
};

// ...
```

Create a `SearchBar.test.tsx` file next to it:

```tsx
// SearchBar.test.tsx
import { render } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("globalComponent: SearchBar", () => {
  const mockValue = {
    initValue: "initValue",
    newValue: "newValue",
  };
  const mockProps = {
    onChange: vi.fn(),
    onClear: vi.fn(),
    value: mockValue.initValue,
  };

  beforeEach(() => {
    render(<SearchBar {...mockProps} />);
  });

  // write tests down here...
});
```

Since `<SearchBar />` takes in several props, we will have to mock them by ourselves when rendering the component. `vi.fn()` is a method Vitest provides which help us spy on the function to see if it’s being called.

You may notice the render method we are using here isn’t the custom function `pageRender` we wrote before, this is because inside the `SearchBar />` component, there’s no calling on either `useQuery` , `useNavigate` or hooks from React Query and React Router DOM, so we can render the component with the `render` method React Testing Library provides us.

We will test these several cases:

```tsx
// SearchBar.test.tsx

// these 3 tests are for UI testing
test("should render SearchBar", () => {});
test("should render input", () => {});
test("should render clear button", () => {});

// these 2 tests are for user-event testing
test("should handle input change correctly", () => {});
test("should handle input clear correctly", () => {});
```

Start from testing the container:

```tsx
import { screen } from "@testing-library/react";

test("should render SearchBar", () => {
  const container = screen.getByTestId("search-bar");
  expect(container).toBeInTheDocument();
});
```

Next we test the input UI:

```tsx
test("should render input", () => {
  const input = screen.getByTestId("search-bar__input");
  expect(input).toBeInTheDocument();
  expect(input.getAttribute("placeholder")).toBe(null);
  expect(input).toHaveValue(mockProps.value);
});
```

In the above test, I test if the input has placeholder by checking whether the placeholder is `null` or not; I also check whether the input has the initial value as the props passed in.

Next we test the clear button:

```tsx
test("should render clear button", () => {
  const clearBtn = screen.getByTestId("search-bar__clear-btn");
  expect(clearBtn).toBeInTheDocument();
  expect(clearBtn.innerHTML).toBe("clear");
});
```

In the above test, I also test whether the button contains `"clear"` string inside.

Now that we finish UI test, we can start implement user event tests. Let’s start by the `onChange` event:

```tsx
test("should handle input change correctly", () => {
  const input = screen.getByTestId("search-bar__input");

  fireEvent.change(input, { target: { value: mockValue.newValue } });
  expect(mockProps.onChange).toBeCalledWith(mockValue.newValue);
});
```

First we fire the change event on the `input` with `mockValue.newValue` , then by checking if the `mockProps.onChange` is being called with the `mockValue.newValue` we can know if the `onChange` is being properly called.

Noted that writing this won’t work:

```tsx
expect(input).toHaveValue(mockValue.newValue);
```

![fig_10.png](/post/beginners-vitest-with-react/fig_10.png)

I don’t quit understand the proper reason why the above assertion won’t work. If you check the document of React Testing Library, it actually recommends another library called [user-event](https://testing-library.com/docs/user-event/intro) , which mocks the user event more smoothly. But in this article, we will just stick with `fireEvent`.

Finally, let’s test the `onClear` event:

```tsx
test("should handle input clear correctly", () => {
  const clearBtn = screen.getByTestId("search-bar__clear-btn");
  fireEvent.click(clearBtn);
  expect(mockProps.onClear).toHaveBeenCalledOnce();
});
```

We check whether the `mockProps.onClear`  is being called to see if the click event is properly triggered.

That’s it for this section, feel free to check out the [branch “case/searchBar”](https://github.com/alexyin0978/vitest-starter/tree/case/searchBar) in the repo.

![fig_11.png](/post/beginners-vitest-with-react/fig_11.png)

## CASE - MSW and React Query hooks

Before diving into `<Post />` and `<PostPage />` , I am going to write tests on our two custom React Query hooks: `useGetPostList` and `useGetPost` . What the two hooks do is to fetch the api and return an object including data and the fetch state for us.

### MSW and node version

You might be thinking, should we fetch the same JSONPlaceholder api when running the test on the query hooks? Well, half right, we will be using a library called MSW ( Mock Service Worker ), it’s a library that allows us to mock our own api endpoint and response data. What MSW does, is when fetch an api endpoint, it intercepts the request and return the defined mock response. Knowing the concept, let’s get started.

```bash
# terminal
npm install msw --save-dev
```

Noted that if the node version is lower than 18, MSW will throw an error. If you want to upgrade your node version, you can check this article: [Upgrading Node.js to latest version](https://stackoverflow.com/questions/10075990/upgrading-node-js-to-latest-version).

Also, in case you would like to check the references yourself, the following steps are generally the same as the [msw document](https://mswjs.io/docs/concepts/request-handler#execution-order) and this repo: **[testing-react-query](https://github.com/TkDodo/testing-react-query),** the repo is a Vitest example on testing `useQuery` written by the maintainer of React Query.

### Mock handlers

Let's mock the handlers first, touch a new file called `handlers.ts` inside `test/` , and write down the mocking handlers and responses:

```tsx
// src/test/handlers

import { HttpResponse, http } from "msw";
import { PostType } from "../type";

export const mockPostList: PostType[] = [
  {
    userId: 1,
    id: 1,
    title: "mock title",
    body: "mock body",
  },
  {
    userId: 2,
    id: 2,
    title: "mock title_2",
    body: "mock body_2",
  },
  {
    userId: 3,
    id: 3,
    title: "mock title_3",
    body: "mock body_3",
  },
  {
    userId: 4,
    id: 4,
    title: "mock title_4",
    body: "mock body_4",
  },
  {
    userId: 5,
    id: 5,
    title: "mock title_5",
    body: "mock body_5",
  },
];

export const mockEndpoints = {
  getPostList: "*/posts",
  getPost: "*/posts/:postId",
};

export const handlers = [
  // postList
  http.get(mockEndpoints.getPostList, () => {
    return HttpResponse.json(mockPostList);
  }),
  // post
  http.get(mockEndpoints.getPost, ({ params }) => {
    const { postId } = params;
    return HttpResponse.json(
      mockPostList.find((post) => post.id === Number(postId))
    );
  }),
];
```

### Mock server

After that, go to `src/test/setup.ts` file, setup our mock server there:

```tsx
// src/test/setup.ts

//...

import { setupServer } from "msw/node";

export const server = setupServer(...handlers);

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
```

Noted that `setupServer` is imported from `msw/node` instead of `msw`.

What the mock server does is to intercept the api calls and return the mock response when inside the test environment. Make sure the api endpoints you are hitting has already been defined inside the `handlers` array.

### Testing on query hooks - Success

Create a file called `hook.test.tsx` next to `hook.tsx`, and write this:

```tsx
describe("query hook: useGetPostList", () => {
  test("successful query hook", async () => {
    const { result } = renderHook(() => useGetPostList(), {
      wrapper: createQueryTestWrapper(),
    });
  });

	// ...
});
```

Since the hook only works inside the react component, before writing assertion, we have to render the hook first. React Testing Library provides us a method called `renderHook` in order to test pure hook function. As the above code is written, the hook has to have a wrapper, so let’s create one inside `src/test/urils.tsx` :

```tsx
export const createQueryTestWrapper = () => {
  // reuse createTestQueryClient as we declared in the previous section
	const testQueryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};
```

After creating the hook wrapper, we can start testing the hook:

```tsx
test("successful query hook", async () => {
  const { result } = renderHook(() => useGetPostList(), {
    wrapper: createQueryTestWrapper(),
  });

  // !!NOTE: need to waitFor the query to resolve
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  // then we test the result
  expect(result.current.data?.length).toBe(mockPostList.length);
  if (result.current.data) {
    expect(result.current.data[0].title).toBe(mockPostList[0].title);
    expect(result.current.data[1].title).toBe(mockPostList[1].title);
  }
});
```

Noted that the test will be an async function, since we are going to await the `waitFor` function, which will run the assertion when the query resolved. After query resolved, we can test if the data is defined by checking the length, data content …etc.

### Testing on query hooks - Failure

In order to mock error response from the server, we first have to create an error response inside the test function:

```tsx
test("failure query hook", async () => {
  server.use(
    http.get(mockEndpoints.getPostList, () => {
      return HttpResponse.error();
    })
  );

  // ...
});
```

Noted that the endpoint has to be the same as the endpoint `useGetPostList` is hitting.

Then render the hook:

```tsx
test("failure query hook", async () => {
	// ...

  const { result } = renderHook(() => useGetPostList(), {
    wrapper: createQueryTestWrapper(),
  });

	// ...
});
```

Lastly, we await the result to be resolved, and check if the `isError` is true:

```tsx
test("failure query hook", async () => {
  // ...

  // !!NOTE: need to waitFor the query to resolve
  await waitFor(() => expect(result.current.isError).toBe(true));
  // then we test the result
  expect(result.current.error).toBeDefined();
});
```

The whole test suite for `useGetPostList` is here:

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import { useGetPostList } from "./hooks";
import { createQueryTestWrapper } from "./test/utils";
import { mockEndpoints } from "./test/handlers";
import { server } from "./test/setup";

describe("query hook: useGetPostList", () => {
  test("successful query hook", async () => {
    const { result } = renderHook(() => useGetPostList(), {
      wrapper: createQueryTestWrapper(),
    });

    // !!NOTE: need to waitFor the query to resolve
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // then we test the result
    expect(result.current.data?.length).toBe(mockPostList.length);
    if (result.current.data) {
      expect(result.current.data[0].title).toBe(mockPostList[0].title);
      expect(result.current.data[1].title).toBe(mockPostList[1].title);
    }
  });

  test("failure query hook", async () => {
    server.use(
      http.get(mockEndpoints.getPostList, () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useGetPostList(), {
      wrapper: createQueryTestWrapper(),
    });

    // !!NOTE: need to waitFor the query to resolve
    await waitFor(() => expect(result.current.isError).toBe(true));
    // then we test the result
    expect(result.current.error).toBeDefined();
  });
});
```

---

In this section, we’ve setup the MSW and mock our handlers to test the query hooks, on the next section, we are going to test the `<Posts />` page using the mock handlers we’ve defined here.

I’ve also written the test for `useGetPost` hook, if you’re interested in that, check out the branch [case/msw_reactQuery](https://github.com/alexyin0978/vitest-starter/tree/case/msw_reactQuery) here.

That’s it for this section!

## CASE - `<Posts />` with api call

In this section, we are going to implement tests on `<Posts />` . We are going to test the UI first, then we will await for the fetch call to be resolved or failure, and check if the UI rendered with the response as same as our expectation.

In `<Posts />` , let’s give the target node some testId:

```tsx
// Posts.tsx

// ...

const Posts = () => {
  // ...

  const { data: postList } = useGetPostList();

  return (
    <div data-testid="posts">
      <SearchBar value={keyword} onChange={onChange} onClear={onClear} />
      {!postList ? (
        <div data-testid="posts__loading">{'loading posts...'}</div>
      ) : (
        <div data-testid="posts__list-container">
          {postList
            .filter((post) => {
              if (keyword === "") return true;
              return post.title.includes(keyword);
            })
            .map((post, idx) => (
              <div>
                {/* ... */}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
```

Noted that I added new divs to the loading string and post list as their containers, if we don’t do that, we won’t be able to grab the nodes inside our tests.

After that, I added testId on the outer div, loading div and the post list div. 

Now we can start writing the tests. Let’s test if the outer div is correctly rendered:

```tsx
// Posts.test.tsx
import { screen, waitFor } from "@testing-library/dom";

import { pageRender } from "../test/utils";
import Posts from "./Posts";

describe("Posts: UI", () => {
  test("render loading string initially", () => {
    pageRender(<Posts />);

    const pageContainer = screen.getByTestId("posts");
    expect(pageContainer).toBeInTheDocument();

    const loading = screen.getByTestId("posts__loading");
    expect(loading).toBeInTheDocument();
  });
});
```

We check if the container is correctly rendered, then check if the loading string is also in the document.

After checking the initial UI, we can start test the UI with fetch response. 

How do we mock the fetch-resolve situation? Well, we await the the UI by using the api `findByTestId` React Testing Library provides us. It’s a method which returns a Promise element to us, we can await the UI until it renders the fetch response by using this method.

> The *`findBy`* search variant is used for asynchronous elements which will be there eventually
> 

By awaiting the UI, we can make sure the `useQuery` is being successfully called and resolved, then check if the UI has rendered the `mockPostList` we defined in the previous chapter.

```tsx
// Posts.test.tsx

// ...
import { mockPostList } from "../test/handlers";

// ...

test("render post list after query success", async () => {
  const result = pageRender(<Posts />);

	// await the container first by using findByTestId
  const listContainer = await result.findByTestId("posts__list-container");

  // then check the response content
  expect(listContainer).toBeInTheDocument();
  expect(listContainer.children.length).toBe(mockPostList.length);
});
```

You can also use the `waitFor` method, in this case we do not have to use `findByTestId`, we can simply grab the node by using the `getByTestId` method:

```tsx
import { waitFor } from "@testing-library/dom";

test("render post list after query success", async () => {
  const result = pageRender(<Posts />);

	await waitFor(() => {
	  const listContainer = result.getByTestId("posts__list-container");
	
	  expect(listContainer).toBeInTheDocument();
	  expect(listContainer.children.length).toBe(mockPostList.length);
	});
});
```

After testing on the query success case, we can test on the query failure case:

```tsx
import { mockEndpoints } from "../test/handlers";
import { server } from "../test/setup";
import { HttpResponse, http } from "msw";

test("should still render loading string after query failure", async () => {
  server.use(
    http.get(mockEndpoints.getPostList, () => {
      return HttpResponse.error();
    })
  );

  const result = pageRender(<Posts />);

  await waitFor(() => {
    const loadingString = result.getByTestId("posts__loading");
    expect(loadingString).toBeInTheDocument();
  });
});
```

Just like we did when testing `useGetPostList` failure case, we mock the fetch error here, await the fetch to be rejected by using `waitFor` method, then check if the loading string is still in the document.

I’ve also add tests to `<PostPage />` , it’s a little bit more complicated than `<Posts />` page, since you will have to pass a `mockPostId` into the page in order to trigger the `useGetPost` query to work, but forgive me for skipping the process in this section, the way to test that page is the almost the same as the `<Posts />` page, you can check the [branch case/posts](https://github.com/alexyin0978/vitest-starter/tree/case/posts) to see the complete code.

That’s it for this section.

## Wrap up 🚀

In this article, we’ve only covered some common and basic cases of unit test with Vitest, React Testing Library and MSW. If you are interested in how to test a rather more complicated component with methods provided by React Testing Library, I highly recommend you go read this article: **[React Testing Library Tutorial](https://www.robinwieruch.de/react-testing-library/)** written by ROBIN WIERUCH. It provides more detailed explanations on each methods and use cases.

Feel free to clone the complete code from the [main branch of this repo.](https://github.com/alexyin0978/vitest-starter)

That’s it, hope you enjoy this article, thanks for reading 🛶

### Reference

1. [Vitest - Getting Started](https://vitest.dev/guide/#getting-started)
2. [{JSON} Placeholder](https://jsonplaceholder.typicode.com/)
3. [Vitest with React Testing Library](https://www.robinwieruch.de/vitest-react-testing-library/)
4. [Vitest defineConfig, 'test' does not exist in type 'UserConfigExport'](https://stackoverflow.com/questions/72146352/vitest-defineconfig-test-does-not-exist-in-type-userconfigexport)
5. [@testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom#with-vitest)
6. [Using Testing Library jest-dom with Vitest](https://markus.oberlehner.net/blog/using-testing-library-jest-dom-with-vitest/)
7. [Export Vitest extend-expect](https://github.com/testing-library/jest-dom/issues/439)
8. [testing-react-query](https://github.com/TkDodo/testing-react-query)
9. [React Testing Library Tutorial](https://www.robinwieruch.de/react-testing-library/)
10. [testing-library-User Interactions-Introduction](https://testing-library.com/docs/user-event/intro/)
11. [Mock Service Worker](https://mswjs.io/)
12. [MSW-http](https://mswjs.io/docs/api/http#standard-methods)
13. [MSW-Debugging runbook](https://mswjs.io/docs/runbook/)
14. [Upgrading Node.js to latest version](https://stackoverflow.com/questions/10075990/upgrading-node-js-to-latest-version)