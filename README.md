# Kirana Fintech

A modern fintech application designed specifically for local kirana stores (neighborhood retail shops) in Nepal. This application helps store owners manage their daily operations, track inventory, handle transactions, and grow their business with digital financial tools.

## Features

- **Transaction Management**: Record sales, purchases, expenses, and payments in NPR
- **Inventory Tracking**: Monitor stock levels, set reorder alerts, and manage products
- **Credit Management**: Track customer credit and outstanding balances
- **Business Analytics**: Get insights into sales trends and profit margins
- **Multi-user Support**: Owner and staff roles with appropriate permissions
- **Nepal-specific**: Support for NPR currency, Nepali phone numbers, and PAN validation

## Tech Stack

- **Frontend**: Next.js 16 (React 19)
- **Styling**: Vanilla CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Authentication**: Supabase Auth

## Folder Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles and design system
├── components/            # React components
│   ├── layout/           # Layout components (Header, Footer)
│   └── ui/               # Reusable UI components (Button, Card)
├── lib/                  # Library code
│   └── supabase/        # Supabase client configurations
│       ├── client.ts    # Client-side Supabase client
│       └── server.ts    # Server-side Supabase client
├── types/               # TypeScript type definitions
│   └── index.ts        # Core entity types
└── config/             # Configuration files
    └── constants.ts    # Application constants
```

## Getting Started

### Prerequisites

- Node.js 20+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kirana-fintech
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

### Database Schema (Coming Soon)

You'll need to create tables in your Supabase project for:
- `stores` - Store information
- `users` - User accounts and profiles
- `transactions` - Financial transactions
- `products` - Inventory items
- `customers` - Customer information

Detailed schema and migration files will be added soon.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Design System

The application uses a custom CSS design system with:
- Color palette suitable for fintech (trustworthy blues, success greens)
- Consistent spacing and typography
- Responsive breakpoints
- Dark mode support

All design tokens are defined in `src/app/globals.css`.

## Nepal-Specific Features

- **Currency**: Nepali Rupee (NPR) with रू symbol
- **Phone Validation**: Supports Nepal mobile number format (98XXXXXXXX, 97XXXXXXXX)
- **PAN Validation**: 9-digit PAN number format
- **Provinces**: List of all 7 provinces of Nepal
- **Timezone**: UTC+5:45 (Nepal Standard Time)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

