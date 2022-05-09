import { resolve } from 'path';
import fs, { write } from 'fs';
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
import webpack, { Configuration as WebPackConfiguration, Stats as WebPackCompileStat } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// markdown parser setup
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

// webpack configuration ( used for generating swagger ui)
const webpackConfiguraion: WebPackConfiguration = {
    mode: 'development',
    entry: {

        // this will changed in generation process
        app: "",
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.yaml$/,
                use: [
                    { loader: 'json-loader' },
                    { loader: 'yaml-loader' }
                ]
            },
            {
                test: /\.json$/,
                use: [
                    { loader: 'json-loader' },
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                ]
            }
        ]
    },
    plugins: [

        //this part is added in generating process because each page has differenct template html
        //new HtmlWebpackPlugin({
        //    template: './template/index.html'
        //})
    ],
    output: {
        filename: '[name].bundle.js',

        // this will changed in generating process
        path: "",
    }
};

/*

*/


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
    content: string;
    fileName: string;
    type: DocumentType;
}


const INDEXFILE = "00.index.md";
const ParsableDocumentExtensions = ["md", "swagger"];
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
                    content: null,
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
        content: fileContent,
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

            let distPath = resolve(`${distDir}/${doc.fileName}`);
            let generatedContent = doc.content;

            if (doc.fileName.split(".").pop() === 'md') {

                if (doc.fileName == INDEXFILE) doc.fileName = "index.html";
                distPath = md2html(resolve(`${distDir}/${doc.fileName}`));
                generatedContent = md2Html.render(doc.content);

                const templateParams = { ...baseTemplateParams, title: currentFolder.title, content: generatedContent };

                let html = templateContent;
                const menuHTML = `<ul class="top">` + await generateMenuHtml(topFolder, depth, 0) + `</ul>`;

                templateParams.menu = menuHTML;
                templateParams.styleSheetPath = `${relativePathPrefix}${STYLESHEET_NAME}`;

                Object.keys(templateParams).forEach((key: string) => {
                    const val = templateParams[key];
                    html = html.replace(new RegExp(`\{\{${key}\}\}`, 'g'), val);
                })


                await writeFile(distPath, pretty(html), 'utf-8');


            } else if (doc.fileName.split(".").pop() === 'swagger') {

                // first gemerate html which is used as webpack template
                const templateParams = { ...baseTemplateParams, title: currentFolder.title, content: "" };

                let html = templateContent;
                const menuHTML = `<ul class="top">` + await generateMenuHtml(topFolder, depth, 0) + `</ul>`;

                templateParams.menu = menuHTML;

                // Becaseu each swagger files are in the folder of it self.
                templateParams.styleSheetPath = `../${relativePathPrefix}${STYLESHEET_NAME}`;

                Object.keys(templateParams).forEach((key: string) => {
                    const val = templateParams[key];
                    html = html.replace(new RegExp(`\{\{${key}\}\}`, 'g'), val);
                });

                await writeFile(distPath, pretty(html), 'utf-8');

                const folderName = distPath.replace(/\.swagger$/i, "");
                await mkdir(folderName);
                await buildSwaggerUI(doc, folderName, distPath);

            }


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

// I use the approach to build weboack programatically into empty folder
const buildSwaggerUI = (doc: Document, dist: string, templatePath: string): Promise<void> => {

    return new Promise((res, rej) => {

        try {
            (async () => {

                const swaggerUISrc = `
import SwaggerUI from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css';
import './swagger.css';

const spec = require('./swagger.yaml');

const ui = SwaggerUI({
  spec,
  dom_id: '.swagger',
});`;

                const indesJsFilePath = `${dist}/index.js`;
                l(`Start build swaggerUI ${indesJsFilePath}`);

                await writeFile(indesJsFilePath, swaggerUISrc);
                await writeFile(`${dist}/swagger.yaml`, doc.content);

                await copyFile(`${ROOT_PATH}/../template/swagger.css`, `${dist}/swagger.css`);

                webpackConfiguraion.entry = {
                    app: indesJsFilePath
                };

                webpackConfiguraion.output.path = dist;

                webpackConfiguraion.plugins = [
                    new HtmlWebpackPlugin({
                        template: templatePath
                    })
                ];

                webpack(webpackConfiguraion, async (err: any, stats: WebPackCompileStat) => { // [Stats Object](#stats-object)
                    if (err || stats.hasErrors()) {
                        throw "Failed to compile swaggerUI";
                    }

                    //delete template files
                    await rm(`${dist}/swagger.yaml`);
                    await rm(`${dist}/swagger.css`);
                    await rm(templatePath);
                    await rm(indesJsFilePath);

                    l(`Done successfully.`);
                    res();
                });

            })();

        } catch (e) {
            throw e;
        }

    });
}

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

            l(`Build finished.`);

        });


    } catch (e: any) {
        le(`Stopped with error: ${e}`);
    }

})();
