# Requirements Document

## Introduction

StandVault is a React 18 / TypeScript / Supabase platform for managing real estate stand allocations, instalment payments, and buyer self-service portals. The codebase already contains routing, UI scaffolding, hooks, and utility functions, but a significant number of features are either stub pages, wired to hardcoded data, or missing their persistence and business-logic layers entirely.

This document captures the full set of requirements needed to complete every incomplete or stubbed feature so that StandVault is production-ready. The scope covers: stub page implementations, real-data wiring for the Admin Dashboard and Reports, buyer-facing interactions (grace period, support queries, milestone celebrations), admin workflow persistence (bulk matching, transfer/cession, penalty engine, import wizard), form validation and duplicate detection, loading/error states, pagination, role-based access control, and the missing database schema objects.

---

## Glossary

- **Admin**: An authenticated user with administrative privileges who manages developments, stands, buyers, and payments.
- **Buyer**: An authenticated user who has purchased or is purchasing a stand and accesses the self-service portal.
- **Allocation**: A record linking a Buyer to a Stand with a purchase price, deposit, and instalment plan.
- **Stand**: A discrete plot of land within a Development that can be sold.
- **Development**: A real estate project containing one or more Stands.
- **Payment**: A buyer-submitted or admin-recorded financial transaction against an Allocation.
- **Payment_Schedule_Item**: A single instalment row generated at allocation time, with a due date, amount, currency, and status.
- **Penalty**: A calculated late-payment charge applied to an overdue Payment_Schedule_Item.
- **Cession**: The legal transfer of stand rights from one Buyer to another.
- **PoP**: Proof of Payment — an image or document uploaded by a Buyer to evidence a payment.
- **Bulk_Matcher**: The system component that reconciles bank statement rows against pending PoPs.
- **Import_Wizard**: The UI component that parses Excel/CSV files and batch-inserts Stands or Buyers into Supabase.
- **KPI**: Key Performance Indicator — a summary metric displayed on the Admin Dashboard.
- **Aged_Debt**: Outstanding balances grouped by how many days overdue they are (0–30, 31–60, 61–90, 90+ days).
- **Grace_Period**: A short extension granted to a Buyer that defers the overdue status of a Payment_Schedule_Item.
- **Support_Query**: A message submitted by a Buyer requesting help from an Admin.
- **Milestone**: A progress threshold (e.g. deposit paid, 25% complete, 50% complete, fully paid) that triggers a celebration UI.
- **Role**: A permission level assigned to an authenticated user — either `admin` or `buyer`.
- **RLS**: Row Level Security — Supabase/PostgreSQL policy that restricts data access per authenticated user.
- **Audit_Log**: An append-only record of significant state changes (payment verified, penalty applied, cession completed, etc.).
- **Pretty_Printer**: A function that serialises a structured object back into a canonical string or document format.

---

## Requirements

### Requirement 1: Admin Settings Page

**User Story:** As an Admin, I want a functional Settings page, so that I can configure organisation-level preferences such as branding, penalty defaults, and notification settings.

#### Acceptance Criteria

1. THE Admin_Settings_Page SHALL replace the `<div>Settings</div>` stub and render a fully structured settings UI within the `/admin/settings` route.
2. WHEN the Admin loads the Settings page, THE Admin_Settings_Page SHALL display the current organisation name, logo URL, default penalty rate, default grace period days, and default currency.
3. WHEN the Admin submits the settings form with valid values, THE Admin_Settings_Page SHALL persist the changes to the `organizations` and `developments` tables in Supabase and display a success confirmation.
4. IF the Admin submits the settings form with an empty organisation name, THEN THE Admin_Settings_Page SHALL display an inline validation error and SHALL NOT submit the form.
5. WHILE a settings save operation is in progress, THE Admin_Settings_Page SHALL display a loading indicator on the save button and SHALL disable the form controls.
6. IF the Supabase update operation fails, THEN THE Admin_Settings_Page SHALL display a descriptive error message without navigating away.

