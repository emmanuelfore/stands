export type Organization = {
  id: string
  name: string
  logo_url: string | null
  created_at: string
}

export type Development = {
  id: string
  org_id: string
  name: string
  location: string | null
  description: string | null
  phases: any[]
  penalty_type: 'flat' | 'percent' | null
  penalty_value: number
  penalty_grace_days: number
  min_deposit_percent: number
  currency: 'USD'
  created_at: string
}

export type StandStatus = 'available' | 'reserved' | 'allocated' | 'transferred' | 'on_hold'

export type Stand = {
  id: string
  development_id: string
  stand_number: string
  size_sqm: number
  phase: string | null
  price_usd: number | null
  price_zwg: number | null
  status: StandStatus
  servicing: Record<string, any>
  zoning: string | null
  created_at: string
  development?: { name: string }
}

export type Buyer = {
  id: string
  org_id: string
  full_name: string
  id_number: string
  email: string
  phone: string | null
  portal_activated_at: string | null
  onboarding_complete: boolean
  referrer_id: string | null
  created_at: string
}

export type AllocationStatus = 'active' | 'transferred' | 'cancelled'

export type Allocation = {
  id: string
  stand_id: string
  buyer_id: string
  allocated_by: string | null
  allocated_at: string
  purchase_price: number
  currency: 'USD'
  deposit_amount: number
  instalment_plan: Record<string, any>
  status: AllocationStatus
  created_at: string
}

export type PaymentStatus = 'pending' | 'verified' | 'rejected'
export type PaymentMethod = 'cash' | 'ecocash' | 'zipit' | 'bank_transfer'

export type Payment = {
  id: string
  allocation_id: string
  buyer_id: string
  amount: number
  currency: 'USD'
  exchange_rate: number
  payment_method: PaymentMethod | null
  reference_number: string | null
  pop_url: string | null
  submitted_by: 'buyer' | 'admin'
  status: PaymentStatus
  verified_by: string | null
  verified_at: string | null
  rejection_note: string | null
  admin_note: string | null
  created_at: string
}

export type ScheduleItemStatus = 'pending' | 'paid' | 'overdue'

export type PaymentScheduleItem = {
  id: string
  allocation_id: string
  due_date: string
  amount_due: number
  currency: 'USD'
  status: ScheduleItemStatus
  paid_at: string | null
  created_at: string
}

export type DocumentCategory = 'offer_letter' | 'agreement' | 'receipt' | 'title_deed' | 'id_document' | 'other'

export type Document = {
  id: string
  org_id: string
  stand_id: string | null
  buyer_id: string | null
  category: DocumentCategory
  name: string
  file_url: string
  version: number
  expires_at: string | null
  uploaded_by: string | null
  created_at: string
  stand?: { stand_number: string, development: { name: string } }
  buyer?: { full_name: string }
}

export type DocumentRequestStatus = 'open' | 'in_progress' | 'fulfilled'

export type DocumentRequest = {
  id: string
  buyer_id: string
  document_type: string
  note: string | null
  status: DocumentRequestStatus
  fulfilled_at: string | null
  created_at: string
  buyer?: { full_name: string, email: string }
}
