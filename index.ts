import { resolve } from 'path';
import fs from 'fs';
import { readdir, readFile, mkdir, writeFile, rm } from 'fs/promises'
import pretty from 'pretty';
import md from 'markdown-it';
const md2Html = new md();

import 'dotenv/config';
import { chdir } from 'process';


//--------------------------------------------------------------------------
// Types
//--------------------------------------------------------------------------

enum DocumentType {
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


const INDEXFILE = "index.md";

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
    if (!fs.existsSync(indexFilePath)) throw `${indexFilePath} doesn't exist.`

    let indexDocument: Document | null = null;

    const dirents = await readdir(path, { withFileTypes: true });
    const children: (Document | Folder)[] = await Promise.all(dirents.map(async (dirent) => {

        const fileName = dirent.name;
        const filePath: string = resolve(path, dirent.name);

        if (!dirent.isDirectory()) {
            const document: Document = await readDocument(filePath);
            if (fileName === INDEXFILE) indexDocument = document;

            return document;

        } else {

            const folder: Folder = await readFiles(filePath);
            return folder;

        }

    }));

    const childresSorted = children.sort((a, b) => {
        return a.title.toUpperCase().localeCompare(a.title.toUpperCase(), 'en', { sensitivity: 'base' });
    });

    if (!indexDocument) throw `${indexFilePath} faled to read index.md`;

    const folderName: string = path.split("/").pop();

    const currentFolder: Folder = {
        path: relativePath,
        children: children,
        title: indexDocument.title,
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

    const absoluteFolderPath = md2html(`${currentFolder.path}/${INDEXFILE}`);

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

    currentFolder.children.map(async (child: Document | Folder) => {

        if (child.type === DocumentType.Document) {

            const doc: Document = child as Document;
            const distPath = md2html(resolve(`${distDir}/${doc.fileName}`));
            const templateParams = { ...baseTemplateParams, title: currentFolder.title, content: md2Html.render(doc.markdown) };
            let html = templateContent;

            const menuHTML = `<li>` + await generateMenuHtml(topFolder, depth, 0) + `</li>`;

            templateParams.menu = menuHTML;
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
        }

    });

}

const md2html = (str: string): string => str.replace(/^(.+)\.md$/, (m, p1) => `${p1}.html`);

//--------------------------------------------------------------------------
// main
//--------------------------------------------------------------------------
const ROOT_PATH = process.env.PAGE_DIR ? resolve(process.env.PAGE_DIR) : resolve('./pages');
const OUTPUT_PATH = process.env.DIST_DIR ? resolve(process.env.DIST_DIR) : resolve('./dist');

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

        l(`Build finished.`);


    } catch (e: any) {
        le(`Stopped with error: ${e}`);
    }

})();