---

### Requirement 2: Buyer Payment History Page

**User Story:** As a Buyer, I want to view my full payment history, so that I can track every payment I have submitted and its verification status.

#### Acceptance Criteria

1. THE Buyer_Payment_History_Page SHALL replace the `<div>Payment History</div>` stub and render within the `/portal/payments` route.
2. WHEN the Buyer loads the Payment History page, THE Buyer_Payment_History_Page SHALL query the `payments` table filtered by the authenticated buyer's `id` and display each payment's date, amount, currency, method, reference number, and status.
3. THE Buyer_Payment_History_Page SHALL display payments sorted by `created_at` descending.
4. WHEN a payment has `status = 'verified'`, THE Buyer_Payment_History_Page SHALL render a green "Verified" badge.
5. WHEN a payment has `status = 'pending'`, THE Buyer_Payment_History_Page SHALL render an amber "Pending" badge.
6. WHEN a payment has `status = 'rejected'`, THE Buyer_Payment_History_Page SHALL render a red "Rejected" badge and display the `rejection_note` if present.
7. WHILE the payment data is loading, THE Buyer_Payment_History_Page SHALL display skeleton placeholder rows.
8. IF the query returns zero payments, THEN THE Buyer_Payment_History_Page SHALL display an empty-state message prompting the Buyer to submit their first payment.

---

### Requirement 3: Buyer Document Vault Page

**User Story:** As a Buyer, I want to access my document vault, so that I can download my agreement of sale, receipts, and other documents related to my stand.

#### Acceptance Criteria

1. THE Buyer_Document_Vault_Page SHALL replace the `<div>Vault</div>` stub and render within the `/portal/documents` route.
2. WHEN the Buyer loads the Document Vault, THE Buyer_Document_Vault_Page SHALL query the `documents` table filtered by the authenticated buyer's `id` and display each document's name, category, upload date, and a download link.
3. WHEN the Buyer clicks a document's download link, THE Buyer_Document_Vault_Page SHALL open the `file_url` in a new browser tab.
4. WHILE document data is loading, THE Buyer_Document_Vault_Page SHALL display skeleton placeholder cards.
5. IF the query returns zero documents, THEN THE Buyer_Document_Vault_Page SHALL display an empty-state message and a button to submit a document request.
6. WHEN the Buyer submits a document request, THE Buyer_Document_Vault_Page SHALL insert a row into the `document_requests` table with `status = 'open'` and display a confirmation message.

---

### Requirement 4: Buyer Profile Page

**User Story:** As a Buyer, I want to view and update my profile, so that I can keep my contact details current.

#### Acceptance Criteria

1. THE Buyer_Profile_Page SHALL replace the `<div>Your Profile</div>` stub and render within the `/portal/profile` route.
2. WHEN the Buyer loads the Profile page, THE Buyer_Profile_Page SHALL display the buyer's full name, email, phone number, ID number, and portal activation date sourced from the `buyers` table.
3. WHEN the Buyer submits the profile form with a valid phone number, THE Buyer_Profile_Page SHALL update the `phone` field in the `buyers` table and display a success toast.
4. IF the Buyer submits the profile form with an empty phone number, THEN THE Buyer_Profile_Page SHALL display an inline validation error and SHALL NOT submit the form.
5. WHILE a profile update is in progress, THE Buyer_Profile_Page SHALL display a loading indicator and disable the submit button.
6. IF the Supabase update fails, THEN THE Buyer_Profile_Page SHALL display a descriptive error message.

---

### Requirement 5: Admin Dashboard — Real Data Wiring

**User Story:** As an Admin, I want the dashboard KPIs and charts to reflect live database values, so that I can make informed decisions based on accurate data.

#### Acceptance Criteria

