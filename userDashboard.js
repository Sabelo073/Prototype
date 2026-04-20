 // Bar chart animation (only runs when performance view is visible)
    function animateBars() {
      const fills = document.querySelectorAll("#performance-view .bar-fill");
      const targetPercentages = [100, 71.25, 37.5, 21.25]; // relative to max 80
      fills.forEach((fill, idx) => {
        if (idx < targetPercentages.length) {
          setTimeout(() => {
            fill.style.height = targetPercentages[idx] + "%";
          }, 100);
        }
      });
    }

    // Sidebar view switching
    const navItems = document.querySelectorAll(".nav-item");
    const views = {
      profile: document.getElementById("profile-view"),
      performance: document.getElementById("performance-view"),
      reports: document.getElementById("reports-view"),
      settings: document.getElementById("settings-view")
    };
    let settings=document.getElementById("settings");
    settings.onclick=function (){
      window.location.href="profilesettings.html"
    }

    function activateView(viewName) {
      // Hide all views
      Object.values(views).forEach(view => {
        if (view) view.classList.remove("active-view");
      });
      // Show selected view
      if (views[viewName]) views[viewName].classList.add("active-view");
      // Update active class on sidebar items
      navItems.forEach(item => {
        const section = item.getAttribute("data-section");
        if (section === viewName) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
      // If performance is activated?
      if (viewName === "performance") {
        // Reset heights to 0 first to ensure re-animation
        const fills = document.querySelectorAll("#performance-view .bar-fill");
        fills.forEach(fill => fill.style.height = "0%");
        setTimeout(animateBars, 50);
      }
    }

    navItems.forEach((item) => {
      item.addEventListener("click", function () {
        const section = this.getAttribute("data-section");
        if (section) activateView(section);
      });
    });

    // Logout functionality
    const logoutButton = document.getElementById("logoutBtn");
    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        alert("Logout clicked — session would end here.");
      });
    }

    // Initial bar animation 
    animateBars();