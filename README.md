# 📚 Bookshelf - Personal Book Tracking App

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-Components-black?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Styling-38B2AC?style=for-the-badge&logo=tailwind-css)
![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=for-the-badge&logo=jest)

</div>

A modern, elegant web application for tracking your personal book collection. Bookshelf helps you manage your reading list, track your reading progress, and analyze your reading habits with beautiful visualizations.


## ✨ Features

- 📚 **Book Management** - Add, edit, and delete books in your collection
- 🔍 **Advanced Search & Filtering** - Find books by title, author, genre, and more
- 📊 **Reading Statistics** - Visualize your reading habits with charts and graphs
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode** - Elegant light and dark mode support
- ⚡ **Performance Optimized** - Fast loading with code splitting and lazy loading
- 🧪 **Comprehensive Testing** - Unit, integration, and accessibility tests
- 🔒 **Accessibility** - WCAG compliant with keyboard navigation and screen reader support
- 💾 **Data Import/Export** - Backup and restore your book collection
- 🔧 **TypeScript** - Type safety and better developer experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourdesigncoza/bookshelf.git
cd bookshelf
```

2. Install dependencies:

```bash
npm install --force
# or
yarn install --force
# or
pnpm install --force
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🧪 Testing

This project includes a comprehensive testing setup with Jest, React Testing Library, and Cypress.

### Running Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Generate and view detailed coverage report
npm run coverage
```

### Running Integration Tests

```bash
# Open Cypress Test Runner
npm run cypress

# Run Cypress tests headlessly
npm run cypress:headless

# Start dev server and run tests
npm run test:e2e
```

For more details about testing, see the [TESTING.md](TESTING.md) and [Integration Testing Guide](docs/integration-testing.md) files.

## 📱 Application Structure

- **`/src/app`** - Next.js App Router pages and layouts
- **`/src/components`** - Reusable React components
  - **`/ui`** - Shadcn UI components
  - **`/books`** - Book-related components
  - **`/layout`** - Layout components
- **`/src/lib`** - Utility functions and type definitions
- **`/src/hooks`** - Custom React hooks
- **`/src/__tests__`** - Test files
- **`/public`** - Static assets

## 🔒 Accessibility

This application is designed with accessibility in mind, following WCAG 2.1 guidelines. Features include:

- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Focus management
- Skip links for keyboard users

## 🎨 Customization

### Styling

This template uses Tailwind CSS for styling. You can customize the theme in the `tailwind.config.js` file.

### Components

All Shadcn UI components are located in the `src/components/ui` directory. You can customize them to fit your needs.

To add a new Shadcn UI component:

```bash
npx shadcn-ui@latest add button
```

### Pages

Create new pages in the `src/app` directory following the Next.js App Router conventions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Shadcn UI](https://ui.shadcn.com/) - UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing utilities
- [Jest](https://jestjs.io/) - JavaScript Testing Framework
- [Cypress](https://www.cypress.io/) - End-to-End Testing
