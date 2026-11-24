/**
 * The Ambassadors of Knowledge - Admin Dashboard Core Controller
 * Manages dashboard views, real-time metrics, interactive charts, CRUD modals, and print engines.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Enforce Authentication
  if (!window.SchoolAuth || !window.SchoolAuth.requireAuth()) {
    return;
  }

  const currentUser = window.SchoolAuth.getCurrentUser();
  initCurrentUserUI(currentUser);
  initNavigation();
  initDashboardOverview();
  initInquiriesView();
  initStudentsView();
  initFeesView();
  initClassesView();
  initStaffView();
  initNoticesView();
  initGalleryView();
  initSettingsView();
  initGlobalSearch();
  initMobileSidebar();

  // Listen to database updates across tabs/actions
  window.addEventListener('aok_db_updated', () => {
    updateBadges();
  });

  updateBadges();
});

// Toast System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
  } else {
    iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// User Profile in Sidebar & Header
function initCurrentUserUI(user) {
  if (!user) return;
  const nameEls = document.querySelectorAll('.sidebar-user-name, .header-user-name');
  const roleEls = document.querySelectorAll('.sidebar-user-role, .header-user-role');
  const avatarEls = document.querySelectorAll('.sidebar-user-avatar, .header-user-avatar');

  nameEls.forEach(el => el.textContent = user.name);
  roleEls.forEach(el => el.textContent = user.role);
  if (user.avatar) {
    avatarEls.forEach(el => el.src = user.avatar);
  }

  const logoutBtns = document.querySelectorAll('.action-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to log out of the School Admin Panel?')) {
        window.SchoolAuth.logout();
      }
    });
  });
}

// Mobile Sidebar Toggle
function initMobileSidebar() {
  const toggleBtn = document.getElementById('mobile-sidebar-toggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
  });

  // Close when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
      sidebar.classList.remove('mobile-open');
    }
  });
}

// Navigation View Switcher
function initNavigation() {
  const navItems = document.querySelectorAll('.sidebar-item[data-view]');
  const views = document.querySelectorAll('.admin-view');
  const pageTitle = document.getElementById('header-view-title');
  const breadcrumb = document.getElementById('header-breadcrumb-view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      const viewTitle = item.querySelector('span')?.textContent || 'Dashboard';

      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      views.forEach(v => {
        v.classList.remove('active');
        if (v.id === `view-${targetView}`) {
          v.classList.add('active');
        }
      });

      if (pageTitle) pageTitle.textContent = viewTitle;
      if (breadcrumb) breadcrumb.textContent = viewTitle;

      // Reset scroll position to top when switching views
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.querySelector('.admin-main')?.scrollTo({ top: 0, behavior: 'instant' });

      // Close mobile sidebar if open
      document.querySelector('.admin-sidebar')?.classList.remove('mobile-open');

      // Trigger specific view refresh
      if (targetView === 'dashboard') initDashboardOverview();
      if (targetView === 'inquiries') renderInquiriesTable();
      if (targetView === 'students') renderStudentsTable();
      if (targetView === 'fees') renderFeesTable();
      if (targetView === 'classes') renderClassesTable();
      if (targetView === 'staff') renderStaffGrid();
      if (targetView === 'notices') renderNoticesGrid();
      if (targetView === 'gallery') renderGalleryGrid();
      if (targetView === 'settings') renderSettings();
    });
  });
}

// Update Badges across Sidebar & Top Header
function updateBadges() {
  const inquiries = window.AOK_DB.getAll('inquiries');
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  
  const inqBadge = document.getElementById('badge-inquiries-count');
  const headerInqBadge = document.getElementById('header-inquiries-badge');
  if (inqBadge) {
    inqBadge.textContent = newInquiries;
    inqBadge.style.display = newInquiries > 0 ? 'inline-block' : 'none';
  }
  if (headerInqBadge) {
    headerInqBadge.textContent = newInquiries;
    headerInqBadge.style.display = newInquiries > 0 ? 'flex' : 'none';
  }
}

// Global Quick Action Search
function initGlobalSearch() {
  const searchInput = document.getElementById('global-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase();
    if (!term) return;

    // If searching, jump to students or inquiries view if relevant
    const studentsView = document.getElementById('view-students');
    if (studentsView && studentsView.classList.contains('active')) {
      renderStudentsTable(term);
    }
  });
}

/* ==========================================================================
   1. Dashboard Overview Module
   ========================================================================== */

function initDashboardOverview() {
  const students = window.AOK_DB.getAll('students');
  const inquiries = window.AOK_DB.getAll('inquiries');
  const feeRecords = window.AOK_DB.getAll('fee_records');
  const staff = window.AOK_DB.getAll('staff');
  const classes = window.AOK_DB.getAll('classes');

  // KPI 1: Total Students
  const totalStudentsEl = document.getElementById('kpi-total-students');
  if (totalStudentsEl) totalStudentsEl.textContent = students.length;

  // KPI 2: Total Monthly Collections
  const totalBilled = feeRecords.reduce((acc, r) => acc + (r.netPayable || 0), 0);
  const totalCollected = feeRecords.filter(r => r.status === 'paid').reduce((acc, r) => acc + (r.netPayable || 0), 0);
  const recoveryRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const collectionEl = document.getElementById('kpi-fee-collection');
  const recoveryEl = document.getElementById('kpi-fee-rate');
  if (collectionEl) collectionEl.textContent = `Rs. ${totalCollected.toLocaleString()}`;
  if (recoveryEl) recoveryEl.textContent = `${recoveryRate}% Recovery`;

  // KPI 3: Pending Inquiries
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const pendingInquiriesEl = document.getElementById('kpi-pending-inquiries');
  if (pendingInquiriesEl) pendingInquiriesEl.textContent = newInquiries;

  // KPI 4: Faculty & Staff
  const staffEl = document.getElementById('kpi-staff-count');
  if (staffEl) staffEl.textContent = staff.length;

  // Render Charts
  renderEnrollmentChart(classes, students);
  renderWingBreakdown(students);
  renderRecentInquiriesFeed(inquiries);
}

