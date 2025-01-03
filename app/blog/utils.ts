import fs from "fs";
import path from "path";
import { existsSync } from "fs";

type Metadata = {
  title: string;
  createdDate: string;
  modifiedDate: string;
  summary: string;
  image?: string;
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function preprocessWikiLinks(content) {
  if (!content || typeof content !== "string") return content;

  const wikiLinkRegex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;

  return content.replace(wikiLinkRegex, (fullMatch, path, alias) => {
    if (!path) return fullMatch;

    const displayText = alias || path;
    const postExists = checkPostExists(path.trim());

    if (postExists) {
      const linkHref = `/blog/${path.toLowerCase().trim().replace(/ /g, "-")}`;
      return `[${displayText}](${linkHref})`;
    }

    return displayText;
  });
}

function checkPostExists(filePath: string) {
  const postsDirectory = path.join(process.cwd(), "app", "blog", "posts");
  const filename = `${filePath.toLowerCase().replace(/ /g, "-")}.md`;
  return existsSync(path.join(postsDirectory, filename));
}

export { preprocessWikiLinks };

function getMDFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".md");
}

function readMDFile(filePath) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  let { metadata, content } = parseFrontmatter(rawContent);
  content = preprocessWikiLinks(content);
  return { metadata, content };
}

function getMDData(dir) {
  let mdFiles = getMDFiles(dir);
  return mdFiles.map((file) => {
    let { metadata, content } = readMDFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  return getMDData(path.join(process.cwd(), "app", "blog", "posts"));
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