1. WHEN the Admin Dashboard loads, THE Admin_Dashboard SHALL query Supabase to compute and display: total active buyer count, total active allocation count, count of payments with `status = 'pending'`, count of Payment_Schedule_Items with `status = 'overdue'`, and total verified payment revenue for the current calendar year.
2. WHEN the Admin Dashboard loads, THE Admin_Dashboard SHALL query verified payments grouped by calendar month for the trailing 6 months and render the result as an AreaChart using Recharts.
3. WHEN the Admin Dashboard loads, THE Admin_Dashboard SHALL query the 5 most recent payments with `status = 'pending'` and render them in the Verification Queue preview panel with buyer name, amount, development name, and time elapsed since submission.
4. WHILE any dashboard query is loading, THE Admin_Dashboard SHALL display skeleton placeholder elements in place of KPI values and chart areas.
5. IF any dashboard query fails, THEN THE Admin_Dashboard SHALL display an inline error indicator for the affected KPI or chart without crashing the entire page.
6. THE Admin_Dashboard SHALL re-fetch all KPI data at most every 5 minutes using React Query's `staleTime` configuration.

---

### Requirement 6: Reports Page — Live Chart Rendering

**User Story:** As an Admin, I want the Reports page charts to display real data, so that I can analyse collection performance and aged debt without exporting to a spreadsheet.

#### Acceptance Criteria

1. WHEN the Admin opens the Reports page, THE Reports_Page SHALL replace the "Chart visualization will render here" placeholder with a Recharts AreaChart showing monthly verified payment totals for the trailing 12 months.
2. WHEN the Admin opens the Reports page, THE Reports_Page SHALL replace the "Aged debt breakdown will render here" placeholder with a Recharts BarChart showing outstanding balance totals grouped into buckets: 0–30 days, 31–60 days, 61–90 days, and 90+ days overdue.
3. WHEN the Admin clicks the download button on a report card, THE Reports_Page SHALL generate and trigger a browser download of the corresponding report in the selected format (PDF via pdfmake, or CSV via a serialised string).
4. THE Reports_Page SHALL include a Pretty_Printer function that serialises report data into a valid CSV string such that parsing the CSV and re-serialising it produces an equivalent string (round-trip property).
5. WHILE report data is loading, THE Reports_Page SHALL display skeleton placeholders inside each chart container.
6. IF a report data query fails, THEN THE Reports_Page SHALL display an error message inside the affected chart container.

---

### Requirement 7: Buyer Grace Period Request

**User Story:** As a Buyer, I want to request a grace period extension from the Payment Schedule page, so that I can defer an overdue instalment without incurring an immediate penalty.

#### Acceptance Criteria

1. WHEN the Buyer clicks the grace period banner on the Payment Schedule page, THE Grace_Period_Modal SHALL open and display the overdue instalment's due date and amount.
2. WHEN the Buyer submits the grace period request, THE Grace_Period_Modal SHALL insert a row into the `document_requests` table with `document_type = 'grace_period_request'` and `status = 'open'`, and SHALL display a confirmation message.
3. IF the Buyer has already submitted a grace period request for the same allocation within the last 30 days, THEN THE Grace_Period_Modal SHALL display a message stating a request is already pending and SHALL NOT insert a duplicate row.
4. WHILE the grace period request is being submitted, THE Grace_Period_Modal SHALL display a loading indicator on the submit button.
5. IF the submission fails, THEN THE Grace_Period_Modal SHALL display a descriptive error message without closing the modal.

---

### Requirement 8: Buyer Support Query

**User Story:** As a Buyer, I want to submit a support query from the dashboard, so that I can get help from the admin team without leaving the portal.

#### Acceptance Criteria

