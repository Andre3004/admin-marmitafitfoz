## Language

- Use english for the code.
- Use portuguese for labels, inputs, buttons, etc.

## Components lib 

- Use these libs to create components: originui and shadcn

## React

- Always apply suspense and lazy loading to the components if possible.
- Use zod to validate the form data.
- Use zustand to manage the state.
- Use react-forms to manage the form state.
- Use react-hook-form to manage the form state.
- Use react-router-dom to manage the routing.
- Use react-icons to manage the icons.
- Use react-query to manage the data fetching.

## Main rule

Always use clean code, clean architecture and solid, devide responsibilities, priorize tailwind/zod/react-forms/zustand to write code, check if the component already exist, don't put comments on your code, only the necessary.

## Folder Structure

```
src/pages/PAGE_NAME/
├── PAGE_NAME/                    # PAGE_NAME views and functionality
│   ├── index.tsx                 # Main PAGE_NAME page component
│   ├── store/
│   │   └── useStore.ts
│   ├── hooks/
│   │   └── useRoot.ts           # Root hook for detailing functionality
│   └── components/              # UI components
│       ├──
├── shared/                   # Shared functionality across mission modules
│   ├── components/          # Reusable UI components
│   ├── hooks/              # Shared business logic hooks
│   └── store/              # Shared state management using zustand
└── use-cases/              # Business logic and use cases
    ├── use-case.ts
    ├── use-case.test.ts
```

## Architecture Patterns

### Clean Architecture

The project follows clean architecture principles:

- **Components**: UI layer handling presentation logic
- **Hooks**: Application layer managing business logic and state
- **Store**: State management using Zustand
- **Use Cases**: Pure business logic functions

## Testing

- Unit tests for use cases (business logic)
- Test files follow `.test.ts` naming convention
- Located alongside the code they test

## Dependencies

- React for UI components
- Zustand for state management
- TypeScript for type safety
- Tailwind CSS for styling (based on project patterns)
