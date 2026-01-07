# Schema-Driven Form Builder

A modern, interactive form builder application built with React, TypeScript, and Vite. This project demonstrates clean architecture, type-safe development, and professional UI/UX design.

## Overview

This form builder allows users to create dynamic forms through an intuitive drag-and-drop interface, preview them in real-time, generate JSON schemas, and collect form submissions. The application showcases modern frontend development practices with a focus on user experience and code quality.

## Key Features

### 1. Form Builder (Edit Mode)
- **Visual Form Design**: Create forms using a sidebar-based field selector
- **Field Configuration**: Configure field properties including:
  - Field type (text, email, number)
  - Label and placeholder text
  - Required/optional validation
- **Field Management**: Add, select, delete, and reorder form fields
- **Real-time Updates**: Instant visual feedback as you build

### 2. Live Preview
- **Interactive Preview**: See exactly how your form will look to end users
- **Validation Display**: Visual indicators for required fields (asterisks)
- **Publish Workflow**: Review and publish forms to generate schemas

### 3. Schema Generation
- **JSON Export**: Automatic generation of type-safe JSON schemas
- **Copy to Clipboard**: One-click copying of generated schemas
- **Schema Format**: Clean, readable JSON structure for easy integration

### 4. Form Import & Submission
- **Schema Import**: Load forms from previously generated JSON schemas
- **Form Filling**: Interactive form-taking experience for end users
- **Submission Results**: View collected form data in structured JSON format

## Tech Stack

### Core Technologies
- **React 19.2** - Modern React with latest features
- **TypeScript 5.9** - Type-safe development with discriminated unions
- **Vite 7.2** - Lightning-fast build tool and dev server

### UI/UX
- **Modern Design System**: Custom purple gradient theme with glassmorphism
- **CSS3 Animations**: Smooth transitions and hover effects
- **Responsive Layout**: Flexbox and CSS Grid for adaptive layouts
- **Backdrop Blur Effects**: Frosted glass UI components

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript ESLint** - Type-aware linting rules
- **Vite HMR** - Hot module replacement for instant updates

## Architecture Highlights

### Type System
```typescript
type FieldType = "text" | "email" | "number";

interface Field {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
}
```

### State Management
- React hooks (`useState`) for local state
- UUID-based field identification
- Controlled form inputs for predictable behavior

### Code Organization
- Component-based architecture
- Separation of concerns (UI, logic, types)
- Clean, maintainable CSS with BEM-inspired naming

## Design Features

### Visual Design
- **Color Scheme**: Purple to violet gradient (#667eea → #764ba2)
- **Glassmorphism**: Translucent white cards with backdrop blur
- **Typography**: Inter font family for modern, clean text
- **Spacing**: Consistent 24px/32px spacing system

### Interactive Elements
- **Hover Effects**: Subtle transforms and color changes
- **Focus States**: Purple glow on form inputs
- **Button Animations**: Lift effects on hover/click
- **Field Selection**: Visual feedback with gradient backgrounds

### Accessibility
- Semantic HTML structure
- Keyboard-friendly form controls
- Clear visual hierarchy
- Proper label associations

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Access the application at `http://localhost:5173`

### Build
```bash
npm run build
```
Generates optimized production build in `/dist`

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
form-builder/
├── src/
│   ├── App.tsx           # Main application component
│   ├── styles.css        # Global styles and design system
│   ├── main.tsx          # Application entry point
│   └── types/
│       └── form.ts       # TypeScript type definitions
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

## Usage Flow

### 1. Building a Form
1. Click "Edit" to enter builder mode
2. Use the left sidebar to view existing fields
3. Click "+ Add Field" to create new fields
4. Select a field to configure its properties in the center panel
5. Customize field type, label, placeholder, and required status

### 2. Previewing
1. Click "Preview" to see how the form looks
2. Review field layout and labels
3. Click "Publish Form" to generate the schema

### 3. Exporting Schema
1. After publishing, view the generated JSON schema
2. Click "📋 Copy JSON" to copy the schema to clipboard
3. Use this schema to recreate the form later or integrate with backend systems

### 4. Importing & Taking Forms
1. Click "Take Forms" to enter import mode
2. Paste a previously generated JSON schema
3. Click "Load Form" to import the form
4. Fill out the form fields
5. Click "Submit" to see the collected data

## Code Quality

### TypeScript
- Strict type checking enabled
- No `any` types in production code
- Discriminated unions for type safety

### Best Practices
- Functional components with hooks
- Immutable state updates
- Controlled components
- Clean separation of concerns

### Performance
- Vite's optimized build pipeline
- Tree-shaking for minimal bundle size
- Fast refresh during development

## Future Enhancements

Potential areas for expansion:
- Backend integration for form storage
- More field types (textarea, select, radio, checkbox, file upload)
- Field validation rules (min/max, regex patterns)
- Conditional field logic
- Multi-page forms
- Form analytics and submission management
- Export forms as HTML/React components

## Interview Notes

This project demonstrates:
- **Clean Code**: Readable, maintainable TypeScript/React
- **UI/UX Skills**: Modern design with attention to detail
- **State Management**: Effective use of React hooks
- **Type Safety**: Proper TypeScript usage throughout
- **Problem Solving**: Schema-driven architecture for flexibility
- **User Experience**: Intuitive multi-mode interface

The focus was on creating a polished, production-ready application that balances functionality with aesthetic appeal.

---

**Author**: Sayhoon Lee
**Built with**: React 19, TypeScript 5.9, Vite 7.2
**License**: MIT
