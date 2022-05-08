import { resolve } from 'path';
import fs from 'fs';
import { readdir, readFile, mkdir, writeFile, rm, copyFile } from 'fs/promises'
import pretty from 'pretty';
import md from 'markdown-it';
import sass from 'node-sass';
import hljs from 'highlight.js';
import markdownItHtml5Embed from 'markdown-it-html5-embed';
import markdownItImageSize from 'markdown-it-imsize';
import markdownItVideo from 'markdown-it-video';
import markdownItEmoji from 'markdown-it-emoji';
import markdownItSup from 'markdown-it-sup';
import markdownItIns from 'markdown-it-ins';
import markdownItMark from 'markdown-it-mark';
import markdownItDeflist from 'markdown-it-deflist';
import markdownItAbbr from 'markdown-it-abbr';
import markdownItContainer from 'markdown-it-container';

const md2Html = new md("default", {
    highlight: (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(str, { language: lang }).value;
            } catch (__) { }
        }

        return ''; // use external default escaping
    }
});

md2Html.use(markdownItHtml5Embed, {
    html5embed: {
        useImageSyntax: true, // Enables video/audio embed with ![]() syntax (default)
        useLinkSyntax: true   // Enables video/audio embed with []() syntax
    }
}).use(markdownItImageSize)
    .use(markdownItVideo)
    .use(markdownItEmoji)
    .use(markdownItSup)
    .use(markdownItIns)
    .use(markdownItMark)
    .use(markdownItDeflist)
    .use(markdownItAbbr)
    .use(markdownItContainer);

import 'dotenv/config';
import { chdir } from 'process';


//--------------------------------------------------------------------------
// Types
//--------------------------------------------------------------------------

enum DocumentType {
    ASSET,
    Document,
    Folder
}

type Folder = {
    title: string;
    path: string;
    children: (Document | Folder)[] | undefined;
    folderName: string;
    type: DocumentType;
}

type Document = {
    title: string;
    path: string;
    markdown: string;
    fileName: string;
    type: DocumentType;
}


const INDEXFILE = "00.index.md";
const ParsableDocumentExtensions = ["md"];
//--------------------------------------------------------------------------
// Functions
//--------------------------------------------------------------------------

const l = console.log;
const le = console.error;
const lw = console.warn;

// read files and folder recursively and put everything in one Folder model
const readFiles = async (path: string): Promise<Folder> => {

    const relativePath = `${path.replace(ROOT_PATH, "")}`;

    // check index.md existance
    const indexFilePath = `${path}/${INDEXFILE}`;
    if (!fs.existsSync(indexFilePath)) {
        lw(`${indexFilePath} doesn't exist. This folder will not be rendered in the menu.`);
    }

    let indexDocument: Document | null = null;

    const dirents = await readdir(path, { withFileTypes: true });
    const children: (Document | Folder)[] = await Promise.all(dirents.map(async (dirent) => {

        const fileName = dirent.name;
        const filePath: string = resolve(path, dirent.name);

        if (!dirent.isDirectory()) {
            const extension = filePath.split(".").pop();
            if (ParsableDocumentExtensions.find(ex => ex === extension)) {

                // parse document 
                const document: Document = await readDocument(filePath);
                if (fileName === INDEXFILE) indexDocument = document;
                return document;

            } else {

                // assets
                return {
                    path: relativePath,
                    title: fileName,
                    markdown: null,
                    fileName: fileName,
                    type: DocumentType.ASSET
                }

            }

        } else {

            const folder: Folder = await readFiles(filePath);
            return folder;

        }

    }));

    const childresSorted = children.filter(obj => !!obj).sort((a, b) => {
        return a.title.toUpperCase().localeCompare(a.title.toUpperCase(), 'en', { sensitivity: 'base' });
    });

    const folderName: string = path.split("/").pop();

    const currentFolder: Folder = {
        path: relativePath,
        children: childresSorted,
        title: indexDocument?.title || "",
        folderName: folderName,
        type: DocumentType.Folder
    }

    return currentFolder;
}

