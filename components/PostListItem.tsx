import React from "react";
import Link from "next/link";
import { Merriweather } from "next/font/google";
import { Montserrat } from "@next/font/google";

import { PostMetaData } from "@/utils/readPost";

const merriweather = Merriweather({
  weight: "400",
  subsets: ["latin"],
});

const montserrat = Montserrat({ subsets: ["latin"] });

export function PostListItem(props: PostMetaData) {
  const { title, date, subtitle, fileName } = props;

  return (
    <article
      data-testid="home__main__article"
      className={`mt-14 text-black dark:text-white ${merriweather.className}`}
    >
      <header>
        <h3
          className={`text-3xl font-extrabold text-header dark:text-header_dark ${montserrat.className}`}
        >
          <Link
            data-testid="home__main__article__link"
            href={`/${fileName}`}
          >
            {title}
          </Link>
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <small
            className="text-xs"
            data-testid="home__main__article__date"
          >
            {date}
          </small>
        </div>
      </header>
      <p
        data-testid="home__main__article__subtitle"
        className="mt-2"
      >
        {subtitle}
      </p>
    </article>
  );
}
