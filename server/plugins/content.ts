import path from "path";
import pinyin from "tiny-pinyin";
export default defineNitroPlugin((nitroApp) => {
  //运行的时候会对所有的md文件进行缓存.所以测试的时候需要把.nuxt/content-cache删除掉
  //或者单独更改某个.md文件会重新生成该文件的缓存
  nitroApp.hooks.hook("content:file:beforeParse", (file) => {
    if (file._id.endsWith(".md") == false) {
      return;
    }
    file.body = file.body.replace(/\(.*?\/public\//g, "(/");
  });

  // 解析文件后，对文件进行修改
  nitroApp.hooks.hook(
    "content:file:afterParse",
    (file: {
      _id: string;
      date: string;
      _file: string;
      _path: string;
      description: any;
      body: string;
    }) => {
      if (file._id.endsWith(".md") == false) {
        return;
      }
      var baseName = path
        .basename(file._file, path.extname(file._file))
        .toLowerCase();

      if (!file.date) {
        // Split the base name to separately get the date and the file name part
        const parts = baseName.split("-");
        // Extract the year, month, and day from the parts
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        if (!isNaN(Number(year))) {
          file.date = year + "-" + month + "-" + day;
        } else {
          file.date = "1999-01-01";
        }
        // console.log(file._file,file.date);
      }

      if (file._path && file._path.toLowerCase().includes(baseName) == false) {
        // Split by '/' to get segments
        let segments = file._file.split("/");
        // Replace the last segment with `pinyinResult`
        segments[segments.length - 1] = pinyin
          .convertToPinyin(baseName)
          .toLowerCase();
        // Join the segments back together with '/'
        file._path = "/" + segments.join("/");
        //console.log(file._path, file._file);
      }
      //content模块提取的规则是##等前方的文字..如果标题下方直接是#等是没有descriptiond的
      if (!file.description || file.description == "" || file.description.length <20) {
        file.description = extractTextValues(file);
      }
    }
  );
});

function extractTextValues(json: any) {
  let result = "";
  const extractText = (node: any) => {
    if (result.length > 200) return;
    if (node.type === "text") {
      result += node.value;
    } else if (node.children && Array.isArray(node.children)) {
      node.children.forEach(extractText);
    }
    if (result.length > 200) {
      result = result.slice(0, 200); // Truncate to 200 chars if over the limit
    }
  };

  extractText(json.body);
  return result;
}
