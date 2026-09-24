# Product Stock — Admin Dashboard

A simple and clean admin dashboard to manage products using the DummyJSON API.

---

## 🚀 Demo & Test Credentials

- **Live URL**: [https://product-admin-dashboard-omkar.vercel.app](https://product-admin-dashboard-omkar.vercel.app)
- **Username**: `emilys`
- **Password**: `emilyspass`
*(You can also click the **Auto-fill** button on the login screen)*

---

## 💻 Setup & Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## ✅ What Was Built

- **Login & Auth**: Login with DummyJSON auth, route protection for `/products`, error messages for wrong credentials, and logout.
- **Product List**: Responsive layout with a table on desktop and cards on mobile. Shows image, title, category, price ($), rating, and stock.
- **Custom Pagination**: Page-by-page loading (`limit` and `skip`), Previous/Next buttons, page size selector (10, 20, 50), and range text ("Showing X–Y of Z"). Built without third-party table libraries.
- **Search**: Debounced search (`/products/search?q=`) that waits for typing to stop and resets to page 1.
- **Filter & Sort**: Category filter dropdown (`/products/categories`) and sorting by price, rating, or title.
- **Product Details (`/products/[id]`)**: Shows image gallery, description, price, and customer reviews. Shows a 404 page for invalid product IDs.
- **Add, Edit & Delete**: Validated forms for creating and editing products, plus a confirmation popup before deleting.
- **States**: Loading spinner, empty state when no products match, and an error state with a "Try Again" retry button.
- **URL Sync**: Keeps page, search, category, and sorting values in the URL so refreshing or sharing the link keeps the state.

---

## 📝 Notes on Design Choices & Problem Solving

- **Search vs Category Filter**: The DummyJSON API doesn't support searching and category filtering at the same time. In this app, typing in the search bar takes precedence and clears the category filter (and selecting a category clears search) to keep queries reliable.
- **Handling Mock API Saves**: DummyJSON doesn't save new products or changes on its server. To keep the UI working realistically, changes (adds, edits, and deletes) are saved in browser localStorage and merged with API results so your updates stay visible while using the app.
- **Preventing Race Conditions**: Used `AbortController` with Axios so that if you type fast in the search box, older slow responses are cancelled and never overwrite newer results.
- **Double Click Prevention**: Save and Login buttons disable themselves while a request is in flight to prevent duplicate submissions.
- **Problem Faced & Fix**: DummyJSON's mock updates were disappearing when refreshing or navigating pages. Solved this by creating a lightweight local storage helper (`productStorage.js`) that remembers created, edited, and deleted items across page reloads.
- **Where AI Helped**: AI was used to brainstorm clean UI styling (warm orange theme, glass action buttons), create the custom SVG logo, and verify input validation edge cases.
