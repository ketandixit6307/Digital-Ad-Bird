# Digital Ad Bird - Backend API Documentation

Welcome to the API Documentation for Digital Ad Bird. This document outlines the core routes required by the HCLTech Backend Engineering Assignment.

## Base URL
`http://localhost:5000/api`

## Authentication
All protected routes require a JWT token in the `Authorization` header:
`Authorization: Bearer <token>`

---

## 1. Authentication APIs (`/auth`)
- `POST /auth/register` - Register a new user and initialize a business account.
- `POST /auth/login` - Authenticate a user and receive a JWT token.
- `GET /auth/me` - Retrieve current authenticated user session data.

## 2. Dashboard Analytics (`/dashboard`)
- `GET /dashboard/stats` - Retrieves real-time statistics for the dashboard (Total Contacts, Total Messages, Campaigns, and Message directionality) required for real-time analytics.
- `GET /dashboard/activity` - Retrieves the recent activity log for the workflow engine.

## 3. Contacts Management (`/contacts`)
- `GET /contacts` - Retrieve paginated list of all contacts.
- `POST /contacts` - Create a single contact manually.
- `POST /contacts/import-csv` - Upload and process a `.csv` file for bulk contact importing.
- `PUT /contacts/:id` - Update contact information and tagging system.
- `DELETE /contacts/:id` - Delete a contact.

## 4. Live Chat & Messages (`/messages`)
- `GET /messages/:contactId` - Retrieve the WhatsApp chat history with a specific contact.
- `POST /messages` - Send an outbound message to a WhatsApp number via the backend queue system.
- *Note: Real-time Socket.io updates (`message:received`) are emitted automatically to the UI upon Webhook triggers.*

## 5. Campaigns & Bulk Messaging (`/campaigns`)
- `GET /campaigns` - Retrieve all broadcast campaigns.
- `POST /campaigns` - Create a new bulk messaging campaign.
- `POST /campaigns/:id/launch` - Add the campaign to the **Redis/BullMQ queue** for scheduled targeting.
- `PUT /campaigns/:id/cancel` - Cancel a queued or processing campaign.

## 6. Automation & Rules (`/automation`)
- `GET /automation` - Get all active automation rule workflows.
- `POST /automation` - Define a new rule engine/workflow engine (e.g., auto-reply keyword logic).

## 7. Webhooks & Integrations (`/webhooks`)
- `POST /webhooks/whatsapp` - Inbound Webhook for WhatsApp API to process incoming user messages.
- `GET /webhooks/facebook` - Verification challenge endpoint for Facebook App setup.
- `POST /webhooks/facebook` - Inbound Webhook for **Facebook Ads Lead Retrieval**, pushing new leads directly to the DB.
- `POST /webhooks/stripe` - Inbound Webhook for processing Subscription payments.

## 8. Billing (`/billing`)
- `GET /billing/plans` - Fetch available subscription plans.
- `POST /billing/simulate-payment` - Mock Payment Gateway integration (Razorpay simulation).
