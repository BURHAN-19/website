/**
 * The Ambassadors of Knowledge - Admin Authentication & Session Management
 */

const AOK_AUTH_KEY = 'aok_admin_session_v1';

const ADMIN_ACCOUNTS = [
  {
    id: 'user_01',
    username: 'admin',
    email: 'admin@aok.site.je',
    password: 'admin123',
    name: 'Shahzad Ali Shah Jaffri',
    role: 'Super Administrator & Principal',
    qualification: 'MBA Finance',
    badge: 'Executive',
    avatar: '/assets/images/principal.jpg'
  },
  {
    id: 'user_02',
    username: 'accounts',
    email: 'accounts@aok.site.je',
    password: 'accounts123',
    name: 'Syed Ali Asghar',
    role: 'Accounts & Fee Incharge',
    qualification: 'B.Com / PIPFA',
    badge: 'Finance',
    avatar: '/assets/images/logo.png'
  },
  {
    id: 'user_03',
    username: 'coordinator',
    email: 'coordinator@aok.site.je',
    password: 'academic123',
    name: 'Sir Usman Ali',
    role: 'Academic Coordinator',
    qualification: 'M.A. English, B.Ed',
    badge: 'Academics',
    avatar: '/assets/images/logo.png'
  }
];

class AuthManager {
  constructor() {
    this.sessionKey = AOK_AUTH_KEY;
    this.accounts = this.loadAccounts();
  }

  getLoginUrl() {
    // If running in file:// or cleanUrls
    if (window.location.protocol === 'file:') return 'login.html';
    return window.location.pathname.endsWith('.html') ? '/admin/login.html' : '/admin/login';
  }

  getDashboardUrl() {
    if (window.location.protocol === 'file:') return 'index.html';
    return window.location.pathname.endsWith('.html') ? '/admin/index.html' : '/admin';
  }

  loadAccounts() {
    const saved = localStorage.getItem('aok_custom_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ADMIN_ACCOUNTS;
      }
    }
    return ADMIN_ACCOUNTS;
  }

  saveAccounts(accounts) {
    localStorage.setItem('aok_custom_accounts', JSON.stringify(accounts));
    this.accounts = accounts;
  }

  login(usernameOrEmail, password, rememberMe = true) {
    const user = this.accounts.find(acc => 
      (acc.username.toLowerCase() === usernameOrEmail.trim().toLowerCase() ||
       acc.email.toLowerCase() === usernameOrEmail.trim().toLowerCase()) &&
      acc.password === password
    );

    if (user) {
      const sessionData = {
        userId: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        qualification: user.qualification || '',
        badge: user.badge,
        avatar: user.avatar,
        loginTime: new Date().toISOString(),
        expiresAt: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (8 * 60 * 60 * 1000)
      };

      if (rememberMe) {
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
      }

      if (window.AOK_DB) {
        window.AOK_DB.logAction('User ' + user.name + ' (' + user.role + ') logged into Admin Dashboard.', 'AUTH_LOGIN', user.name);
      }

      return { success: true, user: sessionData };
    }

    return { success: false, message: 'Invalid username/email or password. Please try again.' };
  }

  logout() {
    const user = this.getCurrentUser();
    if (user && window.AOK_DB) {
      window.AOK_DB.logAction('User ' + user.name + ' logged out of Admin Panel.', 'AUTH_LOGOUT', user.name);
    }
    localStorage.removeItem(this.sessionKey);
    sessionStorage.removeItem(this.sessionKey);
    window.location.href = this.getLoginUrl();
  }

  getCurrentUser() {
    try {
      const sessionStr = localStorage.getItem(this.sessionKey) || sessionStorage.getItem(this.sessionKey);
      if (!sessionStr) return null;

      const session = JSON.parse(sessionStr);
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  }

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }

  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = this.getLoginUrl();
      return false;
    }
    return true;
  }

  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      window.location.href = this.getDashboardUrl();
      return true;
    }
    return false;
  }

  changePassword(currentPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'No active session.' };

    const acc = this.accounts.find(a => a.id === user.userId);
    if (!acc) return { success: false, message: 'Account not found.' };

    if (acc.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    acc.password = newPassword;
    this.saveAccounts(this.accounts);
    if (window.AOK_DB) {
      window.AOK_DB.logAction('Password changed for user ' + user.username, 'SECURITY');
    }
    return { success: true };
  }
}

// Global Auth Singleton
window.SchoolAuth = new AuthManager();
