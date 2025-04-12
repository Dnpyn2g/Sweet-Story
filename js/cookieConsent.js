document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("cookieConsent")) {
      document.getElementById("cookieConsent").style.display = "block";
    }
    document.getElementById("acceptCookies").addEventListener("click", function() {
      localStorage.setItem("cookieConsent", "true");
      document.getElementById("cookieConsent").style.display = "none";
    });
  });
  