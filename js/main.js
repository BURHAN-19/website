/**
 * The Ambassadors of Knowledge - Main JavaScript
 * Domain: https://aok.site.je
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFeeCalculator();
  initContactForm();
  initActiveNavLink();
  initLightbox();
});

// Mobile Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Active Nav Link Detection
function initActiveNavLink() {
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath.endsWith(href))) {
      link.classList.add('active');
    }
  });
}

// Interactive Fee Calculator
function initFeeCalculator() {
  const gradeSelect = document.getElementById('calc-grade');
  const feeDisplay = document.getElementById('calc-fee-amount');
  const annualDisplay = document.getElementById('calc-annual-amount');
  const siblingCheck = document.getElementById('calc-sibling');
  const applyBtn = document.getElementById('calc-apply-btn');

  if (!gradeSelect || !feeDisplay) return;

  const feeData = {
    'playgroup': { name: 'Playgroup', fee: 1500 },
    'nursery': { name: 'Nursery', fee: 1500 },
    'prep': { name: 'Prep', fee: 1500 },
    'class1': { name: 'Class 1', fee: 1600 },
    'class2': { name: 'Class 2', fee: 1800 },
    'class3': { name: 'Class 3', fee: 1800 },
    'class4': { name: 'Class 4', fee: 1800 },
    'class5': { name: 'Class 5', fee: 2000 },
    'class6': { name: 'Class 6', fee: 2200 },
    'class7': { name: 'Class 7', fee: 2200 },
    'class8': { name: 'Class 8', fee: 2200 },
    'pre9': { name: 'Pre-9', fee: 2500 },
    'class9': { name: 'Class 9 (Arts)', fee: 2500 },
    'class10': { name: 'Class 10 (Arts)', fee: 2500 }
  };

  function updateFee() {
    const selectedKey = gradeSelect.value;
    const item = feeData[selectedKey] || { name: 'Grade', fee: 1500 };
    let monthly = item.fee;

    // Optional sibling discount (10% off)
    const isSibling = siblingCheck && siblingCheck.checked;
    if (isSibling) {
      monthly = Math.round(monthly * 0.9);
    }

    const annual = monthly * 12;

    feeDisplay.textContent = `Rs. ${monthly.toLocaleString()} / month`;
    if (annualDisplay) {
      annualDisplay.textContent = `Rs. ${annual.toLocaleString()} / year (Tuition)`;
    }

    if (applyBtn) {
      applyBtn.href = `contact.html?grade=${encodeURIComponent(item.name)}`;
    }
  }

  gradeSelect.addEventListener('change', updateFee);
  if (siblingCheck) {
    siblingCheck.addEventListener('change', updateFee);
  }

  // Initial calculation
  updateFee();
}

// Contact & Inquiry Form Handler
function initContactForm() {
  const form = document.getElementById('admission-inquiry-form');
  if (!form) return;

  // Auto-fill grade from URL query if present (e.g. contact.html?grade=Class%209)
  const urlParams = new URLSearchParams(window.location.search);
  const gradeParam = urlParams.get('grade');
  if (gradeParam) {
    const gradeSelect = form.querySelector('[name="student_grade"]');
    if (gradeSelect) {
      for (let option of gradeSelect.options) {
        if (option.text.toLowerCase().includes(gradeParam.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }
  }

  const whatsappBtn = document.getElementById('submit-whatsapp');
  const emailBtn = document.getElementById('submit-email');

  function getFormData() {
    const name = form.querySelector('[name="parent_name"]')?.value.trim();
    const studentName = form.querySelector('[name="student_name"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const grade = form.querySelector('[name="student_grade"]')?.value;
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !phone) {
      alert('Please enter your name and phone number so we can get in touch.');
      return null;
    }

    return { 
      name, 
      studentName: studentName || 'Not specified', 
      phone, 
      grade: grade || 'General Inquiry', 
      message: message || 'N/A' 
    };
  }

  // Sync inquiry directly to local admin database store
  function saveInquiryToAdminDB(data) {
    try {
      const dbKey = 'aok_school_database_v1';
      let db = null;
      const raw = localStorage.getItem(dbKey);
      if (raw) {
        db = JSON.parse(raw);
      }
      if (!db) {
        db = { inquiries: [] };
      }
      if (!db.inquiries) {
        db.inquiries = [];
      }

      const newInq = {
        id: `inq_${Date.now()}`,
        parentName: data.name,
        studentName: data.studentName,
        phone: data.phone,
        grade: data.grade,
        message: data.message,
        status: 'new',
        createdAt: new Date().toISOString(),
        notes: 'Submitted via website online inquiry form.'
      };

      db.inquiries.unshift(newInq);
      localStorage.setItem(dbKey, JSON.stringify(db));
      window.dispatchEvent(new Event('aok_db_updated'));
    } catch (e) {
      console.warn('Could not record inquiry in local admin database:', e);
    }
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data) return;

      saveInquiryToAdminDB(data);

      const waText = `*Admission Inquiry - The Ambassadors of Knowledge*\n` +
                     `*Parent Name:* ${data.name}\n` +
                     `*Student Name:* ${data.studentName}\n` +
                     `*Phone:* ${data.phone}\n` +
                     `*Grade:* ${data.grade}\n` +
                     `*Message/Questions:* ${data.message}\n\n` +
                     `Sent from website: https://aok.site.je`;

      const waUrl = `https://wa.me/923475409209?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank');
    });
  }

  if (emailBtn) {
    emailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = getFormData();
      if (!data) return;

      saveInquiryToAdminDB(data);

      const subject = `Admission Inquiry for ${data.grade} - ${data.name}`;
      const body = `Dear Administration,\n\nI would like to inquire about admission at The Ambassadors of Knowledge:\n\n` +
                   `Parent Name: ${data.name}\n` +
                   `Student Name: ${data.studentName}\n` +
                   `Contact Phone: ${data.phone}\n` +
                   `Grade: ${data.grade}\n` +
                   `Message: ${data.message}\n\n` +
                   `Location: Dhok Badam Satramile, Bhara Kahu, Islamabad`;

      window.location.href = `mailto:shahzadalishahjaffri@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
}


// Image Gallery Lightbox Modal
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('gallery-lightbox');
  if (!modal || galleryItems.length === 0) return;

  const modalImg = modal.querySelector('.lightbox-img');
  const modalCaption = modal.querySelector('.lightbox-caption');
  const closeBtn = modal.querySelector('.lightbox-close');
  const prevBtn = modal.querySelector('.lightbox-prev');
  const nextBtn = modal.querySelector('.lightbox-next');

  let currentIndex = 0;
  const itemsData = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-src') || item.querySelector('img').src,
    caption: item.querySelector('h4')?.textContent || 'Gallery Photo'
  }));

  function showImage(index) {
    if (index < 0) index = itemsData.length - 1;
    if (index >= itemsData.length) index = 0;
    currentIndex = index;
    modalImg.src = itemsData[currentIndex].src;
    modalCaption.textContent = itemsData[currentIndex].caption;
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      showImage(idx);
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') modal.classList.remove('active');
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}
