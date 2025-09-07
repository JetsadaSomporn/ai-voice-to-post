# Voice2Post - AI-Powered Voice to Social Media Post Generator

Convert your voice recordings into engaging social media posts using AI.

## Features

- 🎤 **Voice Recording** - Record audio directly in the browser
- 🤖 **AI Transcription** - Convert speech to text using Google Gemini
- 📝 **Smart Post Generation** - Generate posts optimized for Facebook, Instagram, and Twitter
- 🔐 **Secure Authentication** - Google OAuth and email authentication
- 📊 **Usage Tracking** - Monitor your API usage and limits
- 💳 **Subscription Plans** - Free and Plus tiers with different limits

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth (Google OAuth + Email)
- **AI**: Google Gemini API for transcription and text generation

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Google Cloud Platform account (for Gemini API)

### Environment Variables

Create a `.env.local` file with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

### Database Setup

Run the SQL setup file in your Supabase SQL Editor:
```sql
-- See supabase-setup-v2.sql for complete database schema
```

## Usage

1. **Sign Up/Login** - Use Google OAuth or email authentication
2. **Record Audio** - Go to `/record` and record your voice
3. **Generate Posts** - AI will transcribe and generate social media posts
4. **View History** - Check your past recordings and generated posts
5. **Upgrade Plan** - Get more usage limits with Plus subscription

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── generate/          # Post generation page
│   ├── history/           # User history
│   ├── login/             # Login page
│   ├── plan/              # Subscription plans
│   ├── record/            # Voice recording
│   └── upgrade/           # Upgrade to Plus
├── components/            # Reusable React components
├── contexts/              # React Context providers
├── lib/                   # Utility libraries
└── types/                 # TypeScript type definitions
```

## API Endpoints

- `POST /api/transcribe` - Convert audio to text
- `POST /api/generate-post` - Generate social media posts
- Database operations handled via Supabase client

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
