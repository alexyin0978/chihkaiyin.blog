import fs from "fs";

fs.readdir(`${process.cwd()}/post`, (err, fileNames) => {
  if (err) {
    console.log(err);
  }

  fileNames.forEach((file, idx) => {
    if (idx === 1) {
      console.log("file: ", file);

      fs.readFile(`${process.cwd()}/post/${file}`, "utf8", (err, content) => {
        if (err) {
          console.log("err: ", err);
        }

        console.log("content: ", content);
      });
    }
  });
});

export default function Home() {
  return <div>Hello world</div>;
}
