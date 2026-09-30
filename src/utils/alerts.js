import Swal from 'sweetalert2';

// Custom dark styled SweetAlert2 theme matching Property Hub
const CustomSwal = Swal.mixin({
  background: '#111827',
  color: '#f9fafb',
  confirmButtonColor: '#3b82f6',
  cancelButtonColor: '#374151',
  customClass: {
    popup: 'swal2-dark-popup',
    title: 'swal2-dark-title',
    confirmButton: 'swal2-btn-confirm',
    cancelButton: 'swal2-btn-cancel',
  }
});

// Toast notification (top-right corner)
export const showToast = (title, icon = 'success') => {
  return Swal.fire({
    title,
    icon,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#f8fafc',
    iconColor: icon === 'success' ? '#10b981' : icon === 'error' ? '#f43f5e' : '#f59e0b',
  });
};

// Confirmation Dialog for critical actions (Delete, Suspend)
export const confirmDelete = async (title = 'Are you sure?', text = 'This action cannot be undone.') => {
  const result = await CustomSwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#ef4444',
    reverseButtons: true,
    iconColor: '#f59e0b',
  });

  return result.isConfirmed;
};

// Confirmation Dialog for Approvals
export const confirmApproval = async (title = 'Approve Listing?', text = 'This listing will become publicly visible on Property Hub app.') => {
  const result = await CustomSwal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Approve & Publish',
    cancelButtonText: 'Review Later',
    confirmButtonColor: '#10b981',
    iconColor: '#10b981',
  });

  return result.isConfirmed;
};

// Prompt Dialog for Rejection Remarks
export const promptRejectionReason = async (title = 'Reason for Rejection') => {
  const result = await CustomSwal.fire({
    title,
    input: 'textarea',
    inputPlaceholder: 'Please enter specific reason (e.g. Unclear document scan, duplicate listing)...',
    inputAttributes: {
      'aria-label': 'Type your reason here',
    },
    showCancelButton: true,
    confirmButtonText: 'Confirm Rejection',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#f43f5e',
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return 'Please enter a valid rejection reason.';
      }
    }
  });

  return result.isConfirmed ? result.value : null;
};

// Success Alert with Detailed message
export const showSuccessAlert = (title, text) => {
  return CustomSwal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'Done',
    confirmButtonColor: '#10b981',
    iconColor: '#10b981',
  });
};

export default CustomSwal;
