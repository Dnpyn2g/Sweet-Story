document.addEventListener('DOMContentLoaded', () => {
    const scrollButton = document.getElementById('scroll-to-top');
    if (!scrollButton) return;
    const toggleScrollButton = () => {
      scrollButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    };
    window.addEventListener('scroll', toggleScrollButton);
    scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
  