# **GhumoAI** - Your AI Travel Companion

## 🚀 Project Description

GhumoAI is an innovative AI-powered travel planning platform that creates personalized city tour itineraries based on your preferences. The application combines artificial intelligence with local insights to deliver customized travel experiences. Users can plan tours, rent vehicles, find refill stations, and get real-time AI assistance throughout their journey. The platform features audio guides for attractions and supports multiple transportation modes, making city exploration seamless and engaging.

## 🎯 Link to Project

[Live Demo](https://ghumo-ai.vercel.app/)

## 🛠 Tech Stack

- **Frontend Framework:** React.js with TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context
- **Database & Auth:** Supabase
- **AI Integration:** OpenAI API
- **Maps & Navigation:** Leaflet & OpenStreetMap
- **Voice Generation:** ElevenLabs API
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Deployment:** Vercel

## ✨ Key Features

- **AI-Powered Tour Planning:** Get personalized itineraries based on your interests and schedule
- **Audio Guides:** Listen to engaging audio descriptions of attractions
- **Vehicle Rental:** Seamlessly rent vehicles for your tours
- **Water Refill Stations:** Find eco-friendly water refill points during your journey
- **Real-time AI Assistant:** Get instant help with travel-related queries
- **Interactive Maps:** Visual route planning and navigation
- **Multi-modal Transport:** Support for walking, cycling, and driving routes

## 📷 Features Preview

| ![Plan Tour](/public/plan-tour.png "AI Tour Planning") | ![Vehicle Rental](/public/rental.png "Vehicle Rental") | ![Refill Stations](/public/refill.png "Water Refill") | ![AI Assistant](/public/ai-chat.png "AI Assistant") |
|:---:|:---:|:---:|:---:|

## 📦 Prerequisites

Before running the project, ensure you have:

- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **API Keys** for required services

## 🔧 Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/ghumo-ai
cd ghumo-ai
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory with the following:
```bash
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Build for production:**
```bash
npm run build
```

## 🔒 Security Note

- Never commit your `.env` file
- Keep your API keys secure
- The `.env` file is included in `.gitignore`

## 🌟 Usage Guide

1. **Plan a Tour:**
   - Enter your destination
   - Select tour duration
   - Choose transportation mode
   - Pick your interests
   - Get AI-generated itinerary

2. **Vehicle Rental:**
   - Browse available vehicles
   - Filter by type and price
   - Check availability
   - Complete booking

3. **Find Refill Stations:**
   - View stations on map
   - Check water quality ratings
   - Get directions
   - Add new stations

4. **AI Assistant:**
   - Ask travel-related questions
   - Get real-time recommendations
   - Receive local insights
   - Plan modifications

## 👥 Built By
[Raj Desai](https://github.com/rajdesai17)

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Made with ❤️ and AI**
