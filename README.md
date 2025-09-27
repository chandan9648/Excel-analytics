📊 Excel Analytics Platform
A full-stack MERN-based web platform for uploading and analyzing Excel files (.xls, .xlsx), visualizing data through interactive 2D/3D charts, and generating downloadable reports. The platform includes user and admin authentication, upload history dashboard, and optional AI-generated insights.

🚀 Live Demo
COMING SOON

🧰 Tech Stack
Frontend:

React.js
Redux Toolkit
Chart.js
Three.js (for 3D charts)
Tailwind CSS
Backend:

Node.js

Express.js

MongoDB

Multer (file upload)

SheetJS / xlsx (Excel parsing)

JWT (Authentication)

OpenAI API (for AI insights)

🎯 Key Features
✅ User & Admin Authentication (JWT-based)
✅ Excel File Upload (.xls, .xlsx)
✅ Data Parsing with SheetJS
✅ Interactive Chart Rendering (bar, line, pie, scatter, 3D)
✅ Dynamic Axis Selection
✅ Upload History Dashboard
✅ Downloadable Graphs (PNG/PDF)
✅ Admin Dashboard for Managing Users/Files
✅ AI Summary (Optional OpenAI integration)
🗂️ Folder Structure
/backend ├── models/ ├── routes/ ├── middleware/ └── server.js

/frontend ├── src/ ├── components/ ├── pages/ ├── redux/ ├── services/ └── App.js

🛠️ Installation & Setup
1. Clone the Repository
git clone https://github.com/chandan9648/Excel-analytics.git
cd excel-analytics

Backend Setup

cd backend
npm install

##Create a .env file:

PORT=5000
MONGO_URI=your mongo uri
JWT_SECRET=your jwt secret
SENDGRID_API_KEY=your sendgrid api key
FROM_EMAIL=your from email
BACKEND_HOST_URL=https://excel-analytics-platform-z594.onrender.com
LIVE_HOST_URL=https://excel-analytics-2004.netlify.app
LOCALHOST_URL=http://localhost:5000
OPENAI_API_KEY=your openai api key
CLIENT_URL=http://localhost:5173

npm run dev

##Frontend Setup
cd frontend
npm install
npm start

📚 References
SheetJS
Chart.js
Three.js
OpenAI API Docs
Chart Studio (Inspiration)

🙌 Acknowledgements
Inspired by real-world analytics dashboards like Power BI and Chart Studio. Built as a 10-week full-stack MERN capstone project.

📬 Contact
Developer: Chandan Chaudhary
Email: chandanchaudhary1710@gmail.com
GitHub: github.com/chandan9648
