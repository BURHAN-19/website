# The Ambassadors of Knowledge - Official Website

> **School Motto:** *"Your Bright Future Starts Here"*  
> **Location:** Dhok Badam Satramile, Bhara Kahu, Islamabad, Pakistan  
> **Phone:** 03475409209  
> **Email:** shahzadalishahjaffri@gmail.com  
> **Target Domain:** [https://aok.site.je](https://aok.site.je)

---

## 🏫 About the Website

This website is a modern, responsive, high-performance static web application built with HTML5, CSS3, and vanilla JavaScript for **The Ambassadors of Knowledge** school. It provides complete transparency on classes offered (Playgroup to 10th grade with specialized Arts group in 9th & 10th), monthly fees, campus location, and direct admission inquiry channels via WhatsApp and Email.

---

## 📁 Project Structure

```text
AOK.website/
├── admin/                      # Complete School Admin Dashboard Suite
│   ├── css/
│   │   └── admin.css           # Modern dashboard UI & print challan stylesheets
│   ├── js/
│   │   ├── db.js               # Reactive school database engine & seed data
│   │   ├── auth.js             # Session auth & role permissions
│   │   └── admin.js            # Dashboard UI controller, charts & print engine
│   ├── index.html              # Main multi-view admin dashboard application
│   └── login.html              # Secure admin login portal
├── assets/
│   └── images/
│       ├── logo.png             # School logo insignia
│       ├── logo.PNG             # Original logo copy
│       ├── favicon.svg          # Vector favicon
│       ├── principal.jpg        # Principal / Director leadership photo
│       └── gallery/             # Campus & event gallery photos
├── css/
│   └── style.css               # Design system & responsive styles
├── js/
│   └── main.js                 # Navigation, fee calculator & contact actions
├── index.html                  # Homepage & highlights
├── about.html                  # Vision, mission & school story
├── academics.html              # Programs from Playgroup to 10th Arts
├── fees.html                   # Fee schedule & interactive calculator
├── contact.html                # Campus address, phone, WhatsApp & map
├── 404.html                    # Branded error page
├── sitemap.xml                 # Search engine sitemap
├── robots.txt                  # Search crawler directives
├── vercel.json                 # Vercel deployment configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # Documentation & setup guide
```

---

## 🔐 School Admin Dashboard

The website includes a complete, professional, and fully responsive **Admin Dashboard Suite** located at `/admin/` (or `admin/login.html`).

### Demo Login Accounts:
| Role | Username | Password | User Profile |
| :--- | :--- | :--- | :--- |
| **Principal & Super Admin** | `admin` | `admin123` | Shahzad Ali Shah Jaffri (MBA Finance) |
| **Accounts & Fee Incharge** | `accounts` | `accounts123` | Syed Ali Asghar (B.Com / PIPFA) |
| **Academic Coordinator** | `coordinator` | `academic123` | Sir Usman Ali (Secondary Arts Lead) |

### Core Modules:
1. **Dashboard KPI Overview**: Real-time stats on enrolled students, monthly fee recovery %, pending admission inquiries, and faculty count. Includes dynamic SVG charts for academic wing distributions.
2. **Admissions & Inquiries CRM**: Synchronized directly with the website's contact form. Features one-click WhatsApp parent messaging, phone calling, status pipeline (New -> Contacted -> Interview -> Admitted), and one-click student enrollment.
3. **Student Directory**: Student registry with roll numbers (`AOK-2026-001`...), class filters, search, fee status, and instant **Printable Student ID Card** with school crest and emergency details.
4. **Fee Management & Pakistani 3-Copy Bank Challan Generator**: Complete fee tracking, cash/bank receipt generation, and **standard 3-copy bank voucher printing** (Bank Copy, School Copy, Student Copy) formatted for standard Pakistani school banking guidelines.
5. **Academic Wings & Classes**: Classes from Playgroup to 10th Arts with student capacity meters and teacher assignments.
6. **Faculty & Staff Directory**: Teacher records, qualifications, contact details, and department allocations.
7. **School Notice Board**: Publish notices with categories, audience targets, and priority tags.
8. **Media Gallery Manager**: Manage showcase photography for annual ceremonies and educational study trips.
9. **Backup, Restore & Audit Trail**: Download complete database backup as JSON, restore backups, or reset to factory demo state. Includes a live administrative audit log.

---

## 🚀 How to Run Locally

Because this is a zero-dependency static site, you can preview it instantly:

### Option A: Python Built-in Server
Open PowerShell in this folder and run:
```powershell
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

### Option B: VS Code Live Server
Right-click on `index.html` and choose **"Open with Live Server"**.

---

## 🐙 Push to GitHub

1. If you haven't installed Git, install it from [git-scm.com](https://git-scm.com/).
2. Create a new repository on your GitHub account (e.g. `aok-website`).
3. Run the following commands in PowerShell inside this directory:
```powershell
git init
git add .
git commit -m "Initial commit of The Ambassadors of Knowledge school website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aok-website.git
git push -u origin main
```

---

## ▲ Deploy on Vercel & Map `aok.site.je`

1. Go to [Vercel](https://vercel.com/) and sign in with your GitHub account.
2. Click **"Add New"** > **"Project"**.
3. Import your `aok-website` repository.
4. Leave **Framework Preset** as **"Other"** (Root Directory: `./`).
5. Click **"Deploy"**.
6. Once deployed:
   - Go to your Project **Settings** > **Domains**.
   - Enter `aok.site.je` and click **Add**.
   - Vercel will provide the DNS records (CNAME or A record) to enter in your domain registrar's DNS panel.

---

## 🔍 Google Search Console Verification

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Choose **URL prefix** and enter `https://aok.site.je`.
3. Under the **HTML tag** verification method, copy the `content` code provided by Google (e.g. `content="abc123xyz..."`).
4. In each HTML file (`index.html`, `about.html`, `academics.html`, `fees.html`, `contact.html`), replace:
   ```html
   <meta name="google-site-verification" content="GOOGLE_SEARCH_CONSOLE_KEY">
   ```
   with your token:
   ```html
   <meta name="google-site-verification" content="abc123xyz...">
   ```
5. Commit and push the change, then click **Verify** in Search Console.
6. Submit your sitemap URL: `https://aok.site.je/sitemap.xml`.

---

## 📊 Google Analytics 4 (GA4) Setup

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com).
2. Create a Web Stream for `https://aok.site.je` to get your **Measurement ID** (e.g. `G-1234567890`).
3. In each HTML file, replace `G-XXXXXXXXXX` with your actual ID:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-1234567890"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-1234567890');
   </script>
   ```

---

## 📞 School Contact Reference
- **Campus:** Dhok Badam, Satramile, Bhara Kahu, Islamabad
- **Phone:** 03475409209
- **Email:** shahzadalishahjaffri@gmail.com
- **Monthly Fees:**
  - Playgroup, Nursery, Prep: Rs. 1,500
  - Class 1: Rs. 1,600
  - Classes 2, 3, 4: Rs. 1,800
  - Class 5: Rs. 2,000
  - Classes 6, 7, 8: Rs. 2,200
  - Pre-9, Class 9, Class 10 (Arts): Rs. 2,500
