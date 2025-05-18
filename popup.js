document.getElementById("start").addEventListener("click", () => {
  const links = document.getElementById("links").value.split(",");
  chrome.runtime.sendMessage({ action: "openLinks", links: links.map(link => link.trim()) });
});
