/**
 * The Ambassadors of Knowledge - School Admin Database Engine
 * Handles persistent client-side data store with LocalStorage & cross-tab sync.
 */

const AOK_DB_KEY = 'aok_school_database_v1';

// Seed Initial Data
const DEFAULT_DATABASE = {
  website_content: {
    general: {
      schoolName: 'The Ambassadors of Knowledge',
      shortName: 'AOK',
      slogan: 'Your Bright Future Starts Here',
      phone: '03475409209',
      email: 'shahzadalishahjaffri@gmail.com',
      address: 'Dhok Badam Satramile, Bhara Kahu, Islamabad',
      admissionsBadge: 'Admissions Open 2026-2027',
      whatsappPhone: '923475409209',
      officeHours: 'Monday - Saturday: 8:00 AM - 2:00 PM',
      sundayStatus: 'Sunday: Closed'
    },
    hero: {
      mottoTag: '✨ Your Bright Future Starts Here',
      title: 'Empowering Minds, Shaping Tomorrow\'s Leaders',
      desc: 'Welcome to The Ambassadors of Knowledge in Dhok Badam Satramile, Bhara Kahu, Islamabad. Providing a nurturing, values-driven environment from Playgroup up to Matric (Class 10 Arts Stream).',
      stat1Title: 'Playgroup - 10th',
      stat1Desc: 'Comprehensive Academic Span',
      stat2Title: 'Rs. 1,500',
      stat2Desc: 'Affordable Starting Fees',
      stat3Title: 'Arts Specialization',
      stat3Desc: '9th & 10th Board Preparation'
    },
    leadership: {
      name: 'Shahzad Ali Shah Jaffri',
      qualification: 'MBA Finance',
      role: 'Principal & Founder',
      org: 'The Ambassadors of Knowledge, Islamabad',
      quote: 'At The Ambassadors of Knowledge, we believe that education is not merely about syllabus completion—it is about cultivating moral consciousness, intellectual curiosity, and self-belief in every young learner.',
      message: 'We established this institution in Dhok Badam, Satra Mile to bring top-tier, structured, and affordable schooling to the families of Bhara Kahu. From their first words in Playgroup to their board examinations in Class 10 Arts, our faculty treats every student with personalized care, dignity, and encouragement.'
    },
    fees: {
      playgroup: 1500,
      nursery: 1500,
      prep: 1500,
      class1: 1600,
      class2: 1800,
      class3: 1800,
      class4: 1800,
      class5: 2000,
      class6: 2200,
      class7: 2200,
      class8: 2200,
      pre9: 2500,
      class9: 2500,
      class10: 2500,
      siblingDiscountPercent: 10
    },
    about: {
      heritageTitle: 'Nurturing Intellect and Integrity in Every Student',
      vision: 'To be recognized as a leading community academy in Islamabad that equips youth with sharp critical intellect, ethical grounding, and creative expression to become productive ambassadors of positive societal change.',
      mission: 'To deliver affordable, top-tier schooling from Playgroup through Matric Arts, cultivating curious minds, moral integrity, civic awareness, and self-belief in every student entrusted to our care.',
      coreValues: 'Integrity, Compassion, Curiosity, and Perseverance. We instill these values through classroom discussions, teacher mentorship, assembly reminders, and daily student interactions.'
    }
  },

  settings: {
    schoolName: 'The Ambassadors of Knowledge',
    shortName: 'AOK',
    slogan: 'Your Bright Future Starts Here',
    campusAddress: 'Dhok Badam Satramile, Bhara Kahu, Islamabad',
    phone: '03475409209',
    email: 'shahzadalishahjaffri@gmail.com',
    principalName: 'Shahzad Ali Shah Jaffri',
    principalQualification: 'MBA Finance',
    academicSession: '2026-2027',
    bankName: 'Allied Bank Limited (Bhara Kahu Branch)',
    accountTitle: 'The Ambassadors of Knowledge School',
    accountNumber: '0281-0010045892100019',
    challanDueDay: 10,
    lateFeeFine: 100
  },

  inquiries: [
    {
      id: 'inq_101',
      parentName: 'Muhammad Tariq Abbasi',
      studentName: 'Hamza Tariq',
      phone: '03005128941',
      grade: 'Class 9 (Arts)',
      message: 'Inquiring about Arts group subjects, board affiliation, and admission criteria for session 2026.',
      status: 'new',
      createdAt: '2026-11-23T10:15:00.000Z',
      notes: 'Parent works in Islamabad secretariat, interested in General Science & Civics group.'
    },
    {
      id: 'inq_102',
      parentName: 'Raja Naveed Akhtar',
      studentName: 'Ayesha Naveed',
      phone: '03335541920',
      grade: 'Playgroup',
      message: 'Looking for morning playgroup timing, activity learning setup, and teacher-to-child ratio.',
      status: 'contacted',
      createdAt: '2026-11-22T14:30:00.000Z',
      notes: 'Contacted via WhatsApp on 22 Nov. Scheduled campus visit for Thursday morning.'
    },
    {
      id: 'inq_103',
      parentName: 'Syed Qasim Ali Shah',
      studentName: 'Zainab Shah',
      phone: '03455192837',
      grade: 'Class 5',
      message: 'Relocating from Rawalpindi to Satramile Bhara Kahu. Need mid-term admission for primary 5th.',
      status: 'interview_scheduled',
      createdAt: '2026-11-21T09:00:00.000Z',
      notes: 'Assessment interview scheduled with Principal on Saturday 10:00 AM.'
    },
    {
      id: 'inq_104',
      parentName: 'Malik Shakeel Ahmed',
      studentName: 'Bilal Shakeel',
      phone: '03125890432',
      grade: 'Class 10 (Arts)',
      message: 'Wants admission for final board prep year in Matric Arts stream.',
      status: 'admitted',
      createdAt: '2026-11-18T16:20:00.000Z',
      notes: 'Admission approved. Enrolled as Roll No. AOK-2026-017.'
    },
    {
      id: 'inq_105',
      parentName: 'Chaudhry Arshad Mehmood',
      studentName: 'Fatima Arshad',
      phone: '03025789123',
      grade: 'Class 3',
      message: 'Inquiring about sibling discount for two children (Class 3 & Prep).',
      status: 'contacted',
      createdAt: '2026-11-20T11:45:00.000Z',
      notes: 'Explained 10% sibling discount policy. Awaiting family document submission.'
    },
    {
      id: 'inq_106',
      parentName: 'Zahid Hussain Kiyani',
      studentName: 'Usman Zahid',
      phone: '03465109823',
      grade: 'Class 7',
      message: 'Want to confirm school timings and monthly tuition fees for Middle section.',
      status: 'new',
      createdAt: '2026-11-23T18:00:00.000Z',
      notes: 'New inquiry received via website contact form.'
    }
  ],

  students: [
    {
      id: 'stu_001',
      rollNo: 'AOK-2026-001',
      fullName: 'Muhammad Daniyal',
      fatherName: 'Rashid Mahmood',
      gender: 'Male',
      grade: 'Class 10 (Arts)',
      section: 'A',
      dob: '2010-06-15',
      phone: '03009876541',
      address: 'Near Satra Mile Bridge, Bhara Kahu, Islamabad',
      admissionDate: '2022-04-10',
      monthlyFee: 2500,
      feeStatus: 'paid',
      bloodGroup: 'B+'
    },
    {
      id: 'stu_002',
      rollNo: 'AOK-2026-002',
      fullName: 'Zainab Fatima',
      fatherName: 'Syed Mukhtar Shah',
      gender: 'Female',
      grade: 'Class 10 (Arts)',
      section: 'A',
      dob: '2010-09-22',
      phone: '03455123984',
      address: 'Dhok Badam, Bhara Kahu, Islamabad',
      admissionDate: '2021-03-15',
      monthlyFee: 2500,
      feeStatus: 'paid',
      bloodGroup: 'O+'
    },
    {
      id: 'stu_003',
      rollNo: 'AOK-2026-003',
      fullName: 'Abdullah Khan',
      fatherName: 'Tariq Khan Jadoon',
      gender: 'Male',
      grade: 'Class 9 (Arts)',
      section: 'A',
      dob: '2011-04-05',
      phone: '03335198234',
      address: 'Main Murree Road, Bhara Kahu',
      admissionDate: '2023-04-01',
      monthlyFee: 2500,
      feeStatus: 'unpaid',
      bloodGroup: 'A+'
    },
    {
      id: 'stu_004',
      rollNo: 'AOK-2026-004',
      fullName: 'Amina Bibi',
      fatherName: 'Muhammad Sadiq',
      gender: 'Female',
      grade: 'Class 9 (Arts)',
      section: 'A',
      dob: '2011-11-12',
      phone: '03135567812',
      address: 'Dhok Badam Satramile, Islamabad',
      admissionDate: '2023-04-01',
      monthlyFee: 2500,
      feeStatus: 'paid',
      bloodGroup: 'AB+'
    },
    {
      id: 'stu_005',
      rollNo: 'AOK-2026-005',
      fullName: 'Syed Haider Ali',
      fatherName: 'Syed Kazim Hussain',
      gender: 'Male',
      grade: 'Class 8',
      section: 'A',
      dob: '2012-07-19',
      phone: '03465192847',
      address: 'PTV Colony, Bhara Kahu',
      admissionDate: '2022-08-10',
      monthlyFee: 2200,
      feeStatus: 'paid',
      bloodGroup: 'O+'
    },
    {
      id: 'stu_006',
      rollNo: 'AOK-2026-006',
      fullName: 'Maryam Noor',
      fatherName: 'Noor Muhammad Abbasi',
      gender: 'Female',
      grade: 'Class 7',
      section: 'A',
      dob: '2013-02-14',
      phone: '03015982341',
      address: 'Satramile Bazar, Bhara Kahu',
      admissionDate: '2023-03-12',
      monthlyFee: 2200,
      feeStatus: 'paid',
      bloodGroup: 'B+'
    },
    {
      id: 'stu_007',
      rollNo: 'AOK-2026-007',
      fullName: 'Hamza Rehan',
      fatherName: 'Rehan Ullah',
      gender: 'Male',
      grade: 'Class 6',
      section: 'A',
      dob: '2014-05-28',
      phone: '03425189201',
      address: 'Dhok Badam, Satramile',
      admissionDate: '2024-04-05',
      monthlyFee: 2200,
      feeStatus: 'unpaid',
      bloodGroup: 'A-'
    },
    {
      id: 'stu_008',
      rollNo: 'AOK-2026-008',
      fullName: 'Ayaan Malik',
      fatherName: 'Malik Kamran',
      gender: 'Male',
      grade: 'Class 5',
      section: 'A',
      dob: '2015-08-10',
      phone: '03215891240',
      address: 'Simly Dam Road, Bhara Kahu',
      admissionDate: '2023-04-10',
      monthlyFee: 2000,
      feeStatus: 'paid',
      bloodGroup: 'O+'
    },
    {
      id: 'stu_009',
      rollNo: 'AOK-2026-009',
      fullName: 'Hoorain Fatima',
      fatherName: 'Zulqarnain Haider',
      gender: 'Female',
      grade: 'Class 4',
      section: 'A',
      dob: '2016-10-03',
      phone: '03445190823',
      address: 'Dhok Badam, Islamabad',
      admissionDate: '2024-04-01',
      monthlyFee: 1800,
      feeStatus: 'paid',
      bloodGroup: 'B+'
    },
    {
      id: 'stu_010',
      rollNo: 'AOK-2026-010',
      fullName: 'Bilal Ahmed',
      fatherName: 'Mushtaq Ahmed',
      gender: 'Male',
      grade: 'Class 3',
      section: 'A',
      dob: '2017-03-15',
      phone: '03035987123',
      address: 'Satramile, Bhara Kahu',
      admissionDate: '2024-04-01',
      monthlyFee: 1800,
      feeStatus: 'paid',
      bloodGroup: 'A+'
    },
    {
      id: 'stu_011',
      rollNo: 'AOK-2026-011',
      fullName: 'Eman Zahra',
      fatherName: 'Syed Ali Raza',
      gender: 'Female',
      grade: 'Class 2',
      section: 'A',
      dob: '2018-01-20',
      phone: '03475189021',
      address: 'Dhok Badam Satramile',
      admissionDate: '2025-04-01',
      monthlyFee: 1800,
      feeStatus: 'unpaid',
      bloodGroup: 'O+'
    },
    {
      id: 'stu_012',
      rollNo: 'AOK-2026-012',
      fullName: 'Ali Hassan',
      fatherName: 'Hassan Mehmood',
      gender: 'Male',
      grade: 'Class 1',
      section: 'A',
      dob: '2019-06-11',
      phone: '03315789021',
      address: 'Bhara Kahu, Islamabad',
      admissionDate: '2025-04-01',
      monthlyFee: 1600,
      feeStatus: 'paid',
      bloodGroup: 'B+'
    },
    {
      id: 'stu_013',
      rollNo: 'AOK-2026-013',
      fullName: 'Khadija Tul Kubra',
      fatherName: 'Muhammad Irfan',
      gender: 'Female',
      grade: 'Prep',
      section: 'A',
      dob: '2020-04-18',
      phone: '03085190284',
      address: 'Dhok Badam Satramile',
      admissionDate: '2026-03-01',
      monthlyFee: 1500,
      feeStatus: 'paid',
      bloodGroup: 'A+'
    },
    {
      id: 'stu_014',
      rollNo: 'AOK-2026-014',
      fullName: 'Muhammad Musa',
      fatherName: 'Naveed Akhtar',
      gender: 'Male',
      grade: 'Nursery',
      section: 'A',
      dob: '2021-08-09',
      phone: '03335541920',
      address: 'Satramile, Islamabad',
      admissionDate: '2026-03-01',
      monthlyFee: 1500,
      feeStatus: 'paid',
      bloodGroup: 'O+'
    },
    {
      id: 'stu_015',
      rollNo: 'AOK-2026-015',
      fullName: 'Aiza Noor',
      fatherName: 'Farhan Zaidi',
      gender: 'Female',
      grade: 'Playgroup',
      section: 'A',
      dob: '2022-11-25',
      phone: '03155189234',
      address: 'Dhok Badam, Bhara Kahu',
      admissionDate: '2026-03-01',
      monthlyFee: 1500,
      feeStatus: 'paid',
      bloodGroup: 'B+'
    }
  ],

  fee_records: [
    {
      id: 'fee_101',
      challanNo: 'CHL-2026-101',
      studentId: 'stu_001',
      studentName: 'Muhammad Daniyal',
      rollNo: 'AOK-2026-001',
      grade: 'Class 10 (Arts)',
      month: 'November 2026',
      tuitionFee: 2500,
      discount: 0,
      arrears: 0,
      netPayable: 2500,
      dueDate: '2026-11-10',
      paidDate: '2026-11-06',
      status: 'paid',
      paymentMethod: 'Cash (School Counter)',
      receiptNo: 'REC-2026-089'
    },
    {
      id: 'fee_102',
      challanNo: 'CHL-2026-102',
      studentId: 'stu_002',
      studentName: 'Zainab Fatima',
      rollNo: 'AOK-2026-002',
      grade: 'Class 10 (Arts)',
      month: 'November 2026',
      tuitionFee: 2500,
      discount: 250,
      arrears: 0,
      netPayable: 2250,
      dueDate: '2026-11-10',
      paidDate: '2026-11-08',
      status: 'paid',
      paymentMethod: 'Bank Transfer (ABL)',
      receiptNo: 'REC-2026-092'
    },
    {
      id: 'fee_103',
      challanNo: 'CHL-2026-103',
      studentId: 'stu_003',
      studentName: 'Abdullah Khan',
      rollNo: 'AOK-2026-003',
      grade: 'Class 9 (Arts)',
      month: 'November 2026',
      tuitionFee: 2500,
      discount: 0,
      arrears: 0,
      netPayable: 2500,
      dueDate: '2026-11-10',
      paidDate: null,
      status: 'unpaid',
      paymentMethod: null,
      receiptNo: null
    },
    {
      id: 'fee_104',
      challanNo: 'CHL-2026-104',
      studentId: 'stu_004',
      studentName: 'Amina Bibi',
      rollNo: 'AOK-2026-004',
      grade: 'Class 9 (Arts)',
      month: 'November 2026',
      tuitionFee: 2500,
      discount: 0,
      arrears: 0,
      netPayable: 2500,
      dueDate: '2026-11-10',
      paidDate: '2026-11-09',
      status: 'paid',
      paymentMethod: 'Cash (School Counter)',
      receiptNo: 'REC-2026-099'
    },
    {
      id: 'fee_105',
      challanNo: 'CHL-2026-105',
      studentId: 'stu_007',
      studentName: 'Hamza Rehan',
      rollNo: 'AOK-2026-007',
      grade: 'Class 6',
      month: 'November 2026',
      tuitionFee: 2200,
      discount: 0,
      arrears: 500,
      netPayable: 2700,
      dueDate: '2026-11-10',
      paidDate: null,
      status: 'unpaid',
      paymentMethod: null,
      receiptNo: null
    },
    {
      id: 'fee_106',
      challanNo: 'CHL-2026-106',
      studentId: 'stu_011',
      studentName: 'Eman Zahra',
      rollNo: 'AOK-2026-011',
      grade: 'Class 2',
      month: 'November 2026',
      tuitionFee: 1800,
      discount: 180,
      arrears: 0,
      netPayable: 1620,
      dueDate: '2026-11-10',
      paidDate: null,
      status: 'unpaid',
      paymentMethod: null,
      receiptNo: null
    }
  ],

  classes: [
    { id: 'cls_pg', name: 'Playgroup', wing: 'Early Learning Wing', monthlyFee: 1500, capacity: 25, enrolled: 18, room: 'Room 01 (Ground)', teacher: 'Ms. Tahira Batool' },
    { id: 'cls_nur', name: 'Nursery', wing: 'Early Learning Wing', monthlyFee: 1500, capacity: 25, enrolled: 20, room: 'Room 02 (Ground)', teacher: 'Ms. Sadia Kausar' },
    { id: 'cls_prep', name: 'Prep', wing: 'Early Learning Wing', monthlyFee: 1500, capacity: 25, enrolled: 22, room: 'Room 03 (Ground)', teacher: 'Ms. Naila Bibi' },
    { id: 'cls_1', name: 'Class 1', wing: 'Primary Wing', monthlyFee: 1600, capacity: 30, enrolled: 24, room: 'Room 101 (1st Fl)', teacher: 'Ms. Farzana Shaheen' },
    { id: 'cls_2', name: 'Class 2', wing: 'Primary Wing', monthlyFee: 1800, capacity: 30, enrolled: 21, room: 'Room 102 (1st Fl)', teacher: 'Ms. Maryam Abbasi' },
    { id: 'cls_3', name: 'Class 3', wing: 'Primary Wing', monthlyFee: 1800, capacity: 30, enrolled: 25, room: 'Room 103 (1st Fl)', teacher: 'Mr. Asif Mehmood' },
    { id: 'cls_4', name: 'Class 4', wing: 'Primary Wing', monthlyFee: 1800, capacity: 30, enrolled: 23, room: 'Room 104 (1st Fl)', teacher: 'Ms. Rabia Zafar' },
    { id: 'cls_5', name: 'Class 5', wing: 'Primary Wing', monthlyFee: 2000, capacity: 30, enrolled: 26, room: 'Room 105 (1st Fl)', teacher: 'Mr. Tariq Jamil' },
    { id: 'cls_6', name: 'Class 6', wing: 'Middle Wing', monthlyFee: 2200, capacity: 35, enrolled: 28, room: 'Room 201 (2nd Fl)', teacher: 'Mr. Waqas Ahmed' },
    { id: 'cls_7', name: 'Class 7', wing: 'Middle Wing', monthlyFee: 2200, capacity: 35, enrolled: 27, room: 'Room 202 (2nd Fl)', teacher: 'Ms. Samina Yasmeen' },
    { id: 'cls_8', name: 'Class 8', wing: 'Middle Wing', monthlyFee: 2200, capacity: 35, enrolled: 29, room: 'Room 203 (2nd Fl)', teacher: 'Mr. Bilal Khan' },
    { id: 'cls_pre9', name: 'Pre-9', wing: 'Secondary Arts Wing', monthlyFee: 2500, capacity: 35, enrolled: 24, room: 'Room 204 (2nd Fl)', teacher: 'Mr. Usman Ali' },
    { id: 'cls_9', name: 'Class 9 (Arts)', wing: 'Secondary Arts Wing', monthlyFee: 2500, capacity: 35, enrolled: 31, room: 'Hall A (2nd Fl)', teacher: 'Mr. Usman Ali (Senior Arts)' },
    { id: 'cls_10', name: 'Class 10 (Arts)', wing: 'Secondary Arts Wing', monthlyFee: 2500, capacity: 35, enrolled: 30, room: 'Hall B (2nd Fl)', teacher: 'Principal Shahzad Ali Shah Jaffri' }
  ],

  staff: [
    {
      id: 'stf_01',
      name: 'Shahzad Ali Shah Jaffri',
      designation: 'Principal & Founder',
      qualification: 'MBA Finance',
      department: 'Leadership & Senior Secondary',
      phone: '03475409209',
      email: 'shahzadalishahjaffri@gmail.com',
      joiningDate: '2019-01-01',
      status: 'Active'
    },
    {
      id: 'stf_02',
      name: 'Sir Usman Ali',
      designation: 'Senior Teacher & Academic Coordinator',
      qualification: 'M.A. English, B.Ed',
      department: 'Secondary Arts Wing (9th & 10th)',
      phone: '03005432190',
      email: 'usman.ali@aok.site.je',
      joiningDate: '2021-03-15',
      status: 'Active'
    },
    {
      id: 'stf_03',
      name: 'Ms. Samina Yasmeen',
      designation: 'Middle Wing Incharge',
      qualification: 'M.Sc. Mathematics, B.Ed',
      department: 'Middle Section (Class 6 - 8)',
      phone: '03455891234',
      email: 'samina.yasmeen@aok.site.je',
      joiningDate: '2021-08-01',
      status: 'Active'
    },
    {
      id: 'stf_04',
      name: 'Ms. Tahira Batool',
      designation: 'Early Childhood Wing Coordinator',
      qualification: 'M.A. Urdu, Montessori Diploma',
      department: 'Playgroup to Prep',
      phone: '03135891200',
      email: 'tahira.batool@aok.site.je',
      joiningDate: '2022-02-10',
      status: 'Active'
    },
    {
      id: 'stf_05',
      name: 'Mr. Tariq Jamil',
      designation: 'Senior Primary Teacher',
      qualification: 'B.Sc., B.Ed',
      department: 'Primary Section',
      phone: '03325678912',
      email: 'tariq.jamil@aok.site.je',
      joiningDate: '2022-09-01',
      status: 'Active'
    },
    {
      id: 'stf_06',
      name: 'Syed Ali Asghar',
      designation: 'Accounts Officer & Fee Incharge',
      qualification: 'B.Com, PIPFA Qualified',
      department: 'Finance & Administration',
      phone: '03465123490',
      email: 'accounts@aok.site.je',
      joiningDate: '2020-05-10',
      status: 'Active'
    }
  ],

  notices: [
    {
      id: 'not_01',
      title: 'Admissions Open for Academic Session 2026-2027',
      category: 'Admissions',
      priority: 'High',
      publishDate: '2026-11-15',
      targetAudience: 'General Public & Parents',
      content: 'Admissions are officially open from Playgroup to Class 10 (Arts Group). Visit the campus office between 8:00 AM and 2:00 PM for prospectus and registration.',
      isActive: true
    },
    {
      id: 'not_02',
      title: 'Matric Arts Board Examination Registration (FBISE / BISE)',
      category: 'Academic',
      priority: 'Urgent',
      publishDate: '2026-11-20',
      targetAudience: 'Class 9 & 10 Students',
      content: 'All 9th and 10th grade Arts students must submit their attested B-form, passport size photos, and board registration fees to Sir Usman Ali by 30th November 2026.',
      isActive: true
    },
    {
      id: 'not_03',
      title: 'Monthly Parent-Teacher Meeting (PTM)',
      category: 'Meeting',
      priority: 'Normal',
      publishDate: '2026-11-18',
      targetAudience: 'All Parents',
      content: 'The monthly PTM will be held on the first Saturday of December from 9:00 AM to 1:00 PM. First-term student progress reports will be handed over.',
      isActive: true
    },
    {
      id: 'not_04',
      title: 'Winter Uniform Mandatory Guidelines',
      category: 'General',
      priority: 'Normal',
      publishDate: '2026-11-10',
      targetAudience: 'All Students',
      content: 'Starting 1st December, all students are required to wear complete winter school uniform (Navy blue sweater/blazer and official tie).',
      isActive: true
    }
  ],

  gallery: [
    {
      id: 'gal_01',
      title: 'Annual Prize Distribution Ceremony',
      category: 'Ceremony',
      image: '../assets/images/gallery/annual-prize-distribution.jpg',
      caption: 'Principal Shahzad Ali Shah Jaffri addressing students and parents during our annual awards celebration.',
      date: '2026-03-20'
    },
    {
      id: 'gal_02',
      title: 'Pakistan Day Stage Performance',
      category: 'Celebration',
      image: '../assets/images/gallery/national-day-performance.jpg',
      caption: 'Students showcasing patriotism and leadership in traditional and ceremonial presentation.',
      date: '2026-03-23'
    },
    {
      id: 'gal_03',
      title: 'Aerospace & Science Study Trip',
      category: 'Excursion',
      image: '../assets/images/gallery/museum-jet-tour.jpg',
      caption: 'Students exploring aviation engineering and defense history on an educational museum trip.',
      date: '2026-05-14'
    },
    {
      id: 'gal_04',
      title: 'Class Delegation Outdoor Tour',
      category: 'Excursion',
      image: '../assets/images/gallery/helicopter-group-photo.jpg',
      caption: 'Middle and high school students during historical museum aircraft display tour.',
      date: '2026-05-14'
    },
    {
      id: 'gal_05',
      title: 'Botanical & Ecological Study Tour',
      category: 'Excursion',
      image: '../assets/images/gallery/park-study-tour.jpg',
      caption: 'Hands-on natural science exploration and teamwork exercise in Islamabad park.',
      date: '2026-09-18'
    },
    {
      id: 'gal_06',
      title: 'Junior Wing Zoology Discovery Trip',
      category: 'Excursion',
      image: '../assets/images/gallery/zoo-field-trip.jpg',
      caption: 'Primary wing students discovering animal habitats and biodiversity during outdoor study tour.',
      date: '2026-10-05'
    }
  ],

  audit_logs: [
    {
      id: 'log_01',
      timestamp: '2026-11-20T08:00:00.000Z',
      user: 'Shahzad Ali Shah Jaffri',
      action: 'SYSTEM_INIT',
      details: 'The Ambassadors of Knowledge Admin Dashboard initialized with academic session 2026-2027.'
    },
    {
      id: 'log_02',
      timestamp: '2026-11-22T09:30:00.000Z',
      user: 'Accounts Office',
      action: 'FEE_PAYMENT',
      details: 'Recorded fee payment for Muhammad Daniyal (AOK-2026-001) - Rs. 2,500.'
    },
    {
      id: 'log_03',
      timestamp: '2026-11-23T11:00:00.000Z',
      user: 'Administrator',
      action: 'INQUIRY_RECEIVED',
      details: 'New website admission inquiry received for Hamza Tariq (Class 9 Arts).'
    }
  ]
};

