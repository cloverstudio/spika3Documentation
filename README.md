# Markdown documentation

Markdown documentation is simple Nodejs script to generate html from set of markdownfiles.
The initial idea of this script is make writing documentation easier for developers.
What you do is simply write documents in Markdonw format then run this script.
This script generates set of html and css so you just deploy to server or to any kind of hosting and that's it.

## How to use

```
$ git clone https://github.com/kenyasue/md-documentation.git
$ cd md-documentation/
$ nvm use 16
$ npm install
$ npm run build
```

That's it! Html and css files are under ./dist folder.
Then please check files under the ./pages folder. They are markdown and swagger files
used to generate these html.

## File structure

- /build
  - Compiled .ts files comes here.
- /dist
  - Generated HTML and css comes here. . You can change the folder by changing .env.
- /pages
  - Place here the markdown files. You can change the folder by changing .env.
- /template
  - index.html is used to generate html from md. Check the content so you will understand how it works.
- /index.ts
  - The source code.

## Writing

### File naming

    Basic file name format should be like this `[number].[filename].md`. The number is used for sorting in menu.
    Each folder should contain "00.index.md" which will not show on menu but the content is used when user clickes the folder name.

#### Sample file structure

    - /page
      - 00.index.md
      - 01.readme.md
      - 02.APIDocumentation
        - 00.index.md
        - 01.apiv1.md
        - 02.apiv2.md
      - 03.database
        - 00.index.md
        - assets
          - diagram1.png
          - diagram2.png

    This set of markdown files will be converted to following html file structure.
    - index.html
    - 01.readme.html
    - 02.APIDocumentation
      - index.html
      - 01.apiv1.html
      - 02.apiv2.html
    - 03.database
      - index.html
      - assets
        - diagram1.png
        - diagram2.png


### Sidebar menu

    The title of sidebar menu is read from the first line of each markdown file.
    So for example if the first line of the markdown file is "# Welcome" the link title of for
    the page in sidebar menu becomes "Welcome".

## The future plan

- Support swagger
- Support marmaid
- Support database scheme
