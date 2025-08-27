# Article Management Tool

This is a web application for managing articles, allowing users to view, create, edit, and delete articles. It features user authentication (mocked), filtering, sorting, pagination, and a responsive design.

## Features

*   **Article Management**: CRUD operations (Create, Read, Update, Delete) for articles.
*   **User Authentication**: Mocked authentication with different roles (Viewer, Editor).
*   **Filtering & Sorting**: Filter articles by search query and status, and sort by various criteria.
*   **Pagination**: Navigate through articles with pagination.
*   **Responsive Design**: Optimized for various screen sizes.
*   **Theming**: Light and Dark mode toggle.
*   **Form Validation**: Client-side validation for article forms.
*   **Improved User Experience**: Skeleton loaders for smoother data fetching and minimum display time for loaders.

## Technologies Used

*   **React**: Frontend JavaScript library.
*   **TypeScript**: Type-safe JavaScript.
*   **Vite**: Fast frontend build tool.
*   **Tailwind CSS**: Utility-first CSS framework.
*   **Vitest**: Unit and Integration testing framework.
*   **React Testing Library**: For testing React components.
*   **Lucide React**: Icon library.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/article-management-tool.git
    cd article-management-tool
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

This will start the development server, usually at `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The optimized production build will be located in the `dist/` directory.

### Running Tests

To run all unit and integration tests:

```bash
npm run test
# or
yarn test
```

To run tests in UI mode:

```bash
npm run test:ui
# or
yarn test:ui
```

To run tests once and exit:

```bash
npm run test:run
# or
yarn test:run
```

## Project Structure

```
├── public/
├── src/
│   ├── assets/             # Static assets (images, etc.)
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Generic UI components (Button, Modal, Input, etc.)
│   ├── contexts/           # React Contexts for global state (Auth, Theme)
│   ├── pages/              # Page-level components (Dashboard, LoginForm)
│   ├── services/           # API service integrations
│   ├── types/              # TypeScript type definitions
│   ├── App.css             # Global CSS styles
│   ├── App.tsx             # Main application component
│   ├── index.css           # Tailwind CSS base styles
│   ├── main.tsx            # Entry point of the React application
│   └── vite-env.d.ts       # Vite environment type declarations
├── .gitignore              # Specifies intentionally untracked files to ignore
├── .prettierrc             # Prettier configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── README.md               # Project README file
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── ...
```

## Contributing

Feel free to fork the repository, open issues, and submit pull requests.

## License

[Specify your license here, e.g., MIT License]