1. WHEN the Buyer clicks the "Query" button on the Buyer Dashboard, THE Support_Query_Modal SHALL open with a text area for the Buyer's message.
2. WHEN the Buyer submits a non-empty message, THE Support_Query_Modal SHALL insert a row into the `document_requests` table with `document_type = 'support_query'`, the message in the `note` field, and `status = 'open'`, then display a confirmation.
3. IF the Buyer submits an empty message, THEN THE Support_Query_Modal SHALL display an inline validation error and SHALL NOT submit the form.
4. WHILE the query is being submitted, THE Support_Query_Modal SHALL display a loading indicator.
5. IF the submission fails, THEN THE Support_Query_Modal SHALL display a descriptive error message.

---

### Requirement 9: Milestone Celebration Trigger

**User Story:** As a Buyer, I want to see a celebration animation when I reach a payment milestone, so that I feel motivated to continue paying.

#### Acceptance Criteria

1. WHEN the Buyer's payment progress crosses 25%, 50%, 75%, or 100% of the total purchase price for the first time, THE Buyer_Dashboard SHALL render the `MilestoneCelebration` component with the appropriate milestone label.
2. THE Buyer_Dashboard SHALL track which milestones have already been celebrated using `localStorage` keyed by allocation ID, so that the celebration is shown at most once per milestone per device.
3. WHEN the Buyer dismisses the `MilestoneCelebration` modal, THE Buyer_Dashboard SHALL record the milestone as seen in `localStorage` and SHALL NOT show it again on subsequent page loads.
4. THE MilestoneCelebration component SHALL fire the confetti animation for exactly 3 seconds after mounting.

---

### Requirement 10: Bulk Matching — Persist Verified Payments

**User Story:** As an Admin, I want bulk-matched payments to be saved to Supabase, so that verified payments are reflected in buyer balances and the payment queue.

#### Acceptance Criteria

1. WHEN the Admin clicks "Verify N Matches" on the Bulk Matching page, THE Bulk_Matcher SHALL call `verifyPayment` for each matched payment and update its `status` to `'verified'` in the `payments` table.
2. WHEN all matched payments have been verified, THE Bulk_Matcher SHALL invalidate the `['payments', 'pending']` React Query cache and display a success summary showing how many payments were verified.
3. IF any individual payment verification fails during the bulk operation, THEN THE Bulk_Matcher SHALL continue processing remaining matches and SHALL display a final error summary listing the failed payment IDs.
4. WHILE the bulk verification is in progress, THE Bulk_Matcher SHALL display a progress indicator showing `X of Y` payments processed.
5. THE Bulk_Matcher SHALL update the corresponding Payment_Schedule_Item `status` to `'paid'` and set `paid_at` to the current timestamp for each successfully verified payment whose amount matches the schedule item's `amount_due` within a tolerance of $0.01.

---

### Requirement 11: Transfer Workflow — Database Persistence

**User Story:** As an Admin, I want the Transfer/Cession workflow to update the database, so that stand ownership is accurately reflected after a cession is completed.

#### Acceptance Criteria

1. WHEN the Admin selects a current holder and a new transferee on the Transfer Workflow page, THE Transfer_Workflow SHALL validate that the current holder's allocation has `status = 'active'` and that the deposit has been fully paid before enabling the "Generate Cession Certificates" button.
2. WHEN the Admin clicks "Generate Cession Certificates", THE Transfer_Workflow SHALL use pdfmake to generate a cession document containing both parties' names, ID numbers, stand details, and the cession fee total, and SHALL trigger a browser download.
3. WHEN the Admin confirms the cession after document generation, THE Transfer_Workflow SHALL update the existing allocation's `status` to `'transferred'`, create a new allocation for the transferee with `status = 'active'`, and update the stand's `status` to `'allocated'` in a single Supabase transaction.
4. IF the Supabase transaction fails, THEN THE Transfer_Workflow SHALL display a descriptive error message and SHALL NOT partially update the database.
5. WHEN the cession is completed, THE Transfer_Workflow SHALL insert an Audit_Log entry recording the admin user ID, the old buyer ID, the new buyer ID, the stand ID, and the timestamp.

---