const readDocument = async (path: string): Promise<Document> => {
    if (!fs.existsSync(path)) throw `${path} doesn't exist.`;
    const fileContent = await readFile(path, 'utf8');

    const relativePath: string = path.replace(ROOT_PATH, "");
    const fileName: string = path.split("/").pop();

    // get first line of the content
    const lines: string[] = fileContent.split("\n");
    if (lines.length === 0)
        throw `Syntax error: ${path} Must have at least one line`;

    const firstLine: string = lines[0];
    if (firstLine.length === 0)
        throw `Syntax error: ${path} First line must not be empty.`;

    const filteredTitle = firstLine.replace(/#/g, "").trim();

    return {
        path: relativePath,
        title: filteredTitle,
        markdown: fileContent,
        fileName: fileName,
        type: DocumentType.Document
    }

}

const generateMenuHtml = async (currentFolder: Folder, baseDepth: number, currentDepth: number): Promise<string> => {

    const relativePathPrefix = baseDepth > 0 ? [...Array(baseDepth)].reduce(res => `../${res}`, "") : "./";
    const absoluteFolderPath = `${currentFolder.path}/index.html`;

    let template = ``;
    template += `<li><a href="${relativePathPrefix}${absoluteFolderPath.substring(1)}">${currentFolder.title}</a>`;
    template += `<ul>`;

    for (const [index, child] of currentFolder.children.entries()) {

        if (new RegExp(`\/${INDEXFILE}$`).test(child.path)) continue;

        const absolutePath = md2html(child.path);
        if (child.type === DocumentType.Document) {

            // add relative path prefice ("../") and remove first "/" from original path
            template += `<li><a href="${relativePathPrefix}${absolutePath.substring(1)}">${child.title}</a></li>`;
        } else if (child.type === DocumentType.Folder) {
            const childContent = await generateMenuHtml(child as Folder, baseDepth, currentDepth + 1);
            template += childContent;
        }

    }

    template += `</ul>`;
    template += `</li>`;

    return template;
}

const generateFiles = async (topFolder: Folder, currentFolder: Folder, baseTemplateParams: any): Promise<void> => {
    const templateFilePath = resolve("./template/index.html");
    const templateContent = await readFile(templateFilePath, 'utf8');
    const distDir = resolve(`${OUTPUT_PATH}${currentFolder.path}`);
    const depth = baseTemplateParams?.depth || 0;
    const relativePathPrefix = depth > 0 ? [...Array(depth)].reduce(res => `../${res}`, "") : "./";

    currentFolder.children.map(async (child: Document | Folder) => {

        if (child.type === DocumentType.Document) {

            const doc: Document = child as Document;

            if (doc.fileName == INDEXFILE) doc.fileName = "index.html";

            const distPath = md2html(resolve(`${distDir}/${doc.fileName}`));
            const templateParams = { ...baseTemplateParams, title: currentFolder.title, content: md2Html.render(doc.markdown) };
            let html = templateContent;

            const menuHTML = `<ul class="top">` + await generateMenuHtml(topFolder, depth, 0) + `</ul>`;

            templateParams.menu = menuHTML;
            templateParams.styleSheetPath = `${relativePathPrefix}${STYLESHEET_NAME}`;

            Object.keys(templateParams).forEach((key: string) => {
                const val = templateParams[key];
                html = html.replace(new RegExp(`\{\{${key}\}\}`, 'g'), val);
            })

            await writeFile(distPath, pretty(html), 'utf-8');

        } else if (child.type === DocumentType.Folder) {
            const folder: Folder = child as Folder;
            const distPath = resolve(`${distDir}/${folder.folderName}`);
            await mkdir(distPath);
            await generateFiles(topFolder, folder, { ...baseTemplateParams, depth: depth + 1 });
        } else if (child.type === DocumentType.ASSET) {
            const doc: Document = child as Document;
            const origPath = resolve(`${ROOT_PATH}/${doc.path}/${doc.fileName}`);
            const distPath = resolve(`${distDir}/${doc.fileName}`)

            await copyFile(origPath, distPath);
        }

    });

}

const md2html = (str: string): string => str.replace(/^(.+)\.md$/, (m, p1) => `${p1}.html`);

//--------------------------------------------------------------------------
// main
//--------------------------------------------------------------------------
const ROOT_PATH = process.env.PAGE_DIR ? resolve(process.env.PAGE_DIR) : resolve('./pages');
const OUTPUT_PATH = process.env.DIST_DIR ? resolve(process.env.DIST_DIR) : resolve('./dist');
const STYLESHEET_NAME = "style.css";

(async () => {

    try {

        l(`Build started.`);

        // Check existance
        if (!fs.existsSync(ROOT_PATH)) throw `${ROOT_PATH} doesn't exist.`
        if (fs.existsSync(OUTPUT_PATH)) {
            await rm(OUTPUT_PATH, { recursive: true, force: true })
        }

        await mkdir(OUTPUT_PATH);
        const entireFileStructure: Folder = await readFiles(ROOT_PATH);

        // generate html
        const templateFilePath = resolve("./template/index.html");
        if (!fs.existsSync(templateFilePath)) throw `template/index.html doesn't exist.`

        await generateFiles(entireFileStructure, entireFileStructure, {
            depth: 0
        });

        const templateStyleFilePath = resolve("./template/style.scss");
        if (!fs.existsSync(templateStyleFilePath)) throw `template/style.scss doesn't exist.`

        // build sass
        sass.render({
            file: './template/style.scss',
        }, (err, result) => {

            fs.writeFileSync(`${OUTPUT_PATH}/${STYLESHEET_NAME}`, result.css);

            if (err) {
                le(err);
                throw "Failed to compile scss";
            }

        });

        l(`Build finished.`);


    } catch (e: any) {
        le(`Stopped with error: ${e}`);
    }

})();