// Responsive SVG Bar Chart for Grade Distribution
function renderEnrollmentChart(classes, students) {
  const container = document.getElementById('enrollment-bar-chart');
  if (!container) return;

  // Aggregate by wings
  const wingData = {
    'Early Years (PG-Prep)': 0,
    'Primary (1 - 5)': 0,
    'Middle (6 - 8)': 0,
    'Matric Arts (9 & 10)': 0
  };

  students.forEach(s => {
    const g = s.grade.toLowerCase();
    if (g.includes('playgroup') || g.includes('nursery') || g.includes('prep')) {
      wingData['Early Years (PG-Prep)']++;
    } else if (g.includes('class 1') || g.includes('class 2') || g.includes('class 3') || g.includes('class 4') || g.includes('class 5')) {
      wingData['Primary (1 - 5)']++;
    } else if (g.includes('class 6') || g.includes('class 7') || g.includes('class 8')) {
      wingData['Middle (6 - 8)']++;
    } else {
      wingData['Matric Arts (9 & 10)']++;
    }
  });

  const maxVal = Math.max(...Object.values(wingData), 8);
  const colors = ['#0084d6', '#0b3c8f', '#48bb37', '#f59e0b'];

  let html = `<div style="display: flex; align-items: flex-end; justify-content: space-around; width: 100%; height: 210px; padding-bottom: 28px; border-bottom: 1px solid var(--border-light); position: relative;">`;

  Object.entries(wingData).forEach(([wing, count], idx) => {
    const heightPx = Math.max(Math.round((count / maxVal) * 135), 18);
    const color = colors[idx % colors.length];
    html += `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 175px; flex: 1; max-width: 90px;">
        <span style="font-size: 0.85rem; font-weight: 700; color: ${color}; margin-bottom: 6px;">${count}</span>
        <div style="width: 44px; height: ${heightPx}px; background: ${color}; border-radius: 6px 6px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.08);"></div>
        <span style="position: absolute; bottom: 6px; font-size: 0.72rem; color: var(--text-muted); font-weight: 600; text-align: center; white-space: nowrap;">${wing.split(' ')[0]}</span>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

// Wing Breakdown Progress List
function renderWingBreakdown(students) {
  const container = document.getElementById('wing-progress-list');
  if (!container) return;

  const total = Math.max(students.length, 1);
  const artsStudents = students.filter(s => s.grade.includes('Arts') || s.grade.includes('Pre-9')).length;
  const primaryStudents = students.filter(s => ['class 1', 'class 2', 'class 3', 'class 4', 'class 5'].some(c => s.grade.toLowerCase().includes(c))).length;
  const middleStudents = students.filter(s => ['class 6', 'class 7', 'class 8'].some(c => s.grade.toLowerCase().includes(c))).length;
  const earlyStudents = students.filter(s => ['playgroup', 'nursery', 'prep'].some(c => s.grade.toLowerCase().includes(c))).length;

  const items = [
    { title: 'Matric Arts Group (Specialized)', count: artsStudents, percent: Math.round((artsStudents / total) * 100), color: '#48bb37' },
    { title: 'Primary Wing (Class 1-5)', count: primaryStudents, percent: Math.round((primaryStudents / total) * 100), color: '#0b3c8f' },
    { title: 'Middle Wing (Class 6-8)', count: middleStudents, percent: Math.round((middleStudents / total) * 100), color: '#0084d6' },
    { title: 'Early Years (PG to Prep)', count: earlyStudents, percent: Math.round((earlyStudents / total) * 100), color: '#f59e0b' }
  ];

  let html = '';
  items.forEach(item => {
    html += `
      <div class="wing-stat-item">
        <div class="wing-stat-meta">
          <span>${item.title}</span>
          <span class="wing-stat-count">${item.count} students (${item.percent}%)</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${item.percent}%; background-color: ${item.color};"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Recent Inquiries Feed on Dashboard
function renderRecentInquiriesFeed(inquiries) {
  const feedEl = document.getElementById('dashboard-recent-inquiries');
  if (!feedEl) return;

  const recent = inquiries.slice(0, 4);
  if (recent.length === 0) {
    feedEl.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1.5rem;">No admission inquiries yet.</p>`;
    return;
  }

  let html = '';
  recent.forEach(inq => {
    const statusBadges = {
      new: '<span class="badge badge-primary"><span class="badge-dot"></span> New</span>',
      contacted: '<span class="badge badge-warning"><span class="badge-dot"></span> Contacted</span>',
      interview_scheduled: '<span class="badge badge-warning"><span class="badge-dot"></span> Interview</span>',
      admitted: '<span class="badge badge-success"><span class="badge-dot"></span> Admitted</span>',
      declined: '<span class="badge badge-danger"><span class="badge-dot"></span> Declined</span>'
    };

    const dateFormatted = new Date(inq.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });

    html += `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 0; border-bottom: 1px solid var(--border-light);">
        <div>
          <div style="font-weight: 600; color: var(--text-main); font-size: 0.92rem;">${escapeHtml(inq.parentName)}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Child: <strong>${escapeHtml(inq.studentName)}</strong> • ${escapeHtml(inq.grade)}</div>
        </div>
        <div style="text-align: right;">
          ${statusBadges[inq.status] || '<span class="badge badge-neutral">New</span>'}
          <div style="font-size: 0.72rem; color: var(--text-light); margin-top: 4px;">${dateFormatted}</div>
        </div>
      </div>
    `;
  });

  feedEl.innerHTML = html;
}

/* ==========================================================================
   2. Admissions & Inquiries Module
   ========================================================================== */

function initInquiriesView() {
  const searchInput = document.getElementById('inquiries-search');
  const statusFilter = document.getElementById('inquiries-status-filter');
  const exportBtn = document.getElementById('btn-export-inquiries');

  if (searchInput) {
    searchInput.addEventListener('input', () => renderInquiriesTable());
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', () => renderInquiriesTable());
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', exportInquiriesCSV);
  }
}

function renderInquiriesTable() {
  const tbody = document.getElementById('inquiries-table-body');
  if (!tbody) return;

  const searchTerm = document.getElementById('inquiries-search')?.value.trim().toLowerCase() || '';
  const filterStatus = document.getElementById('inquiries-status-filter')?.value || 'all';

  let inquiries = window.AOK_DB.getAll('inquiries');

  if (filterStatus !== 'all') {
    inquiries = inquiries.filter(i => i.status === filterStatus);
  }

  if (searchTerm) {
    inquiries = inquiries.filter(i => 
      i.parentName.toLowerCase().includes(searchTerm) ||
      i.studentName.toLowerCase().includes(searchTerm) ||
      i.phone.includes(searchTerm) ||
      i.grade.toLowerCase().includes(searchTerm)
    );
  }

  if (inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No inquiries match the current search or filter.</td></tr>`;
    return;
  }

  let html = '';
  inquiries.forEach(inq => {
    const statusBadges = {
      new: '<span class="badge badge-primary"><span class="badge-dot"></span> New</span>',
      contacted: '<span class="badge badge-warning"><span class="badge-dot"></span> Contacted</span>',
      interview_scheduled: '<span class="badge badge-warning"><span class="badge-dot"></span> Interview Set</span>',
      admitted: '<span class="badge badge-success"><span class="badge-dot"></span> Admitted</span>',
      declined: '<span class="badge badge-danger"><span class="badge-dot"></span> Declined</span>'
    };

    const cleanPhone = inq.phone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
    const waMsg = encodeURIComponent(`Assalam-o-Alaikum ${inq.parentName}! We received your admission inquiry for ${inq.studentName} (${inq.grade}) at The Ambassadors of Knowledge, Dhok Badam Satramile Islamabad.`);

    const dateStr = new Date(inq.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

    html += `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--primary-dark);">${escapeHtml(inq.parentName)}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(inq.phone)}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(inq.studentName)}</div>
        </td>
        <td>
          <span style="display: inline-block; padding: 0.2rem 0.5rem; background: var(--bg-body); border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 600;">${escapeHtml(inq.grade)}</span>
        </td>
        <td style="max-width: 220px; font-size: 0.84rem; color: var(--text-body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${escapeHtml(inq.message)}">
          ${escapeHtml(inq.message)}
        </td>
        <td>${dateStr}</td>
        <td>${statusBadges[inq.status] || inq.status}</td>
        <td>
          <div class="action-btns">
            <a href="https://wa.me/${waPhone}?text=${waMsg}" target="_blank" class="btn-icon wa" title="Chat on WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
            </a>
            <a href="tel:${inq.phone}" class="btn-icon" title="Call Parent">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </a>
            <button class="btn-icon" onclick="openInquiryModal('${inq.id}')" title="Update Status / Notes">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="btn-icon" onclick="convertInquiryToStudent('${inq.id}')" title="Enroll as Student">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7.5" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            </button>
            <button class="btn-icon del" onclick="deleteInquiry('${inq.id}')" title="Delete Inquiry">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Modal: Update Inquiry Status & Notes
window.openInquiryModal = function(id) {
  const inq = window.AOK_DB.getById('inquiries', id);
  if (!inq) return;

  const modal = document.getElementById('modal-inquiry');
  document.getElementById('inq-modal-id').value = inq.id;
  document.getElementById('inq-modal-parent').textContent = inq.parentName;
  document.getElementById('inq-modal-student').textContent = inq.studentName;
  document.getElementById('inq-modal-grade').textContent = inq.grade;
  document.getElementById('inq-modal-phone').textContent = inq.phone;
  document.getElementById('inq-modal-msg').textContent = inq.message;
  document.getElementById('inq-modal-status').value = inq.status;
  document.getElementById('inq-modal-notes').value = inq.notes || '';

  modal.classList.add('active');
};

window.saveInquiryModal = function() {
  const id = document.getElementById('inq-modal-id').value;
  const status = document.getElementById('inq-modal-status').value;
  const notes = document.getElementById('inq-modal-notes').value.trim();

  window.AOK_DB.update('inquiries', id, { status, notes });
  closeModal('modal-inquiry');
  renderInquiriesTable();
  updateBadges();
  showToast('Inquiry status updated successfully!', 'success');
};

window.deleteInquiry = function(id) {
  if (confirm('Are you sure you want to delete this admission inquiry?')) {
    window.AOK_DB.delete('inquiries', id);
    renderInquiriesTable();
    updateBadges();
    showToast('Inquiry removed.', 'info');
  }
};

window.convertInquiryToStudent = function(id) {
  const inq = window.AOK_DB.getById('inquiries', id);
  if (!inq) return;

  // Pre-fill Add Student Modal
  openAddStudentModal();
  document.getElementById('stu-fullname').value = inq.studentName !== 'Not specified' ? inq.studentName : '';
  document.getElementById('stu-fathername').value = inq.parentName;
  document.getElementById('stu-phone').value = inq.phone;

  // Match grade
  const gradeSelect = document.getElementById('stu-grade');
  for (let option of gradeSelect.options) {
    if (option.value.toLowerCase().includes(inq.grade.toLowerCase())) {
      option.selected = true;
      break;
    }
  }

  // Mark inquiry as admitted
  window.AOK_DB.update('inquiries', id, { status: 'admitted' });
  renderInquiriesTable();
  updateBadges();
};

function exportInquiriesCSV() {
  const inquiries = window.AOK_DB.getAll('inquiries');
  let csv = 'ID,Parent Name,Student Name,Phone,Grade,Status,Date,Message,Notes\n';
  inquiries.forEach(i => {
    csv += `"${i.id}","${i.parentName}","${i.studentName}","${i.phone}","${i.grade}","${i.status}","${i.createdAt}","${(i.message || '').replace(/"/g, '""')}","${(i.notes || '').replace(/"/g, '""')}"\n`;
  });

  downloadCSV(csv, 'AOK_School_Admission_Inquiries.csv');
  showToast('Inquiries CSV exported successfully.', 'success');
}

/* ==========================================================================
   3. Student Directory & Management Module
   ========================================================================== */

function initStudentsView() {
  const searchInput = document.getElementById('students-search');
  const gradeFilter = document.getElementById('students-grade-filter');
  const feeFilter = document.getElementById('students-fee-filter');
  const addBtn = document.getElementById('btn-add-student');
  const exportBtn = document.getElementById('btn-export-students');

  if (searchInput) searchInput.addEventListener('input', () => renderStudentsTable());
  if (gradeFilter) gradeFilter.addEventListener('change', () => renderStudentsTable());
  if (feeFilter) feeFilter.addEventListener('change', () => renderStudentsTable());
  if (addBtn) addBtn.addEventListener('click', () => openAddStudentModal());
  if (exportBtn) exportBtn.addEventListener('click', exportStudentsCSV);

  // Auto fee calculation on grade change in student modal
  const gradeSelect = document.getElementById('stu-grade');
  if (gradeSelect) {
    gradeSelect.addEventListener('change', () => {
      const g = gradeSelect.value;
      const feeInput = document.getElementById('stu-fee');
      if (!feeInput) return;

      if (g.includes('Playgroup') || g.includes('Nursery') || g.includes('Prep')) feeInput.value = 1500;
      else if (g.includes('Class 1')) feeInput.value = 1600;
      else if (g.includes('Class 2') || g.includes('Class 3') || g.includes('Class 4')) feeInput.value = 1800;
      else if (g.includes('Class 5')) feeInput.value = 2000;
      else if (g.includes('Class 6') || g.includes('Class 7') || g.includes('Class 8')) feeInput.value = 2200;
      else feeInput.value = 2500; // Matric Arts / Pre-9
    });
  }
}

function renderStudentsTable(termOverride = null) {
  const tbody = document.getElementById('students-table-body');
  if (!tbody) return;

  const searchTerm = termOverride !== null ? termOverride : (document.getElementById('students-search')?.value.trim().toLowerCase() || '');
  const filterGrade = document.getElementById('students-grade-filter')?.value || 'all';
  const filterFee = document.getElementById('students-fee-filter')?.value || 'all';

  let students = window.AOK_DB.getAll('students');

  if (filterGrade !== 'all') {
    students = students.filter(s => s.grade === filterGrade);
  }

  if (filterFee !== 'all') {
    students = students.filter(s => s.feeStatus === filterFee);
  }

  if (searchTerm) {
    students = students.filter(s =>
      s.fullName.toLowerCase().includes(searchTerm) ||
      s.rollNo.toLowerCase().includes(searchTerm) ||
      s.fatherName.toLowerCase().includes(searchTerm) ||
      s.phone.includes(searchTerm)
    );
  }

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No student records found matching criteria.</td></tr>`;
    return;
  }

  let html = '';
  students.forEach(s => {
    const feeBadges = {
      paid: '<span class="badge badge-success"><span class="badge-dot"></span> Paid</span>',
      unpaid: '<span class="badge badge-danger"><span class="badge-dot"></span> Unpaid</span>',
      overdue: '<span class="badge badge-warning"><span class="badge-dot"></span> Overdue</span>'
    };

    html += `
      <tr>
        <td>
          <span class="roll-badge">${s.rollNo}</span>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(s.fullName)}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${s.gender} • Blood: ${s.bloodGroup || 'N/A'}</div>
        </td>
        <td>
          <div style="font-weight: 500;">${escapeHtml(s.fatherName)}</div>
        </td>
        <td>
          <span style="font-weight: 600; font-size: 0.85rem;">${escapeHtml(s.grade)}</span>
          <span style="color: var(--text-muted); font-size: 0.78rem;">(Sec ${s.section})</span>
        </td>
        <td>${escapeHtml(s.phone)}</td>
        <td>
          <strong>Rs. ${Number(s.monthlyFee).toLocaleString()}</strong>
        </td>
        <td>${feeBadges[s.feeStatus] || s.feeStatus}</td>
        <td>
          <div class="action-btns">
            <button class="btn-icon" onclick="printStudentIDCard('${s.id}')" title="Print Student ID Card">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            </button>
            <button class="btn-icon" onclick="generateStudentChallan('${s.id}')" title="Generate 3-Copy Bank Challan">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </button>
            <button class="btn-icon" onclick="openEditStudentModal('${s.id}')" title="Edit Student Profile">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon del" onclick="deleteStudent('${s.id}')" title="Remove Student">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

window.openAddStudentModal = function() {
  const modal = document.getElementById('modal-student');
  document.getElementById('modal-student-title').textContent = 'Enroll New Student';
  document.getElementById('stu-edit-id').value = '';
  document.getElementById('stu-rollno').value = window.AOK_DB.generateRollNumber();
  document.getElementById('stu-fullname').value = '';
  document.getElementById('stu-fathername').value = '';
  document.getElementById('stu-gender').value = 'Male';
  document.getElementById('stu-grade').value = 'Class 10 (Arts)';
  document.getElementById('stu-section').value = 'A';
  document.getElementById('stu-dob').value = '2010-01-01';
  document.getElementById('stu-phone').value = '';
  document.getElementById('stu-address').value = 'Dhok Badam Satramile, Bhara Kahu, Islamabad';
  document.getElementById('stu-fee').value = '2500';
  document.getElementById('stu-blood').value = 'B+';
  document.getElementById('stu-feestatus').value = 'paid';

  modal.classList.add('active');
};

window.openEditStudentModal = function(id) {
  const s = window.AOK_DB.getById('students', id);
  if (!s) return;

  const modal = document.getElementById('modal-student');
  document.getElementById('modal-student-title').textContent = 'Edit Student Details';
  document.getElementById('stu-edit-id').value = s.id;
  document.getElementById('stu-rollno').value = s.rollNo;
  document.getElementById('stu-fullname').value = s.fullName;
  document.getElementById('stu-fathername').value = s.fatherName;
  document.getElementById('stu-gender').value = s.gender || 'Male';
  document.getElementById('stu-grade').value = s.grade;
  document.getElementById('stu-section').value = s.section || 'A';
  document.getElementById('stu-dob').value = s.dob || '';
  document.getElementById('stu-phone').value = s.phone;
  document.getElementById('stu-address').value = s.address || '';
  document.getElementById('stu-fee').value = s.monthlyFee;
  document.getElementById('stu-blood').value = s.bloodGroup || 'O+';
  document.getElementById('stu-feestatus').value = s.feeStatus || 'paid';

  modal.classList.add('active');
};

window.saveStudentModal = function() {
  const editId = document.getElementById('stu-edit-id').value;
  const fullName = document.getElementById('stu-fullname').value.trim();
  const fatherName = document.getElementById('stu-fathername').value.trim();
  const rollNo = document.getElementById('stu-rollno').value.trim();
  const grade = document.getElementById('stu-grade').value;
  const section = document.getElementById('stu-section').value;
  const gender = document.getElementById('stu-gender').value;
  const dob = document.getElementById('stu-dob').value;
  const phone = document.getElementById('stu-phone').value.trim();
  const address = document.getElementById('stu-address').value.trim();
  const monthlyFee = parseInt(document.getElementById('stu-fee').value) || 2000;
  const bloodGroup = document.getElementById('stu-blood').value;
  const feeStatus = document.getElementById('stu-feestatus').value;

  if (!fullName || !fatherName || !phone) {
    alert('Please complete all required fields (Student Name, Father Name, Contact Phone).');
    return;
  }

  const studentData = {
    rollNo,
    fullName,
    fatherName,
    gender,
    grade,
    section,
    dob,
    phone,
    address,
    monthlyFee,
    bloodGroup,
    feeStatus,
    admissionDate: editId ? undefined : new Date().toISOString().slice(0, 10)
  };

  if (editId) {
    window.AOK_DB.update('students', editId, studentData);
    showToast(`Updated student profile for ${fullName}.`, 'success');
  } else {
    window.AOK_DB.add('students', studentData);
    showToast(`Successfully enrolled ${fullName} (${rollNo}).`, 'success');
  }

  closeModal('modal-student');
  renderStudentsTable();
  initDashboardOverview();
};

window.deleteStudent = function(id) {
  const s = window.AOK_DB.getById('students', id);
  if (!s) return;

  if (confirm(`Are you sure you want to delete ${s.fullName} (${s.rollNo})? This cannot be undone.`)) {
    window.AOK_DB.delete('students', id);
    renderStudentsTable();
    initDashboardOverview();
    showToast('Student record deleted.', 'info');
  }
};

function exportStudentsCSV() {
  const students = window.AOK_DB.getAll('students');
  let csv = 'Roll No,Student Name,Father Name,Gender,Grade,Section,Phone,Monthly Fee,Fee Status,Blood Group,Admission Date,Address\n';
  students.forEach(s => {
    csv += `"${s.rollNo}","${s.fullName}","${s.fatherName}","${s.gender}","${s.grade}","${s.section}","${s.phone}","${s.monthlyFee}","${s.feeStatus}","${s.bloodGroup || ''}","${s.admissionDate || ''}","${(s.address || '').replace(/"/g, '""')}"\n`;
  });

  downloadCSV(csv, 'AOK_School_Students_Roster.csv');
  showToast('Students directory exported to CSV.', 'success');
}

/* ==========================================================================
   4. Fee Management & 3-Copy Bank Challan Generator
   ========================================================================== */

function initFeesView() {
  const searchInput = document.getElementById('fees-search');
  const statusFilter = document.getElementById('fees-status-filter');
  const recordPayBtn = document.getElementById('btn-record-fee-payment');
  const exportBtn = document.getElementById('btn-export-fees');

  if (searchInput) searchInput.addEventListener('input', () => renderFeesTable());
  if (statusFilter) statusFilter.addEventListener('change', () => renderFeesTable());
  if (recordPayBtn) recordPayBtn.addEventListener('click', () => openRecordPaymentModal());
  if (exportBtn) exportBtn.addEventListener('click', exportFeesCSV);
}

function renderFeesTable() {
  const tbody = document.getElementById('fees-table-body');
  if (!tbody) return;

  const searchTerm = document.getElementById('fees-search')?.value.trim().toLowerCase() || '';
  const filterStatus = document.getElementById('fees-status-filter')?.value || 'all';

  let records = window.AOK_DB.getAll('fee_records');

  if (filterStatus !== 'all') {
    records = records.filter(r => r.status === filterStatus);
  }

  if (searchTerm) {
    records = records.filter(r =>
      r.studentName.toLowerCase().includes(searchTerm) ||
      r.rollNo.toLowerCase().includes(searchTerm) ||
      r.challanNo.toLowerCase().includes(searchTerm) ||
      r.grade.toLowerCase().includes(searchTerm)
    );
  }

  // Summary Metrics
  const totalBilled = records.reduce((acc, r) => acc + (r.netPayable || 0), 0);
  const totalCollected = records.filter(r => r.status === 'paid').reduce((acc, r) => acc + (r.netPayable || 0), 0);
  const totalPending = totalBilled - totalCollected;

  document.getElementById('fees-total-billed').textContent = `Rs. ${totalBilled.toLocaleString()}`;
  document.getElementById('fees-total-collected').textContent = `Rs. ${totalCollected.toLocaleString()}`;
  document.getElementById('fees-total-pending').textContent = `Rs. ${totalPending.toLocaleString()}`;

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No fee vouchers found matching criteria.</td></tr>`;
    return;
  }

  let html = '';
  records.forEach(r => {
    const isPaid = r.status === 'paid';
    const statusBadge = isPaid 
      ? '<span class="badge badge-success"><span class="badge-dot"></span> Paid</span>' 
      : '<span class="badge badge-danger"><span class="badge-dot"></span> Unpaid</span>';

    html += `
      <tr>
        <td>
          <span class="challan-badge">${r.challanNo}</span>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(r.studentName)}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${r.rollNo}</div>
        </td>
        <td>${escapeHtml(r.grade)}</td>
        <td>${escapeHtml(r.month)}</td>
        <td>
          <strong style="font-size: 0.95rem; color: var(--primary-dark);">Rs. ${Number(r.netPayable).toLocaleString()}</strong>
        </td>
        <td>${r.dueDate}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="action-btns">
            ${!isPaid ? `
              <button class="btn btn-sm btn-accent" onclick="quickMarkPaid('${r.id}')" title="Mark as Paid">
                Pay Now
              </button>
            ` : `
              <span style="font-size: 0.75rem; color: var(--accent-dark); font-weight: 600;">Receipt #${r.receiptNo || 'PAID'}</span>
            `}
            <button class="btn-icon" onclick="printOfficialChallan('${r.id}')" title="Print Pakistani 3-Copy Bank Challan">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

window.quickMarkPaid = function(id) {
  const r = window.AOK_DB.getById('fee_records', id);
  if (!r) return;

  const receiptNo = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
  window.AOK_DB.update('fee_records', id, {
    status: 'paid',
    paidDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Cash (School Counter)',
    receiptNo: receiptNo
  });

  // Also update student fee status
  if (r.studentId) {
    window.AOK_DB.update('students', r.studentId, { feeStatus: 'paid' });
  }

  showToast(`Payment recorded for ${r.studentName} (Receipt: ${receiptNo})`, 'success');
  renderFeesTable();
  initDashboardOverview();
};

window.openRecordPaymentModal = function() {
  const modal = document.getElementById('modal-fee-payment');
  const studentSelect = document.getElementById('fee-modal-student');
  const students = window.AOK_DB.getAll('students');

  let optHtml = '<option value="">-- Choose Student --</option>';
  students.forEach(s => {
    optHtml += `<option value="${s.id}" data-fee="${s.monthlyFee}" data-grade="${s.grade}" data-name="${s.fullName}" data-roll="${s.rollNo}">${s.rollNo} - ${s.fullName} (${s.grade})</option>`;
  });
  studentSelect.innerHTML = optHtml;

  document.getElementById('fee-modal-amount').value = '';
  document.getElementById('fee-modal-month').value = 'November 2026';
  document.getElementById('fee-modal-method').value = 'Cash (School Counter)';

  studentSelect.onchange = () => {
    const selected = studentSelect.options[studentSelect.selectedIndex];
    if (selected) {
      document.getElementById('fee-modal-amount').value = selected.getAttribute('data-fee') || '2500';
    }
  };

  modal.classList.add('active');
};

window.saveFeePaymentModal = function() {
  const studentSelect = document.getElementById('fee-modal-student');
  const selectedOpt = studentSelect.options[studentSelect.selectedIndex];
  if (!selectedOpt || !selectedOpt.value) {
    alert('Please select a student.');
    return;
  }

  const studentId = selectedOpt.value;
  const studentName = selectedOpt.getAttribute('data-name');
  const rollNo = selectedOpt.getAttribute('data-roll');
  const grade = selectedOpt.getAttribute('data-grade');
  const amount = parseInt(document.getElementById('fee-modal-amount').value) || 2500;
  const month = document.getElementById('fee-modal-month').value;
  const method = document.getElementById('fee-modal-method').value;

  const newRecord = {
    challanNo: window.AOK_DB.generateChallanNumber(),
    studentId,
    studentName,
    rollNo,
    grade,
    month,
    tuitionFee: amount,
    discount: 0,
    arrears: 0,
    netPayable: amount,
    dueDate: new Date().toISOString().slice(0, 10),
    paidDate: new Date().toISOString().slice(0, 10),
    status: 'paid',
    paymentMethod: method,
    receiptNo: `REC-2026-${Math.floor(100 + Math.random() * 900)}`
  };

  window.AOK_DB.add('fee_records', newRecord);
  window.AOK_DB.update('students', studentId, { feeStatus: 'paid' });

  closeModal('modal-fee-payment');
  renderFeesTable();
  initDashboardOverview();
  showToast(`Fee payment recorded successfully for ${studentName}!`, 'success');
};

window.generateStudentChallan = function(studentId) {
  const s = window.AOK_DB.getById('students', studentId);
  if (!s) return;

  const existing = window.AOK_DB.getAll('fee_records').find(r => r.studentId === studentId);
  if (existing) {
    printOfficialChallan(existing.id);
  } else {
    // Create new challan record
    const newRecord = {
      challanNo: window.AOK_DB.generateChallanNumber(),
      studentId: s.id,
      studentName: s.fullName,
      rollNo: s.rollNo,
      grade: s.grade,
      month: 'November 2026',
      tuitionFee: s.monthlyFee,
      discount: 0,
      arrears: 0,
      netPayable: s.monthlyFee,
      dueDate: '2026-11-10',
      paidDate: s.feeStatus === 'paid' ? '2026-11-05' : null,
      status: s.feeStatus,
      paymentMethod: s.feeStatus === 'paid' ? 'Cash' : null,
      receiptNo: s.feeStatus === 'paid' ? `REC-2026-${Math.floor(100 + Math.random() * 900)}` : null
    };
    window.AOK_DB.add('fee_records', newRecord);
    printOfficialChallan(newRecord.id);
  }
};

// Pakistani Standard 3-Copy Bank Challan Printing Engine
window.printOfficialChallan = function(feeId) {
  const record = window.AOK_DB.getById('fee_records', feeId);
  if (!record) return;

  const settings = window.AOK_DB.getSettings();
  const printContainer = document.getElementById('printable-challan-container');
  if (!printContainer) return;

  const copies = [
    { name: 'Bank Copy', sub: 'For Bank Record' },
    { name: 'School Copy', sub: 'To be submitted to Accounts' },
    { name: 'Student Copy', sub: 'Parent / Guardian Record' }
  ];

  let html = `<div class="challan-sheet">`;

  copies.forEach(copy => {
    html += `
      <div class="challan-copy">
        <div class="challan-header">
          <img src="../assets/images/logo.png" alt="Logo" class="challan-logo">
          <div class="challan-school-name">${escapeHtml(settings.schoolName)}</div>
          <div class="challan-school-addr">${escapeHtml(settings.campusAddress)}</div>
          <div style="font-size: 9px; color: #0b3c8f; font-weight: bold;">Phone: ${settings.phone}</div>
          <span class="challan-type-badge">${copy.name}</span>
        </div>

        <div class="challan-bank-info">
          <div><strong>Bank:</strong> ${escapeHtml(settings.bankName)}</div>
          <div><strong>Title:</strong> ${escapeHtml(settings.accountTitle)}</div>
          <div><strong>A/C No:</strong> <span style="font-family: monospace; font-weight: bold;">${settings.accountNumber}</span></div>
        </div>

        <div class="challan-meta-row">
          <span>Challan No: <strong>${record.challanNo}</strong></span>
          <span>Issue: <strong>01 Nov 2026</strong></span>
        </div>
        <div class="challan-meta-row">
          <span>Due Date: <strong style="color: #b91c1c;">${record.dueDate}</strong></span>
          <span>Month: <strong>${record.month}</strong></span>
        </div>
        <div style="border-top: 1px solid #cbd5e1; margin: 4px 0;"></div>
        <div class="challan-meta-row">
          <span>Roll No: <strong>${record.rollNo}</strong></span>
          <span>Class: <strong>${record.grade}</strong></span>
        </div>
        <div class="challan-meta-row">
          <span>Student: <strong>${escapeHtml(record.studentName)}</strong></span>
        </div>

        <table class="challan-fee-table">
          <thead>
            <tr>
              <th>Fee Particulars</th>
              <th style="text-align: right;">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monthly Tuition Fee</td>
              <td style="text-align: right;">Rs. ${Number(record.tuitionFee).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Concession / Discount</td>
              <td style="text-align: right;">- Rs. ${Number(record.discount || 0).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Previous Arrears</td>
              <td style="text-align: right;">Rs. ${Number(record.arrears || 0).toLocaleString()}</td>
            </tr>
            <tr class="total-row">
              <td><strong>Total Payable</strong></td>
              <td style="text-align: right;"><strong>Rs. ${Number(record.netPayable).toLocaleString()}</strong></td>
            </tr>
          </tbody>
        </table>

        <div style="font-size: 8.5px; color: #64748b; line-height: 1.3; margin-top: 2px;">
          * Please deposit before due date. A late fee fine of Rs. 100 applies after due date.<br>
          * Fee once deposited is non-refundable and non-transferable.
        </div>

        <div class="challan-footer-signatures">
          <div>
            <div class="challan-sign-line">Accounts Incharge</div>
          </div>
          <div>
            <div class="challan-sign-line">Bank Stamp & Cashier</div>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  printContainer.innerHTML = html;

  // Trigger Print
  window.print();
};

// Printable Student ID Card Engine
window.printStudentIDCard = function(studentId) {
  const s = window.AOK_DB.getById('students', studentId);
  if (!s) return;

  const settings = window.AOK_DB.getSettings();
  const printContainer = document.getElementById('printable-idcard-container');
  if (!printContainer) return;

  const initials = s.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  let html = `
    <div class="idcard-wrapper">
      <div class="student-id-card">
        <div class="id-card-top">
          <img src="../assets/images/logo.png" alt="AOK" class="id-card-logo">
          <div>
            <div class="id-card-title">${escapeHtml(settings.schoolName)}</div>
            <div class="id-card-subtitle">${escapeHtml(settings.slogan)}</div>
          </div>
        </div>

        <div class="id-card-body">
          <div class="id-card-photo-wrap">
            <div style="font-size: 26px; font-weight: 800; color: #0b3c8f; font-family: 'Outfit', sans-serif;">${initials}</div>
          </div>

          <div class="id-card-details">
            <div class="id-student-name">${escapeHtml(s.fullName)}</div>
            <div class="id-detail-row">
              <strong>Roll No:</strong> <span style="font-weight: 700; color: #0b3c8f;">${s.rollNo}</span>
            </div>
            <div class="id-detail-row">
              <strong>Father:</strong> <span>${escapeHtml(s.fatherName)}</span>
            </div>
            <div class="id-detail-row">
              <strong>Class:</strong> <span>${escapeHtml(s.grade)} (Sec ${s.section})</span>
            </div>
            <div class="id-detail-row">
              <strong>Blood:</strong> <span style="color: #b91c1c; font-weight: 700;">${s.bloodGroup || 'O+'}</span>
            </div>
            <div class="id-detail-row">
              <strong>Phone:</strong> <span>${s.phone}</span>
            </div>
          </div>
        </div>

        <div class="id-card-bottom">
          <span>Campus: Satramile, Bhara Kahu</span>
          <span>Principal: <strong>Shahzad Ali Shah (MBA)</strong></span>
        </div>
      </div>
    </div>
  `;

  printContainer.innerHTML = html;
  window.print();
};

function exportFeesCSV() {
  const records = window.AOK_DB.getAll('fee_records');
  let csv = 'Challan No,Student Name,Roll No,Grade,Month,Tuition Fee,Discount,Net Payable,Due Date,Status,Payment Method,Receipt No\n';
  records.forEach(r => {
    csv += `"${r.challanNo}","${r.studentName}","${r.rollNo}","${r.grade}","${r.month}","${r.tuitionFee}","${r.discount || 0}","${r.netPayable}","${r.dueDate}","${r.status}","${r.paymentMethod || 'N/A'}","${r.receiptNo || 'N/A'}"\n`;
  });

  downloadCSV(csv, 'AOK_School_Fee_Records.csv');
  showToast('Fee collection records exported to CSV.', 'success');
}

/* ==========================================================================
   5. Classes & Academic Wings Module
   ========================================================================== */

function initClassesView() {
  renderClassesTable();
}

function renderClassesTable() {
  const tbody = document.getElementById('classes-table-body');
  if (!tbody) return;

  const classes = window.AOK_DB.getAll('classes');

  let html = '';
  classes.forEach(c => {
    const isSpecialArts = c.wing.includes('Arts');
    const badge = isSpecialArts 
      ? '<span class="badge badge-success">Specialized Matric Arts Wing</span>' 
      : `<span class="badge badge-primary">${c.wing}</span>`;

    html += `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--primary-dark); font-size: 0.95rem;">${c.name}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${c.room}</div>
        </td>
        <td>${badge}</td>
        <td>
          <strong style="color: var(--accent-dark);">Rs. ${Number(c.monthlyFee).toLocaleString()}</strong> / month
        </td>
        <td>
          <div style="font-weight: 600;">${c.enrolled} / ${c.capacity}</div>
          <div class="progress-bar-track" style="margin-top: 4px; height: 5px; max-width: 120px;">
            <div class="progress-bar-fill" style="width: ${Math.round((c.enrolled / c.capacity) * 100)}%; background: var(--secondary);"></div>
          </div>
        </td>
        <td>
          <div style="font-weight: 500;">${c.teacher}</div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/* ==========================================================================
   6. Faculty & Staff Directory Module
   ========================================================================== */

function initStaffView() {
  const addBtn = document.getElementById('btn-add-staff');
  if (addBtn) addBtn.addEventListener('click', openAddStaffModal);
  renderStaffGrid();
}

function renderStaffGrid() {
  const grid = document.getElementById('staff-cards-grid');
  if (!grid) return;

  const staff = window.AOK_DB.getAll('staff');

  let html = '';
  staff.forEach(m => {
    const isPrincipal = m.designation.toLowerCase().includes('principal');
    const borderAccent = isPrincipal ? 'border-left: 4px solid var(--accent);' : 'border-left: 4px solid var(--primary);';

    html += `
      <div class="card" style="${borderAccent} display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem;">
            <div>
              <h3 style="font-size: 1.15rem; color: var(--primary-dark); margin-bottom: 2px;">${escapeHtml(m.name)}</h3>
              <div style="font-size: 0.82rem; color: var(--secondary); font-weight: 700;">${escapeHtml(m.designation)}</div>
            </div>
            <span class="badge badge-success">${m.status || 'Active'}</span>
          </div>

          <div style="font-size: 0.85rem; color: var(--text-body); line-height: 1.6; margin-bottom: 1rem;">
            <div><strong>Qualification:</strong> <span style="background: var(--bg-body); padding: 0.1rem 0.4rem; border-radius: 4px;">${escapeHtml(m.qualification)}</span></div>
            <div><strong>Department:</strong> ${escapeHtml(m.department)}</div>
            <div><strong>Contact:</strong> <a href="tel:${m.phone}">${m.phone}</a></div>
            <div><strong>Email:</strong> <a href="mailto:${m.email}">${m.email}</a></div>
          </div>
        </div>

        <div style="border-top: 1px solid var(--border-light); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
          <span>Joined: ${m.joiningDate}</span>
          ${!isPrincipal ? `
            <button class="btn-icon del" onclick="deleteStaff('${m.id}')" title="Remove Staff Member">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          ` : '<span style="font-weight: 700; color: var(--accent-dark);">Executive Lead</span>'}
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

window.openAddStaffModal = function() {
  const modal = document.getElementById('modal-staff');
  document.getElementById('stf-name').value = '';
  document.getElementById('stf-desig').value = '';
  document.getElementById('stf-qual').value = '';
  document.getElementById('stf-dept').value = 'Primary Wing';
  document.getElementById('stf-phone').value = '';
  document.getElementById('stf-email').value = '';
  modal.classList.add('active');
};

window.saveStaffModal = function() {
  const name = document.getElementById('stf-name').value.trim();
  const designation = document.getElementById('stf-desig').value.trim();
  const qualification = document.getElementById('stf-qual').value.trim();
  const department = document.getElementById('stf-dept').value;
  const phone = document.getElementById('stf-phone').value.trim();
  const email = document.getElementById('stf-email').value.trim();

  if (!name || !designation) {
    alert('Please enter staff name and designation.');
    return;
  }

  window.AOK_DB.add('staff', {
    name,
    designation,
    qualification,
    department,
    phone,
    email,
    joiningDate: new Date().toISOString().slice(0, 10),
    status: 'Active'
  });

  closeModal('modal-staff');
  renderStaffGrid();
  initDashboardOverview();
  showToast(`Added ${name} to faculty directory.`, 'success');
};

window.deleteStaff = function(id) {
  if (confirm('Are you sure you want to remove this faculty member?')) {
    window.AOK_DB.delete('staff', id);
    renderStaffGrid();
    initDashboardOverview();
    showToast('Staff record removed.', 'info');
  }
};

/* ==========================================================================
   7. Notice Board Module
   ========================================================================== */

function initNoticesView() {
  const addBtn = document.getElementById('btn-add-notice');
  if (addBtn) addBtn.addEventListener('click', openAddNoticeModal);
  renderNoticesGrid();
}

function renderNoticesGrid() {
  const grid = document.getElementById('notices-cards-grid');
  if (!grid) return;

  const notices = window.AOK_DB.getAll('notices');

  let html = '';
  notices.forEach(n => {
    const priorityPills = {
      Urgent: '<span class="badge badge-danger">Urgent</span>',
      High: '<span class="badge badge-warning">High Priority</span>',
      Normal: '<span class="badge badge-neutral">Normal</span>'
    };

    html += `
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <span class="badge badge-primary">${escapeHtml(n.category)}</span>
            ${priorityPills[n.priority] || ''}
          </div>

          <h3 style="font-size: 1.15rem; color: var(--primary-dark); margin-bottom: 0.5rem; line-height: 1.3;">
            ${escapeHtml(n.title)}
          </h3>

          <p style="font-size: 0.88rem; color: var(--text-body); line-height: 1.6; margin-bottom: 1rem;">
            ${escapeHtml(n.content)}
          </p>
        </div>

        <div style="border-top: 1px solid var(--border-light); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-muted);">
          <span>Audience: <strong>${escapeHtml(n.targetAudience)}</strong></span>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>${n.publishDate}</span>
            <button class="btn-icon del" onclick="deleteNotice('${n.id}')" title="Delete Notice">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

window.openAddNoticeModal = function() {
  const modal = document.getElementById('modal-notice');
  document.getElementById('not-title').value = '';
  document.getElementById('not-category').value = 'Admissions';
  document.getElementById('not-priority').value = 'Normal';
  document.getElementById('not-audience').value = 'All Parents & Students';
  document.getElementById('not-content').value = '';
  modal.classList.add('active');
};

window.saveNoticeModal = function() {
  const title = document.getElementById('not-title').value.trim();
  const category = document.getElementById('not-category').value;
  const priority = document.getElementById('not-priority').value;
  const targetAudience = document.getElementById('not-audience').value;
  const content = document.getElementById('not-content').value.trim();

  if (!title || !content) {
    alert('Please enter title and notice content.');
    return;
  }

  window.AOK_DB.add('notices', {
    title,
    category,
    priority,
    targetAudience,
    content,
    publishDate: new Date().toISOString().slice(0, 10),
    isActive: true
  });

  closeModal('modal-notice');
  renderNoticesGrid();
  showToast('Notice published successfully!', 'success');
};

window.deleteNotice = function(id) {
  if (confirm('Delete this announcement?')) {
    window.AOK_DB.delete('notices', id);
    renderNoticesGrid();
    showToast('Notice deleted.', 'info');
  }
};

/* ==========================================================================
   8. Media Gallery Module
   ========================================================================== */

function initGalleryView() {
  renderGalleryGrid();
}

function renderGalleryGrid() {
  const grid = document.getElementById('gallery-items-grid');
  if (!grid) return;

  const gallery = window.AOK_DB.getAll('gallery');

  let html = '';
  gallery.forEach(item => {
    html += `
      <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
        <div style="height: 180px; overflow: hidden; background: #0b3c8f;">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='../assets/images/logo.png'">
        </div>
        <div style="padding: 1rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 0.4rem;">${escapeHtml(item.category)}</span>
            <h4 style="font-size: 1rem; color: var(--primary-dark); margin-bottom: 0.35rem;">${escapeHtml(item.title)}</h4>
            <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">${escapeHtml(item.caption)}</p>
          </div>
          <div style="margin-top: 0.75rem; font-size: 0.75rem; color: var(--text-light); text-align: right;">${item.date}</div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

/* ==========================================================================
   9. Settings, System Backup & Security Module
   ========================================================================== */

function initSettingsView() {
  const form = document.getElementById('settings-form');
  const btnBackup = document.getElementById('btn-export-backup');
  const btnRestore = document.getElementById('btn-import-backup');
  const fileRestore = document.getElementById('file-restore-input');
  const btnReset = document.getElementById('btn-reset-defaults');
  const pwdForm = document.getElementById('password-change-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSettings();
    });
  }

  if (btnBackup) {
    btnBackup.addEventListener('click', () => {
      window.AOK_DB.exportBackup();
      showToast('Database backup downloaded.', 'success');
    });
  }

  if (btnRestore && fileRestore) {
    btnRestore.addEventListener('click', () => fileRestore.click());
    fileRestore.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = window.AOK_DB.importBackup(event.target.result);
        if (result.success) {
          showToast('Database restored successfully! Reloading...', 'success');
          setTimeout(() => location.reload(), 1000);
        } else {
          alert('Error restoring backup: ' + result.error);
        }
      };
      reader.readAsText(file);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('CAUTION: Are you sure you want to reset all data to default demo state? All custom edits will be reverted.')) {
        window.AOK_DB.resetToDefaults();
        showToast('System reset to demo data. Reloading...', 'info');
        setTimeout(() => location.reload(), 800);
      }
    });
  }

  if (pwdForm) {
    pwdForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const current = document.getElementById('pwd-current').value;
      const newPwd = document.getElementById('pwd-new').value;
      const confirmPwd = document.getElementById('pwd-confirm').value;

      if (newPwd !== confirmPwd) {
        alert('New passwords do not match.');
        return;
      }

      const res = window.SchoolAuth.changePassword(current, newPwd);
      if (res.success) {
        showToast('Password changed successfully!', 'success');
        pwdForm.reset();
      } else {
        alert(res.message);
      }
    });
  }

  renderSettings();
  renderAuditLogs();
}

function renderSettings() {
  const s = window.AOK_DB.getSettings();
  if (!s) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('set-school-name', s.schoolName);
  setVal('set-slogan', s.slogan);
  setVal('set-phone', s.phone);
  setVal('set-email', s.email);
  setVal('set-address', s.campusAddress);
  setVal('set-principal', s.principalName);
  setVal('set-principal-qual', s.principalQualification);
  setVal('set-session', s.academicSession);
  setVal('set-bank-name', s.bankName);
  setVal('set-account-title', s.accountTitle);
  setVal('set-account-num', s.accountNumber);
  setVal('set-challan-due', s.challanDueDay);

  renderAuditLogs();
}

function saveSettings() {
  const updated = {
    schoolName: document.getElementById('set-school-name').value.trim(),
    slogan: document.getElementById('set-slogan').value.trim(),
    phone: document.getElementById('set-phone').value.trim(),
    email: document.getElementById('set-email').value.trim(),
    campusAddress: document.getElementById('set-address').value.trim(),
    principalName: document.getElementById('set-principal').value.trim(),
    principalQualification: document.getElementById('set-principal-qual').value.trim(),
    academicSession: document.getElementById('set-session').value.trim(),
    bankName: document.getElementById('set-bank-name').value.trim(),
    accountTitle: document.getElementById('set-account-title').value.trim(),
    accountNumber: document.getElementById('set-account-num').value.trim(),
    challanDueDay: parseInt(document.getElementById('set-challan-due').value) || 10
  };

  window.AOK_DB.updateSettings(updated);
  showToast('School profile and bank settings saved!', 'success');
}

function renderAuditLogs() {
  const container = document.getElementById('audit-logs-table-body');
  if (!container) return;

  const logs = window.AOK_DB.getAll('audit_logs');
  if (logs.length === 0) {
    container.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No audit logs yet.</td></tr>`;
    return;
  }

  let html = '';
  logs.slice(0, 15).forEach(log => {
    const timeStr = new Date(log.timestamp).toLocaleString('en-PK', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    html += `
      <tr>
        <td style="font-size: 0.8rem; color: var(--text-muted);">${timeStr}</td>
        <td><strong>${escapeHtml(log.user)}</strong></td>
        <td><span class="badge badge-primary">${log.action}</span></td>
        <td style="font-size: 0.85rem;">${escapeHtml(log.details)}</td>
      </tr>
    `;
  });

  container.innerHTML = html;
}

/* ==========================================================================
   Helper Utilities
   ========================================================================== */

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
