document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentSubject = urlParams.get('subject') || 'mathematik';
    
    const homeLink = document.querySelector('.nav-item[href="#"]');
    if (homeLink) {
        homeLink.href = `homepage.html?subject=${currentSubject}`;
    }

    const topicsLink = document.getElementById('topics-link');
    if (topicsLink) {
        topicsLink.href = `topics.html?subject=${currentSubject}`;
    }
    
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
});