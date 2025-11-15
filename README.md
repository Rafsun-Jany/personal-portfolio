# Mohammad Rafsun Jany Mahin - Personal Portfolio

> Backend platform engineer crafting resilient systems, observability-first ops, and automation that keeps teams shipping.

[![Built with HTML5](https://img.shields.io/badge/Built_with-HTML5-e34f26?logo=html5&logoColor=white)](#tech-stack) [![Styled with CSS](https://img.shields.io/badge/Styling-CSS3-2eaadc?logo=css3&logoColor=white)](#tech-stack) [![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-f7df1e?logo=javascript&logoColor=0a0a0a)](#tech-stack) [![Accessibility](https://img.shields.io/badge/Accessibility-AA-0a9396?logo=mozilla&logoColor=white)](#accessibility--ux)

## Table of Contents
- [Overview](#overview)
- [Feature Showcase](#feature-showcase)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Accessibility & UX](#accessibility--ux)
- [Customization Ideas](#customization-ideas)
- [Deployment Tips](#deployment-tips)
- [Connect](#connect)

## Overview
This single-page portfolio highlights the work of Mohammad Rafsun Jany Mahin, a senior backend-focused software engineer. It combines a polished visual experience with thoughtful accessibility and data-driven storytelling that keeps visitors engaged while surfacing key achievements.

## Feature Showcase
- **Immersive hero** with animated stat counters, rotating headlines, interactive reaction buttons, and a theme-aware hero doodle.
- **Responsive, accessible navigation** featuring a skip link, scroll progress indicator, sticky header, and a keyboard-friendly mobile menu.
- **Highlights, projects, experience, toolbox, and background sections** packed with data-rich storytelling, filterable categories, and reveal-on-scroll animations that respect reduced motion.
- **Background section** pairs the education history with publications in matching content cards for a cohesive narrative.
- **Agentic development sandbox** lets visitors run a guided `Try the Agent` demo that simulates your guardrail-driven incident remediation workflow.
- **Live contact hub** including quick email and phone actions, downloadable resume, local time clock with working-hours indicator, and location metadata.
- **Polished micro-interactions** such as resume hover preview, persistent theme toggle, confetti celebration trigger, toast notifications, back-to-top control, and intersection-aware active nav links.
- **Performance-friendly defaults**: lazy animations, intersection observers for work offloading, and graceful fallbacks when browser APIs are unavailable.

## Tech Stack
- `HTML5` semantic layout with ARIA annotations for assistive tech.
- `CSS3` custom design system with fluid typography, CSS variables, and responsive grids.
- `Vanilla JavaScript` for interactivity (prefers-reduced-motion handling, localStorage theme persistence, IntersectionObserver-driven animations, resume preview, agent demo workflow, dynamic clocks, and confetti canvas renderers).

## Getting Started
1. **Clone the repository**
   ```bash
   git clone https://github.com/rafsun-github/personal-portfolio.git
   cd personal-portfolio
   ```
2. **Serve the site locally (pick one)**
   ```bash
   # Option A: using npm serve
   npx serve .

   # Option B: using Python 3
   python -m http.server 8080
   ```
3. **Open in a browser**  
   Visit `http://localhost:3000` (or the port printed in your terminal) to view the portfolio.

## Project Structure
```text
.
|- index.html          # Main single-page application
|- styles.css          # Tailored design system and animations
|- scripts.js          # Interaction logic and progressive enhancements
|- Rafsun_Jany_9904.jpg
|- Rafsun_Resume.pdf
`- README.md
```

## Accessibility & UX
- Skip-to-content link and aria labels support screen reader navigation.
- Mobile menu, filters, and reaction buttons are keyboard navigable with clear focus states.
- Motion and animation respect `prefers-reduced-motion`; counters and doodles fall back to static output.
- Theme toggle preserves user preference via localStorage without breaking when storage is unavailable.
- Toasts, stat counters, and clock announce status changes with appropriate ARIA roles.

## Customization Ideas
- Update the content sections (`highlights`, `projects`, `experience`, `skills`, `background`) in `index.html` to reflect new achievements.
- Tailor the publication entries inside the background section (`.publication-entry` blocks) to link to updated talks, articles, or whitepapers.
- Swap `Rafsun_Jany_9904.jpg` with a lighter hero image and adjust colors in `styles.css` to match new branding.
- Extend the project filters in `scripts.js` by adding categories and dataset attributes to project cards.
- Integrate analytics or form handling by wiring the contact buttons to your preferred platforms.
- Expand the agent demo with additional scenarios, metrics streaming, or hooks into a real sandbox environment.

## Deployment Tips
- Host the `main` branch on GitHub Pages, Netlify, Vercel, or any static hosting service - no build process required.
- Add a custom domain and configure HTTPS for a professional touch.
- Use the site as a base for automation demos by embedding API demos or observability dashboards via iframes when needed.

## Connect
- Email: [rafsun.jany008@gmail.com](mailto:rafsun.jany008@gmail.com)
- Phone: [+8801630200137](tel:+8801630200137)
- LinkedIn: [mohammadrafsun-jany-mahin-5160b4178](https://www.linkedin.com/in/mohammadrafsun-jany-mahin-5160b4178)

Let's collaborate on systems that are fast, observable, and resilient.