### Requirement 12: Penalty Engine — Bulk Application Persistence

**User Story:** As an Admin, I want calculated penalties to be saved to the database when I apply them in bulk, so that buyer balances accurately reflect late payment charges.

#### Acceptance Criteria

1. WHEN the Admin loads the Penalty Management page, THE Penalty_Engine SHALL query all Payment_Schedule_Items with `status = 'overdue'` joined with their allocations and buyers, and display them in the Active Penalty Ledger replacing the hardcoded mock rows.
2. WHEN the Admin clicks "Apply All Calculated Penalties", THE Penalty_Engine SHALL insert a `penalties` row for each overdue item using the configured daily rate and days overdue, with `status = 'approved'`.
3. WHEN the Admin saves the Global Configuration, THE Penalty_Engine SHALL persist the `penalty_value` and `penalty_grace_days` to the relevant `developments` row in Supabase.
4. IF a penalty row already exists for a given Payment_Schedule_Item with `status = 'approved'`, THEN THE Penalty_Engine SHALL skip that item and SHALL NOT insert a duplicate penalty.
5. WHILE the bulk penalty application is in progress, THE Penalty_Engine SHALL display a loading indicator and disable the "Apply All" button.
6. IF the bulk insert fails, THEN THE Penalty_Engine SHALL display a descriptive error message.

---

### Requirement 13: Import Wizard Integration

**User Story:** As an Admin, I want to import stands and buyers from Excel/CSV files directly from the Developments and Buyers pages, so that I can onboard large datasets without manual data entry.

#### Acceptance Criteria

1. THE Developments_Page SHALL include an "Import Stands" button that opens the `ImportWizard` component with `type = 'stands'`.
2. THE Buyers_Page SHALL include an "Import Buyers" button that opens the `ImportWizard` component with `type = 'buyers'`.
3. WHEN the Admin completes the Import Wizard and clicks "Commit Import" for stands, THE Import_Wizard SHALL batch-insert the mapped rows into the `stands` table in Supabase and display a success summary with the count of inserted records.
4. WHEN the Admin completes the Import Wizard and clicks "Commit Import" for buyers, THE Import_Wizard SHALL batch-insert the mapped rows into the `buyers` table in Supabase and display a success summary with the count of inserted records.
5. IF any row in the import batch fails validation (missing required field or duplicate `id_number` for buyers / duplicate `stand_number` within the same development for stands), THEN THE Import_Wizard SHALL display that row in an error list and SHALL NOT insert it, while still inserting valid rows.
6. WHEN the import completes, THE Import_Wizard SHALL invalidate the relevant React Query cache (`['stands']` or `['buyers']`) so the parent page reflects the new data.

---

### Requirement 14: Payment Form Validation and Duplicate Detection

**User Story:** As a Buyer, I want the payment submission form to validate my input and warn me about duplicate submissions, so that I do not accidentally submit the same payment twice.

#### Acceptance Criteria

1. WHEN the Buyer submits the payment form with an amount of 0 or less, THE Submit_Payment_Form SHALL display an inline validation error on the amount field and SHALL NOT submit the form.
2. WHEN the Buyer submits the payment form with a reference number that already exists in the `payments` table for the same allocation, THE Submit_Payment_Form SHALL display a duplicate-detection warning message and SHALL NOT insert a new payment row.
3. WHEN the Buyer submits the payment form without attaching a proof of payment file, THE Submit_Payment_Form SHALL display an inline validation error on the file field and SHALL NOT submit the form.
4. THE Submit_Payment_Form SHALL validate that the reference number field is not empty before enabling the submit button.
5. IF the duplicate check query fails, THEN THE Submit_Payment_Form SHALL log the error and allow the submission to proceed, displaying a non-blocking advisory message.

---

### Requirement 15: Loading States and Error Boundaries

**User Story:** As a user, I want every page to show meaningful loading indicators and handle errors gracefully, so that I am never left staring at a blank screen.

