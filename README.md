# Contribution Guide

The document defines coding conventions and practices to be followed to contribute to the project.

## Development Environment Setup

### Softwares needed

- Node
- NPM
- Yarn
- VS Code
- [Preitter plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Configuration

- Configure to format source files using above extension in VS Code as soon as file is saved

### Installing project dependencies

`yarn install`

### Running project

`yarn start`

## Git major branches

- **dev** branch should be stable development branch
- **staging** branch would be branch where dev would get merged while submitting the build for QA for testing
- **main** branch would be stable production branch

## Git workflow

- Create a new feature branch with naming format _'feature/{feature-name}'_ from dev branch while building new feature.
- When PR would be merged we would be deleting the feature branch

## Coding guidelines

- Each jsx, tsx file should contain one and only one react component, name of file and component should match extactly expect for difference in their naming formats.
- All page components are placed in src/pages directory
- All dialogs should only in included in page components
- All page and resuable components would have independent scss file for styling

### General naming guidelines

- Files, directories, components, functions, variables, states, images and others artifacts in code should be named such that it conveys what it is used for. Idea is to make code a document of itself.

### General naming guidelines for files and directories

- File and directory names would be all small caps with words separated by underscore like utils, settings_module, users.jsx, manage_products.jsx

## Naming naming for image, icon and other assest files

- Image, icons and other assest file should be in all small case, each word separated with dash like ic-edit.png

### General naming guidelines for react components

- Components names would follow sentence case where each name would start with capital letter and first letter of each word would be capitalized like LoginPage, DateUtils.

### Guidelines for making page react components

- All page components should be placed with `src/pages` directory.
- Directory structure within `src/pages` should match extact with the route structure like page that opens on /login should be placed in root of `src/pages` and page that opens on /app/profile should be placed in `src/pages/app/` directory
- All page components' jsx/ tsx files should be suffixed with '\_page' like landing_page.jsx.
- All page components should be suffixed with 'Page', like LoginPage, LandingPage

### Guidelines for making dialog react components

- All page components' jsx/ tsx files should be suffixed with '\_dialog' like edit_email_dialog.jsx.
- All page components should be suffixed with 'Dialog', like EditEmailDialog, TermsDialog

### Guidelines for making other react components

-

### Guidelines for defining javascript functions

### Guidelines for defining SCSS/ CSS classes

### Guidelines for defining javascript variables

### Exception handling

- Errors should be handled

### Media Queries

- Use [media queries breakpoints as specified by bootstrap](https://getbootstrap.com/docs/5.2/layout/breakpoints/#available-breakpoints). Use of any other breakpoints than these should be avoided.
- Media queries of each component should be kept in it's respective style file.
- Media queries should be written using bootstrap mixins as explained [here](https://getbootstrap.com/docs/5.2/layout/breakpoints/#media-queries)

## Offical documentation for major dependencies

- [Bootstrap 5.x](https://getbootstrap.com/docs/5.2/getting-started/introduction/)
- [React Bootstrap 2.X](https://react-bootstrap.github.io/components)
- [React Navigation 6.x](https://reactrouter.com/docs/en/v6)
- [File upload widget](https://react-dropzone.js.org/)
