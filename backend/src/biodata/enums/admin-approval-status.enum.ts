export enum BiodataApprovalStatus {
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending',
  APPROVED = 'approved', 
  REJECTED = 'rejected',
  INACTIVE = 'inactive'
}

export const BIODATA_APPROVAL_STATUS_DESCRIPTIONS = {
  [BiodataApprovalStatus.IN_PROGRESS]: 'Form is being filled - not yet complete',
  [BiodataApprovalStatus.PENDING]: 'Waiting for admin review',
  [BiodataApprovalStatus.APPROVED]: 'Approved by admin - ready to go live',
  [BiodataApprovalStatus.REJECTED]: 'Rejected by admin - needs corrections',
  [BiodataApprovalStatus.INACTIVE]: 'Deactivated by admin'
};