// Database Management Class
class SchoolDatabase {
  constructor() {
    this.storageKey = AOK_DB_KEY;
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      this.saveDatabase(DEFAULT_DATABASE);
    } else {
      // Migrate existing db if website_content is missing
      const db = this.getDatabase();
      if (!db.website_content) {
        db.website_content = DEFAULT_DATABASE.website_content;
        this.saveDatabase(db);
      }
    }

    if (!localStorage.getItem('aok_website_content')) {
      const db = this.getDatabase();
      const content = db.website_content || DEFAULT_DATABASE.website_content;
      try {
        localStorage.setItem('aok_website_content', JSON.stringify(content));
      } catch (e) {}
    }
  }

  getDatabase() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return DEFAULT_DATABASE;
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading database from localStorage:', e);
      return DEFAULT_DATABASE;
    }
  }

  saveDatabase(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      window.dispatchEvent(new Event('aok_db_updated'));
      return true;
    } catch (e) {
      console.error('Error saving database to localStorage:', e);
      return false;
    }
  }

  getAll(collection) {
    const db = this.getDatabase();
    return db[collection] || [];
  }

  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => item.id === id) || null;
  }

  add(collection, item) {
    const db = this.getDatabase();
    if (!db[collection]) db[collection] = [];

    if (!item.id) {
      item.id = `${collection.slice(0, 3)}_${Date.now()}`;
    }
    db[collection].unshift(item);
    this.saveDatabase(db);
    this.logAction('Created new item in ' + collection + ' (ID: ' + item.id + ')');
    return item;
  }

  update(collection, id, updates) {
    const db = this.getDatabase();
    if (!db[collection]) return null;

    const index = db[collection].findIndex(item => item.id === id);
    if (index === -1) return null;

    db[collection][index] = { ...db[collection][index], ...updates };
    this.saveDatabase(db);
    this.logAction('Updated item in ' + collection + ' (ID: ' + id + ')');
    return db[collection][index];
  }

  delete(collection, id) {
    const db = this.getDatabase();
    if (!db[collection]) return false;

    const initialLength = db[collection].length;
    db[collection] = db[collection].filter(item => item.id !== id);
    if (db[collection].length !== initialLength) {
      this.saveDatabase(db);
      this.logAction('Deleted item from ' + collection + ' (ID: ' + id + ')');
      return true;
    }
    return false;
  }

  getSettings() {
    const db = this.getDatabase();
    return db.settings || DEFAULT_DATABASE.settings;
  }

  updateSettings(newSettings) {
    const db = this.getDatabase();
    db.settings = { ...db.settings, ...newSettings };
    this.saveDatabase(db);
    this.logAction('Updated school settings and challan configuration.');
    return db.settings;
  }

  getWebsiteContent() {
    const db = this.getDatabase();
    return db.website_content || DEFAULT_DATABASE.website_content;
  }

  saveWebsiteContent(content) {
    const db = this.getDatabase();
    db.website_content = { ...DEFAULT_DATABASE.website_content, ...content };
    this.saveDatabase(db);
    try {
      localStorage.setItem('aok_website_content', JSON.stringify(db.website_content));
      window.dispatchEvent(new Event('aok_website_content_updated'));
    } catch (e) {}
    this.logAction('Updated and published live website content via CMS.');
    return db.website_content;
  }

  resetWebsiteContent() {
    return this.saveWebsiteContent(DEFAULT_DATABASE.website_content);
  }

  logAction(details, action = 'USER_ACTION', user = null) {
    const db = this.getDatabase();
    if (!db.audit_logs) db.audit_logs = [];

    const currentUser = user || (window.SchoolAuth ? window.SchoolAuth.getCurrentUser()?.name : 'Admin User') || 'Admin User';
    const logEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: currentUser,
      action: action,
      details: details
    };

    db.audit_logs.unshift(logEntry);
    // Keep max 100 logs
    if (db.audit_logs.length > 100) {
      db.audit_logs = db.audit_logs.slice(0, 100);
    }
    this.saveDatabase(db);
  }

  // Cross-sync: Capture website inquiries from contact form
  addWebsiteInquiry(inquiry) {
    const item = {
      id: `inq_${Date.now()}`,
      parentName: inquiry.parentName || inquiry.name || 'Anonymous Parent',
      studentName: inquiry.studentName || 'Not specified',
      phone: inquiry.phone || 'N/A',
      grade: inquiry.grade || 'General Inquiry',
      message: inquiry.message || 'No additional message provided.',
      status: 'new',
      createdAt: new Date().toISOString(),
      notes: inquiry.notes || 'Submitted through website online inquiry form.'
    };
    return this.add('inquiries', item);
  }

  // Generate standard Roll Number
  generateRollNumber() {
    const students = this.getAll('students');
    const nextNum = students.length + 1;
    const padded = String(nextNum).padStart(3, '0');
    return `AOK-2026-${padded}`;
  }

  // Generate standard Challan Number
  generateChallanNumber() {
    const records = this.getAll('fee_records');
    const nextNum = 100 + records.length + 1;
    return `CHL-2026-${nextNum}`;
  }

  // Export full JSON backup
  exportBackup() {
    const db = this.getDatabase();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AOK_School_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.logAction('Exported full database backup to JSON file.');
  }

  // Import JSON backup
  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.students && parsed.classes) {
        this.saveDatabase(parsed);
        this.logAction('Restored database from external JSON backup.');
        return { success: true };
      }
      return { success: false, error: 'Invalid backup file schema.' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Reset to factory defaults
  resetToDefaults() {
    this.saveDatabase(DEFAULT_DATABASE);
    this.logAction('System reset to default sample data.');
    return true;
  }
}

// Global database singleton
window.AOK_DB = new SchoolDatabase();
