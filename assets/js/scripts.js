function toggleDarkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");

  var icon = document.getElementById("dark-mode-icon");
  if (element.classList.contains("dark-mode")) {
    icon.textContent = "brightness_3"; // Moon icon
  } else {
    icon.textContent = "wb_sunny"; // Sun icon
  }
}