# Digital Ad Bird Dashboard - HCLTech Assessment

This repository contains the complete full-stack implementation of the **Digital Ad Bird Dashboard** required for the HCLTech Backend Engineering Assignment.

## 🚀 Overview

The Digital Ad Bird Dashboard is a comprehensive B2B SaaS application tailored for managing business communications, social campaigns, automation workflows, and customer relationships. It features real-time interactions, a scalable backend queue system, and seamless third-party integrations.

## 📋 Requirements Fulfilled

### 1. Dashboard
- **Stats Tracked:** Messages, Campaigns, Leads (Total Contacts), and Revenue (Mocked via subscriptions).
- **Real-Time Analytics:** WebSockets used for active conversations and live data metrics.

### 2. Live Chat
- **WhatsApp Interface:** Complete multi-agent chat interface with real-time UI updates.
- **Flow Implemented:** WhatsApp → Webhook → Backend API → MongoDB → Socket.io → Frontend UI.

### 3. Contacts
- Fully functioning CRUD APIs.
- CSV Import functionality with tagging systems enabled via Multer.

### 4. Campaigns
- Bulk messaging and targeting scheduling capabilities.
- **Queue System:** Robust job processing utilizing Redis and BullMQ.

### 5. Automation
- Rule engine and workflow automation module allowing trigger-based logic execution.

### 6. Integrations
- **WhatsApp API & Facebook Ads Flow:** Webhook verification and listener endpoints for Facebook Lead generation.
- **Payment Gateway:** A complete UI simulation of a Razorpay checkout for billing/subscription plans.

### 7. Architecture
- **Backend:** Node.js, Express.js, MongoDB (Atlas cluster).
- **Real-Time:** Socket.io for bi-directional live events.
- **Queues:** Redis/BullMQ.
- **Auth:** Secure JWT-based authentication.
- **Frontend:** Next.js (React), Tailwind CSS, Lucide Icons.

## 📖 Documentation
Please refer to the `API_DOCS.md` file for comprehensive details on all the backend API endpoints mapped out for this project.

## 💻 Running the Project Locally

### Backend
1. Navigate to the `/backend` directory.
2. Install dependencies: `npm install`
3. Verify your `.env` file containing MongoDB URI and JWT Keys.
4. Run the server: `npm run dev`

### Frontend
1. Navigate to the `/frontend` directory.
2. Install dependencies: `npm install`
3. Run the application: `npm run dev`
4. Access the dashboard at `http://localhost:3000`
