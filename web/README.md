# Getting Started with Create React App

# Image Styler Web

This project is the frontend for the Image Styler application. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

To get started with the project, follow these steps:

2. Navigate to the project directory: `cd web`
3. Install the dependencies: `npm install`
4. Start the development server: `npm start`

The app will be running at [http://localhost:3000](http://localhost:3000).

## Project Structure

The main files and directories in the project are as follows:

- `App.css`: The main CSS file for the App component.
- `App.test.tsx`: The test file for the App component.
- `App.tsx`: The main App component.
- `index.css`: The main CSS file for the index.
- `index.tsx`: The entry point of the application.
- `logo.svg`: The logo of the application.
- `react-app-env.d.ts`: The TypeScript declaration file for the React app environment.
- `reportWebVitals.ts`: A script for reporting web vitals.
- `setupTests.ts`: The setup file for the tests.

### `api/`

This directory contains the API calls of the application.

- `uploadImage.ts`: The API call for uploading an image.

### `assets/`

This directory contains the static assets used in the application.

### `components/`

This directory contains the reusable React components.

- `ErrorDisplay/`: Contains the `ErrorDisplay` component and its associated files.
- `GeneratedImage/`: Contains the `GeneratedImage` component and its associated files.
- `HeaderBar/`: Contains the `HeaderBar` component and its associated files.
- `ImagePreview/`: Contains the `ImagePreview` component and its associated files.
- `UploadImage/`: Contains the `UploadImage` component and its associated files.

### `context/`

This directory contains the context providers for the application.

- `ErrorContext.tsx`: The context provider for error handling.

### `hooks/`

This directory contains the custom hooks used in the application.

- `useDragAndDrop.ts`: A custom hook for handling drag and drop functionality.
- `useFileUpload.ts`: A custom hook for handling file uploads.

### `pages/`

This directory contains the page components.

- `HomePage/`: Contains the `HomePage` component.

## Available Scripts

In the project directory, you can run the following scripts:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.
TODO: Implement tests
Note: Application tested with Postman

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
