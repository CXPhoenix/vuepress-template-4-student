const fs = require("fs");
const path = require("path");
const { title, description, logo } = require("./userConfig.js");

const mdFile = ".md";
const rootFolder = path.dirname(__dirname);
const rootfiles = fs.readdirSync(rootFolder);
const folders = rootfiles.filter(
  (item) => path.extname(item) != mdFile && item != ".vuepress"
);

module.exports = {
  title: title,
  description: description,
  head: [
    [
      "link",
      { rel: "icon", href: "https://v2.vuepress.vuejs.org/images/hero.png" },
    ],
  ],
  themeConfig: {
    logo: logo,
    navbar: [...getNavBar()],
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

function getSideBar() {
  const sidebar = {};
  folders.forEach((folder) => {
    sidebar[`/${folder}/`] = [];
    const folderFiles = fs.readdirSync(path.join(rootFolder, folder));
    const children = [];
    folderFiles
      .filter(
        (item) =>
          item.toLowerCase() != "readme.md" && path.extname(item) === mdFile
      )
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
