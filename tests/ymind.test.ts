// @vitest-environment nuxt
import { test } from "vitest";
import fs from "fs";
import path from 'path'; 
test("mytest", () => {
    const filePath = path.join(__dirname, "../content/art/像素画入门.ymind");
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) throw err;
    var rawContent =  JSON.parse(data)
  
   console.log(JSON.stringify(rawContent, null, 2))
  });
});
