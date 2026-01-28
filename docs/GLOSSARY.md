# Glossary: Acronyms and Technical Terms

This document explains all acronyms and technical terms used throughout the project documentation and codebase.

## Table of Contents

- [Acronyms](#acronyms)
- [Technical Terms](#technical-terms)
- [In Simple Terms: What Each Part Does](#in-simple-terms-what-each-part-does)
- [The Flow: How Everything Works Together](#the-flow-how-everything-works-together)

## Acronyms

### **API (Application Programming Interface)**
- **What it is:** The way the frontend communicates with the backend server
- **In this project:** Endpoints like `/api/applications` that return data to the frontend
- **Think of it as:** A menu at a restaurant - you order (request) and get food (data) back

### **JWT (JSON Web Token)**
- **What it is:** A secure way to prove who you are without sending your password every time
- **In this project:** Used to verify the user is logged in
- **Think of it as:** A temporary ID badge that expires after a certain time

### **OAuth 2.0**
- **What it is:** A standard way to let users sign in with external services (Google, GitHub, etc.)
- **In this project:** One option for authentication
- **Think of it as:** "Sign in with Google" buttons you see on websites

### **SAML (Security Assertion Markup Language)**
- **What it is:** An enterprise authentication standard used by large companies
- **In this project:** Another authentication option for corporate environments
- **Think of it as:** Corporate single sign-on (SSO) systems

### **RBAC (Role-Based Access Control)**
- **What it is:** Permissions based on user roles (Developer, Tech Lead, Manager, Executive)
- **In this project:** Controls what each persona can do
- **Think of it as:** Different key cards for different access levels in a building

### **CORS (Cross-Origin Resource Sharing)**
- **What it is:** Browser security that allows requests from your frontend domain to your backend domain
- **In this project:** Must be configured so the frontend can call the backend API
- **Think of it as:** A security guard checking IDs before allowing access

### **XSS (Cross-Site Scripting)**
- **What it is:** A security attack where malicious scripts run in the browser
- **In this project:** Prevented by sanitizing user input and using React's built-in protections
- **Think of it as:** Someone trying to inject harmful code into your website

### **CSRF (Cross-Site Request Forgery)**
- **What it is:** A security attack that tricks users into performing actions they didn't intend
- **In this project:** Prevented with tokens/headers
- **Think of it as:** Someone tricking you into clicking a button that does something you don't want

### **CSP (Content Security Policy)**
- **What it is:** HTTP headers that restrict which resources can load
- **In this project:** Helps prevent XSS and other attacks
- **Think of it as:** A whitelist of allowed resources

### **SSE (Server-Sent Events)**
- **What it is:** A way for the server to push updates to the browser (one-way)
- **In this project:** Alternative to WebSockets for real-time updates
- **Think of it as:** A one-way radio broadcast from server to browser

### **HTTPS (HyperText Transfer Protocol Secure)**
- **What it is:** Encrypted HTTP (the secure version)
- **In this project:** Required in production
- **Think of it as:** A secure, encrypted connection (the lock icon in your browser)

### **ERD (Entity Relationship Diagram)**
- **What it is:** A visual diagram showing database tables and how they relate
- **In this project:** Helps the developer understand data structure
- **Think of it as:** A map of how data is organized

### **OpenAPI/Swagger**
- **What it is:** A standard format for documenting APIs
- **In this project:** Used to document backend endpoints
- **Think of it as:** A detailed instruction manual for the API

### **E2E (End-to-End)**
- **What it is:** Testing that simulates a full user journey
- **In this project:** Tests like "user logs in, creates app, deploys it"
- **Think of it as:** Testing the entire flow from start to finish

### **p95 (95th Percentile)**
- **What it is:** 95% of requests are faster than this value
- **In this project:** API response time target
- **Think of it as:** "95% of the time, it's faster than this"

### **gzipped**
- **What it is:** Compressed file format to reduce size
- **In this project:** Bundle size target after compression
- **Think of it as:** Zipping a file to make it smaller

## Technical Terms

### **Frontend**
- **What it is:** The part of the application users see and interact with (in the browser)
- **In this project:** The React app you've built
- **Think of it as:** The storefront of a shop

### **Backend**
- **What it is:** The server that handles business logic and data storage
- **In this project:** Needs to be built by the developer
- **Think of it as:** The warehouse and office behind the storefront

### **Mock Data**
- **What it is:** Fake data used for development and testing
- **In this project:** Located in `src/data/mock-data.ts`, will be replaced with real API calls
- **Think of it as:** Placeholder content used during design

### **API Endpoints**
- **What it is:** URLs the frontend calls to get/send data
- **Example:** `GET /api/applications` returns a list of applications
- **Think of it as:** Specific addresses you visit to get specific information

### **Authentication**
- **What it is:** Verifying who the user is (login process)
- **In this project:** Handled by the backend
- **Think of it as:** Showing your ID to prove who you are

### **Authorization**
- **What it is:** Determining what the user can do (permissions)
- **In this project:** Based on user roles and permissions
- **Think of it as:** Checking if you have permission to enter a restricted area

### **Token Refresh**
- **What it is:** Getting a new authentication token before the old one expires
- **In this project:** Keeps users logged in without re-authenticating
- **Think of it as:** Renewing your ID badge before it expires

### **Interceptors**
- **What it is:** Code that runs before/after API requests
- **In this project:** Adds auth tokens, handles errors
- **Think of it as:** A filter that processes requests and responses

### **State Management**
- **What it is:** How the app stores and updates data
- **In this project:** Zustand for UI state, TanStack Query for server data
- **Think of it as:** A filing system for app data

### **Query Cache**
- **What it is:** Storing API responses to avoid duplicate requests
- **In this project:** TanStack Query handles this automatically
- **Think of it as:** Remembering answers so you don't have to ask again

### **Cache Invalidation**
- **What it is:** Clearing cached data when it becomes outdated
- **In this project:** After creating/updating data, refresh the cache
- **Think of it as:** Throwing away old information when new information arrives

### **SPA (Single Page Application)**
- **What it is:** An app that loads once and updates content without full page reloads
- **In this project:** The entire app is a SPA
- **Think of it as:** A single page that changes content dynamically

### **SPA Routing**
- **What it is:** Handling URLs in a single-page app
- **In this project:** All routes must serve `index.html` so React Router can handle them
- **Think of it as:** Changing the address bar without reloading the page

### **Code Splitting**
- **What it is:** Breaking the app into smaller chunks loaded on demand
- **In this project:** Improves initial load time
- **Think of it as:** Loading only what you need, when you need it

### **Tree Shaking**
- **What it is:** Removing unused code from the final bundle
- **In this project:** Reduces bundle size automatically
- **Think of it as:** Removing unused tools from a toolbox

### **Bundle Size**
- **What it is:** Total size of JavaScript files sent to the browser
- **In this project:** Target is under 500KB after compression
- **Think of it as:** The total weight of your app's code

### **Source Maps**
- **What it is:** Files that map minified code back to original code for debugging
- **In this project:** Helpful for production debugging
- **Think of it as:** A translation guide for compressed code

### **Asset Hashing**
- **What it is:** Adding unique hashes to filenames (e.g., `app-abc123.js`)
- **In this project:** Enables long-term caching and cache busting
- **Think of it as:** Version numbers in filenames

### **Static Hosting**
- **What it is:** Serving pre-built files (HTML, CSS, JS) from a simple server
- **In this project:** Options include Vercel, Netlify, AWS S3
- **Think of it as:** Serving files from a CD or USB drive

### **Container Deployment**
- **What it is:** Packaging the app in a Docker container
- **In this project:** Alternative to static hosting
- **Think of it as:** Shipping your app in a standardized box

### **CDN (Content Delivery Network)**
- **What it is:** A network of servers that serve files from locations close to users
- **In this project:** Improves load times globally
- **Think of it as:** Having copies of your app in multiple locations worldwide

### **Environment Variables**
- **What it is:** Configuration values that change per environment (dev/staging/prod)
- **In this project:** API URLs, feature flags, etc.
- **Think of it as:** Settings that change based on where the app runs

### **Feature Flags**
- **What it is:** Toggles to enable/disable features without code changes
- **In this project:** Allows gradual feature rollouts
- **Think of it as:** Light switches for features

### **Error Boundaries**
- **What it is:** React components that catch and handle errors
- **In this project:** Prevents the entire app from crashing
- **Think of it as:** Safety nets that catch errors

### **Loading States**
- **What it is:** UI shown while data is being fetched
- **In this project:** Skeletons, spinners, etc.
- **Think of it as:** "Loading..." messages

### **WebSocket**
- **What it is:** A persistent connection for real-time, two-way communication
- **In this project:** For live updates (deployments, incidents)
- **Think of it as:** A phone call that stays open for instant communication

### **Server-Sent Events (SSE)**
- **What it is:** One-way server-to-browser updates
- **In this project:** Alternative to WebSockets for simpler real-time updates
- **Think of it as:** A one-way radio broadcast

### **Rate Limiting**
- **What it is:** Restricting how many requests a user can make
- **In this project:** Prevents abuse and overload
- **Think of it as:** Limiting how many times you can ask a question per minute

### **Input Validation**
- **What it is:** Checking user input before processing
- **In this project:** Prevents bad data and security issues
- **Think of it as:** Checking ID before allowing entry

### **Error Tracking**
- **What it is:** Logging and monitoring errors in production
- **In this project:** Tools like Sentry
- **Think of it as:** An alarm system that alerts when something breaks

### **Performance Monitoring**
- **What it is:** Tracking how fast the app loads and responds
- **In this project:** Tools like DataDog, Google Analytics
- **Think of it as:** A speedometer for your app

### **User Analytics**
- **What it is:** Tracking how users interact with the app
- **In this project:** Which features are used, user flows, etc.
- **Think of it as:** Tracking which aisles customers visit in a store

### **API Monitoring**
- **What it is:** Tracking API health, response times, errors
- **In this project:** Ensures the backend is performing well
- **Think of it as:** Health checks for the backend

### **Seed Data**
- **What it is:** Initial data used to populate a database
- **In this project:** Mock data can be used as seed data
- **Think of it as:** Starter content for a new database

### **Deployment Pipeline**
- **What it is:** Automated steps to build, test, and deploy
- **In this project:** CI/CD (Continuous Integration/Continuous Deployment)
- **Think of it as:** An assembly line for deploying your app

### **CI/CD (Continuous Integration/Continuous Deployment)**
- **What it is:** Automating testing and deployment
- **In this project:** Push code → tests run → deploy if tests pass
- **Think of it as:** An automated factory that builds and ships your app

### **Rollback**
- **What it is:** Reverting to a previous version if something breaks
- **In this project:** Quick way to undo a bad deployment
- **Think of it as:** Going back to a previous version

### **Health Checks**
- **What it is:** Endpoints that report if the service is running
- **In this project:** `/health` endpoint for monitoring
- **Think of it as:** A heartbeat check

### **Unit Tests**
- **What it is:** Tests for individual functions/components
- **In this project:** Tests for buttons, utilities, etc.
- **Think of it as:** Testing individual parts in isolation

### **Integration Tests**
- **What it is:** Tests for how multiple parts work together
- **In this project:** Tests for API calls, authentication flow
- **Think of it as:** Testing how parts work together

### **End-to-End (E2E) Tests**
- **What it is:** Tests that simulate real user workflows
- **In this project:** Tests like "user logs in and creates an app"
- **Think of it as:** Testing the entire user journey

### **Time to Interactive (TTI)**
- **What it is:** How long until the app is fully usable
- **In this project:** Target is under 3 seconds
- **Think of it as:** How long until you can actually use the app

### **p95 Response Time**
- **What it is:** 95% of requests are faster than this
- **In this project:** API target is under 500ms
- **Think of it as:** "95% of the time, it's faster than this"

### **Gzip Compression**
- **What it is:** Compressing files to reduce size
- **In this project:** Reduces download time
- **Think of it as:** Zipping files to make them smaller

### **TypeScript Types**
- **What it is:** Definitions that describe what data looks like
- **In this project:** Ensures data matches expected structure
- **Think of it as:** Blueprints for data

### **Axios**
- **What it is:** A library for making HTTP requests
- **In this project:** Alternative to `fetch` for API calls
- **Think of it as:** A tool for talking to the backend

### **Interceptors (Axios)**
- **What it is:** Functions that run before requests or after responses
- **In this project:** Add auth tokens, handle errors globally
- **Think of it as:** Middleware that processes requests/responses

### **Zustand**
- **What it is:** A lightweight state management library
- **In this project:** Manages UI state (sidebar open/closed, theme, etc.)
- **Think of it as:** A simple storage system for app state

### **TanStack Query (React Query)**
- **What it is:** A library for fetching and caching server data
- **In this project:** Handles API calls, caching, loading states
- **Think of it as:** A smart data fetcher with memory

### **React Router**
- **What it is:** A library for handling navigation/routing
- **In this project:** Manages page navigation
- **Think of it as:** A GPS for your app's pages

### **@dnd-kit**
- **What it is:** A library for drag-and-drop functionality
- **In this project:** Used for dashboard widget reordering
- **Think of it as:** Tools for dragging and dropping items

### **Vite**
- **What it is:** A build tool for fast development and optimized production builds
- **In this project:** Builds the React app
- **Think of it as:** A factory that builds your app

### **Tailwind CSS**
- **What it is:** A utility-first CSS framework
- **In this project:** Used for styling
- **Think of it as:** Pre-built styling tools

### **Design Tokens**
- **What it is:** Reusable design values (colors, spacing, etc.)
- **In this project:** CSS variables that define the design system
- **Think of it as:** A design system's vocabulary

### **WCAG (Web Content Accessibility Guidelines)**
- **What it is:** Standards for web accessibility
- **In this project:** Target is WCAG 2.1 AA compliance
- **Think of it as:** Rules for making websites accessible to everyone

### **ARIA (Accessible Rich Internet Applications)**
- **What it is:** HTML attributes that improve screen reader support
- **In this project:** Used throughout for accessibility
- **Think of it as:** Labels that help screen readers understand the page

## In Simple Terms: What Each Part Does

### **Frontend (What You Built)**
- The user interface that users see and interact with
- Makes requests to the backend for data
- Handles user interactions and displays information

### **Backend (What Developer Needs to Build)**
- The server that stores data and handles business logic
- Receives requests from the frontend
- Returns data or performs actions

### **API (The Connection)**
- The contract between frontend and backend
- Defines what data can be requested and how

### **Authentication (Login)**
- Verifies who the user is
- Issues tokens to prove identity

### **Authorization (Permissions)**
- Determines what the user can do
- Based on roles and permissions

### **Database**
- Where data is stored
- Tables for users, applications, deployments, etc.

### **Deployment (Going Live)**
- Process of putting the app on a server so users can access it
- Includes building, testing, and publishing

### **Monitoring (Watching the App)**
- Tracking errors, performance, and usage
- Helps catch and fix issues quickly

## The Flow: How Everything Works Together

1. **User opens the app** → Frontend loads
2. **User logs in** → Frontend sends credentials → Backend verifies → Returns token
3. **User views dashboard** → Frontend requests data → Backend queries database → Returns data → Frontend displays it
4. **User creates an app** → Frontend sends data → Backend saves to database → Returns confirmation → Frontend updates UI

---

For more information, see:
- [Developer Handoff Guide](DEVELOPER_HANDOFF.md) - Complete guide for backend integration
- [Architecture Documentation](ARCHITECTURE.md) - System architecture details
- [API Specification](API_SPECIFICATION.md) - Backend API requirements (to be created)
