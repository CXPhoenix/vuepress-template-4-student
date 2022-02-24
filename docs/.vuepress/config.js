const { time } = require("console");
const fs = require("fs");
const path = require("path");

const mdFile = ".md";
const rootFolder = path.dirname(__dirname);
const rootfiles = fs.readdirSync(rootFolder);
const folders = rootfiles.filter(
  (item) => path.extname(item) != mdFile && item != ".vuepress"
);

module.exports = {
  title: "Vuepress template",
  description: "Vuepress 模板",
  themeConfig: {
    navbar: [...getNavBar()],
    // sidebar: { ...getSortedFiles() },
    sidebar: { ...getSideBar() },
  },
};

function getNavBar() {
  const navbar = [];
  folders.forEach((folder) => {
    navbar.push({
      text: folder.toUpperCase(),
      link: `/${folder}/`,
    });
  });
  return navbar;
}

// 依檔案名稱排序
function getSideBar() {
  const sidebar = {};
  folders.forEach((folder) => {
    sidebar[`/${folder}/`] = [];
    const folderFiles = fs.readdirSync(path.join(rootFolder, folder));
    const children = [];
    folderFiles
      .filter((item) => item.toLowerCase() != "readme.md")
      .forEach((file) => {
        children.push(`/${folder}/${file}`);
      });
    sidebar[`/${folder}/`].push({
      text: folder.toUpperCase(),
      children: [`/${folder}/`, ...children],
    });
  });
  return sidebar;
}

// 依編輯時間排序
function getSortedFiles() {
  const children = {};
  folders.forEach((folder) => {
    children[`/${folder}/`] = [];
    const folderFiles = fs
      .readdirSync(path.join(rootFolder, folder))
      .map((fileName) => ({
        name: fileName,
        time: fs
          .statSync(path.join(rootFolder, folder, fileName))
          .mtime.getTime(),
      }))
      .sort((a, b) => a.time - b.time)
      .map((file) => file.name);
    children[`/${folder}/`].push({
      text: folder.toUpperCase(),
      children: [...folderFiles],
    });
  });
  return children;
}
