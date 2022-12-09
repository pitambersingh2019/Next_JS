This is a [Next.js](https://nextjs.org/) TypeScript project using Sass modules for styling. It uses Atomic Design Structure, React Context for global state and heavy use of custom hooks for functionality.

The project is split into two main parts - a CMS-driven marketing site, and an authenticated employee experience platform; this also has two main sections - employee (light mode) and admin (dark mode). The marketing site uses server-side fetching, whereas the platform mainly uses client-side fetching.

## Setup

1. Create a **.env** file at the root of the project, containing the following:
```
HOST=prosperex.local
PORT=80
API_URL=http://admin.prosperex.local/api
```
2. Add the following to your hosts file (`sudo vim /etc/hosts` on a Mac):
```
127.0.0.1       www.prosperex.local
127.0.0.1       absurd.local.prosperex.com.au
```
3. Ensure Node version >15.4.0 is installed
4. Ensure your code editor has ESLint and Stylelint installed
5. Run `yarn && yarn dev`
