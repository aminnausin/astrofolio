# Amin Nausin – Portfolio

<p  align="left">
    <img src="https://img.shields.io/github/package-json/v/aminnausin/astrofolio?color=white&logo=docker&logoColor=white" alt="version"/>
    <a href="https://nausin.me"><img src="https://img.shields.io/website?url=https%3A%2F%2Fnausin.me&up_color=purple&down_color=F9322C&label=Build&link=https%3A%2F%2Fnausin.me&logo=digitalocean&logoColor=white" alt="Build Status"></a>
    <img src="https://repo-view-counter.nausin.me/?repo=aminnausin/astrofolio&colour=F9322C&label=views" alt="Repo View Counter">
</p>

A stylised personal portfolio site built with [Astro](https://astro.build/), [Vue 3](https://vuejs.org/), and [Tailwind CSS](https://tailwindcss.com/).  
It showcases projects, experiences, and skills with dynamic visuals, including a starfield background rendered using [Three.js](https://threejs.org/).

```sh
npm run docker:build
```

> 🧑‍🚀 **Powered by:** Digital Ocean

![preview](https://github.com/user-attachments/assets/bd79858f-c4d8-4a7e-a795-da5c8a37b5ce#gh-light-mode-only)
![preview](https://github.com/user-attachments/assets/a357ad2c-01a1-49da-9359-467f7381b3be#gh-dark-mode-only)

## 🚀 Project Structure

Structure of my portfolio:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── types/
│   │   └── types.ts
│   ├── styles/
│   │   └── global.css
│   ├── content/
│   │   └── collection/index.json
│   ├── components/
│   │   └── category/component.[astro/vue]
│   ├── assets/
│   │   └── asset.*
│   └── pages/
│       └── index.astro
├── Dockerfile
├── compose.yaml
└── package.json
```

### Features

- **Fully static, fast-loading** site powered by Astro
- **Dynamic starfield background** using Three.js
- **Dark/light theme toggle** with animated transitions
- **Responsive** layout with Tailwind CSS
- **Dockerised** for easy deployment (Nginx/Alpine-based)
- **CI via GitHub Actions** with automatic Docker Hub publishing and versioning
- **CD via [watchtower](https://github.com/containrrr/watchtower)** with auto deployment to Digital Ocean

### Tech Stack

- Astro + Vue
- TailwindCSS
- Three.js (for starfield)
- Docker + Nginx Container
- GitHub Actions CI
- Plausible (self-hosted analytics)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run type-check`      | Run Astro and Vue type checking for CI           |
| `npm run docker:build`    | Build and publish Docker image for CI            |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 👀 Want to see more of my projects?

Feel free to check [my longest running project](https://github.com/aminnausin/mediaServer) or add my [GitHub Statistics Snapshot](https://github.com/aminnausin/snapshot) to your profile README.
