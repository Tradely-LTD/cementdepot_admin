# Cement Depot Frontend

This is a React application built with Vite, Tailwind CSS v3, and shadcn/ui with professional-grade code quality automation.

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🛡️ Code Quality Tools

This project includes automated code quality checks that run before every commit:

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint to check for issues
- `npm run lint:fix` - Fix auto-fixable ESLint issues
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run preview` - Preview production build

### Pre-commit Hooks

Thanks to **Husky** and **lint-staged**, every commit automatically:

✅ Runs ESLint and fixes issues  
✅ Formats code with Prettier  
✅ Runs tests for changed files only (via Vitest)

This ensures:

- No `console.log` statements in commits (warns and errors are allowed)
- Consistent code formatting across the team
- All tests pass before code is committed
- React Hooks best practices are enforced

### Bypassing Hooks (Emergency Only)

If you need to bypass the pre-commit hooks in an emergency:

```bash
git commit -m "emergency fix" --no-verify
```

**Note:** Only use this for critical hotfixes!

## 🧪 Testing

Tests are written with **Vitest** and **React Testing Library**.

Run tests:

```bash
npm run test
```

Run tests once:

```bash
npm run test:run
```

Run tests with UI:

```bash
npm run test:ui
```

Test files should be named `*.test.jsx` and placed next to the component they test.

## 🎨 Tech Stack

- **React 18.2** - UI library
- **Vite 5.0** - Build tool and dev server
- **Tailwind CSS v3** - Utility-first CSS framework (green primary color theme)
- **shadcn/ui** - Re-usable component library
- **ESLint (Flat Config)** - Modern linting with React support
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Run checks on staged files
- **Vitest** - Fast unit testing

## 📁 Project Structure

```
cementdepot_frontend/
├── .husky/              # Git hooks
├── public/              # Static assets
├── src/
│   ├── components/
│   │   └── ui/         # shadcn/ui components
│   ├── lib/
│   │   └── utils.js    # Utility functions
│   ├── test/
│   │   └── setup.js    # Test setup
│   ├── App.jsx         # Main App component
│   ├── App.css         # App styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── .prettierrc         # Prettier configuration
├── .prettierignore     # Prettier ignore patterns
├── eslint.config.js    # ESLint flat config
├── vitest.config.js    # Vitest configuration
├── components.json     # shadcn/ui configuration
├── jsconfig.json       # Path aliases configuration
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind configuration
└── vite.config.js      # Vite configuration
```

## 🎨 Styling & Theme

### Tailwind CSS

Tailwind CSS v3 is configured with a custom green color theme:

- **Primary Color**: Green (`hsl(142, 76%, 36%)` in light mode)
- **Dark Mode**: Supported via `dark` class
- **Input Borders**: Green to match the theme

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```javascript
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

## 🧩 Adding shadcn/ui Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
# etc.
```

Components are copied into your project and can be customized freely.

## 🔧 Configuration

### ESLint Rules

Key rules enforced:

- No `console.log` (warns/errors are allowed)
- React Hooks rules
- React Fast Refresh compatibility
- Prettier formatting as ESLint errors

### Prettier Settings

- Single quotes
- 2-space indentation
- Semicolons enabled
- Line width: 80 characters
- Trailing commas: ES5

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/)
- [Husky](https://typicode.github.io/husky/)

## 🎓 Learn More

This setup was inspired by: [Bulletproof Your Vite React App](https://mujtabaadamu.medium.com/%EF%B8%8F-bulletproof-your-vite-react-app-the-ultimate-guide-to-automated-code-quality-with-husky-da4087b27408)

---

**Happy Coding! 🚀**
