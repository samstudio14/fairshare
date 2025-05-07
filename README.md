# Splitwise Clone

A simplified frontend-only clone of Splitwise built with Next.js, TypeScript, and Tailwind CSS. This project demonstrates how to create a Splitwise-like expense tracking application with a modern iOS-inspired design.

## Features

- Track shared expenses between multiple people
- View balances and who owes whom
- Add new expenses with custom splits
- Automatic debt simplification
- iOS-inspired UI design
- Responsive layout
- Local state management (no backend required)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React 18

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd splitwise-clone
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/src
  /components
    /ui (iOS-style components)
    ExpenseForm.tsx
  /lib
    calculations.ts
  /data
    mockData.ts
  /app
    page.tsx
    globals.css
```

## Usage

1. The app starts with some mock data for demonstration
2. Click "Add Expense" to create a new expense
3. Fill in the expense details:
   - Description
   - Amount
   - Who paid
   - Split between whom
4. View the updated balances and simplified debts

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT 