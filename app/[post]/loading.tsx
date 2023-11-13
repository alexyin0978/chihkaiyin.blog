import React, { Fragment } from "react";

const PARAGRAPH_LINE_COUNT = 5;

export default function Loading() {
  return (
    <div
      role="status"
      className="max-w-full animate-pulse mt-14"
    >
      <header className="mb-7">
        <div className="h-8 bg-gray-400 rounded-full dark:bg-gray-700 w-full max-w-md mb-2" />
        <div className="h-8 bg-gray-400 rounded-full dark:bg-gray-700 w-full max-w-[160px] mb-2" />
        <div className="h-3 bg-gray-400 rounded-full dark:bg-gray-700 max-w-[120px] my-1" />
      </header>
      <main className="mt-4">
        {Array.from(Array(PARAGRAPH_LINE_COUNT).keys()).map((num) => (
          <Fragment key={num}>
            <div className="h-3 bg-gray-400 rounded-full dark:bg-gray-700 my-2" />
            <div className="h-3 bg-gray-400 rounded-full dark:bg-gray-700 max-w-[330px] my-2" />
            <div className="h-3 bg-gray-400 rounded-full dark:bg-gray-700 max-w-[300px] my-2" />
            <div className="h-3 bg-gray-400 rounded-full dark:bg-gray-700 max-w-[360px] my-2" />
          </Fragment>
        ))}
      </main>
    </div>
  );
}
