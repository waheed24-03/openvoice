# OpenVoice 

OpenVoice is a Twitter-inspired social media platform that combines real-time user posts with live news trends. Stay updated, share your thoughts, and explore trending topics seamlessly.

---

## Features ✨

- **User Authentication:** Signup/Login using Supabase  
- **Post Creation:** Share posts with text and images  
- **Trending Feed:** Explore trending topics and live news integration  
- **Profile Management:** Edit profile, avatar, and preferences  
- **Dark & Light Mode:** Switch between themes  
- **Saved Posts:** Bookmark posts for later  

---

## Screenshots 📸

### Login Page
![Login Page](images/loginpage.png)

### Homepage / Feed
![Homepage](images/homepage.png)

### Profile Page
![Profile Page](images/profilepage.png)

### Trending Topics
![Trending Page](images/trendingpage.png)

### Saved Posts
![Saved Page](images/savedpage.png)

### Settings / Preferences
![Settings Page](images/settingspage.png)

### Light Mode
![Light Mode](images/lightmode.png)

### Creating a Post
![Creating Post](images/makingpost.png)

---

## Tech Stack 🛠️

- **Frontend:** React, TailwindCSS  
- **Backend:** Supabase (Authentication + Database)  
- **News API:** NewsData.io via Node.js proxy server  
- **Deployment:** Vercel / Netlify  

---

## Setup 🚀

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/openvoice.git
cd openvoice

# 2. Install dependencies
npm install

# 3. Add .env file(s) with your keys
# .env (in project root)
REACT_APP_SUPABASE_URL=YOUR_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# .env (for news-proxy)
NEWS_API_KEY=YOUR_NEWS_API_KEY
PORT=5050

# 4. Run the development server
npm start
 ```
---
---
## 👤 Author
- Syed Abdul Waheed
- Data Science Enthusiast | Python Developer | Automation Explorer
- 📬 Connect: LinkedIn (https://www.linkedin.com/in/syed-abdul-waheed/)
- 🐙 GitHub: waheed24-03
--- 