#### Acceptance Criteria

1. THE Application SHALL wrap each top-level route component in a React Error Boundary that catches unhandled render errors and displays a user-friendly fallback UI with a "Reload Page" button.
2. WHEN any React Query fetch is in the `isLoading` state, THE affected page or section SHALL display skeleton placeholder elements sized to match the expected content.
3. WHEN any React Query fetch enters the `isError` state, THE affected page or section SHALL display an inline error message with a "Retry" button that calls `refetch()`.
4. WHILE a mutation (insert, update, delete) is pending, THE triggering button SHALL display a spinner and SHALL be disabled to prevent duplicate submissions.

---

### Requirement 16: Buyers Table Pagination

**User Story:** As an Admin, I want the Buyers table to be paginated, so that the page does not become slow when there are hundreds of buyers.

#### Acceptance Criteria

1. THE Buyers_Page SHALL fetch buyers in pages of 25 records using Supabase's `.range()` method.
2. WHEN the Admin clicks "Next", THE Buyers_Page SHALL fetch the next page of 25 buyers and update the table.
3. WHEN the Admin clicks "Previous", THE Buyers_Page SHALL fetch the previous page of 25 buyers and update the table.
4. THE Buyers_Page SHALL display the current page number and total buyer count in the pagination footer.
5. WHILE a page transition is loading, THE Buyers_Page SHALL display skeleton rows in the table body.
6. WHEN the search term changes, THE Buyers_Page SHALL reset to page 1 and re-fetch using the new filter.

---

### Requirement 17: Role-Based Access Control

**User Story:** As a system operator, I want authentication and routing to be based on a proper role field rather than email string matching, so that the access control is secure and maintainable.

#### Acceptance Criteria

1. THE Application SHALL read the authenticated user's role from `user.user_metadata.role` (set at sign-up or via Supabase admin) rather than inspecting the email string.
2. WHEN an authenticated user with `role = 'admin'` navigates to `/portal/*`, THE Application SHALL redirect them to `/admin`.
3. WHEN an authenticated user with `role = 'buyer'` navigates to `/admin/*`, THE Application SHALL redirect them to `/portal`.
4. WHEN an unauthenticated user navigates to any protected route, THE Application SHALL redirect them to the appropriate login page.
5. THE Supabase RLS policies SHALL restrict `buyers` table reads to rows where `email = auth.email()` for buyer-role sessions, and allow unrestricted reads for admin-role sessions.
6. IF a user's `role` metadata is absent or unrecognised, THEN THE Application SHALL redirect them to the landing page and display a "Contact support" message.

---

### Requirement 18: Database Schema — Audit Log and Status Triggers

**User Story:** As a system operator, I want database-level audit logging and automatic status updates, so that the system maintains data integrity without relying solely on client-side logic.

#### Acceptance Criteria

1. THE Database SHALL contain an `audit_logs` table with columns: `id`, `org_id`, `actor_id`, `action` (text), `entity_type` (text), `entity_id` (uuid), `old_value` (jsonb), `new_value` (jsonb), `created_at`.
2. THE Database SHALL contain a PostgreSQL trigger on the `payments` table that, WHEN a payment's `status` is updated to `'verified'`, automatically finds the matching Payment_Schedule_Item by `allocation_id` and `amount_due` (within $0.01 tolerance) and sets its `status` to `'paid'` and `paid_at` to `now()`.
3. THE Database SHALL contain a PostgreSQL trigger or scheduled function that sets Payment_Schedule_Item `status` to `'overdue'` for all rows where `due_date < current_date` and `status = 'pending'`.
4. THE Database SHALL contain a migration file that adds the `audit_logs` table and both triggers, applied after the initial schema migration.
5. FOR ALL payment verification events, THE audit_logs trigger SHALL record the `actor_id`, `entity_id`, `old_value`, and `new_value` such that replaying the log reproduces the final payment status (round-trip property).
