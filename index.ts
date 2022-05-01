import { resolve } from 'path';
import fs from 'fs';
import { readdir, readFile, mkdir } from 'fs/promises'
import formatHtml from 'html-format';

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

    const relativePath = `/${path.replace(rootPath, "")}`;

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

    const currentFolder: Folder = {
        path: relativePath,
        children: children,
        title: indexDocument.title,
        type: DocumentType.Folder
    }

    return currentFolder;
}

const readDocument = async (path: string): Promise<Document> => {
    if (!fs.existsSync(path)) throw `${path} doesn't exist.`;
    const fileContent = await readFile(path, 'utf8');

    const relativePath: string = path.replace(rootPath, "");
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

const generateMenuHtml = async (currentFolder: Folder): Promise<string> => {

    let template = `<ul>`;
    template += `<li><a href="${md2html(currentFolder.path)}">${currentFolder.title}</a></li>`;

    for (const [index, child] of currentFolder.children.entries()) {
        if (child.type === DocumentType.Document) {
            template += `<li><a href="${md2html(child.path)}">${child.title}</a></li>`;
        } else if (child.type === DocumentType.Folder) {
            const childContent = await generateMenuHtml(child as Folder);
            template += childContent;
        }

    }

    template += `</ul>`;

    return template;
}

const generateFiles = async (currentFolder: Folder, templateParams: any): Promise<void> => {
    const templateFilePath = resolve("./template/index.html");
    const templateContent = await readFile(templateFilePath, 'utf8');

    currentFolder.children.map(async (child: Document | Folder) => {

        if (child.type === DocumentType.Document) {



        }

    });


}

const md2html = (str: string): string => str.replace(/^(.+)\.md$/, (m, p1) => `${p1}.html`);

//--------------------------------------------------------------------------
// main
//--------------------------------------------------------------------------
const rootPath = process.env.PAGE_DIR ? resolve(process.env.PAGE_DIR) : resolve('./pages');
const outputPath = process.env.DIST_DIR ? resolve(process.env.DIST_DIR) : resolve('./dist');

(async () => {

    try {

        l(`Build started.`);

        // Check existance
        if (!fs.existsSync(rootPath)) throw `${rootPath} doesn't exist.`
        if (!fs.existsSync(outputPath)) {
            await mkdir(outputPath);
        }

        const entireFileStructure: Folder = await readFiles(rootPath);

        // generate html
        const templateFilePath = resolve("./template/index.html");
        if (!fs.existsSync(templateFilePath)) throw `template/index.html doesn't exist.`

        const menuHtml = await generateMenuHtml(entireFileStructure);
        await generateFiles(entireFileStructure, {
            menu: menuHtml,
        });

        l(entireFileStructure);

    } catch (e: any) {
        le(`Stopped with error: ${e}`);
    }

})();
