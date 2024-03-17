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
  nitroApp.hooks.hook("content:file:afterParse", (file) => {

    if (file._id.endsWith(".md") == false) {
      return;
     }
    if (!file.date) {
      // Extract the base name of the file
      const baseName = path.basename(file._file); // '2023-05-16-nuxt3-init-fail'
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

    var baseName = path
      .basename(file._file, path.extname(file._file))
      .toLowerCase();

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

    if (!file || !file._path) {
      console.log(file+"file is null");
    }
  });
});
