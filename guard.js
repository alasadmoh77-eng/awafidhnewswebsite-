/**
 * Nawafidh Route Guard
 * Simple protection for Admin pages.
 */

const guard = {
    /**
     * Checks if user is logged in and has appropriate role
     * @param {Array} allowedRoles 
     */
    protect: (allowedRoles = []) => {
        const user = NawafidhAPI.auth.getCurrentUser();

        if (!user) {
            window.location.href = 'login.html';
            return false;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            alert('عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة.');
            window.location.href = '../index.html';
            return false;
        }

        return user;
    }
};

window.NawafidhGuard = guard;
