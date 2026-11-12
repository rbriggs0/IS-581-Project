/**
 * Lightweight frontend error surface for FindYourSound.
 * No third-party SDK, no PII — only a user-visible banner and console.error.
 */

const BANNER_ID = "fys-error-banner";

const USER_MESSAGE =
  "Something went wrong loading this page. Try refreshing, or go back and take the quiz again.";

let installed = false;

function ensureBanner() {
  let banner = document.getElementById(BANNER_ID);
  if (banner) return banner;

  banner = document.createElement("div");
  banner.id = BANNER_ID;
  banner.className = "error-banner";
  banner.setAttribute("role", "alert");

  const text = document.createElement("p");
  text.className = "error-banner-text";
  text.textContent = USER_MESSAGE;
  banner.appendChild(text);

  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "error-banner-dismiss";
  dismiss.textContent = "Dismiss";
  dismiss.addEventListener("click", () => {
    banner.remove();
  });
  banner.appendChild(dismiss);

  document.body.prepend(banner);
  return banner;
}

function showErrorBanner() {
  ensureBanner();
}

/**
 * Install window error / unhandledrejection handlers once.
 */
export function installErrorReporting() {
  if (typeof window === "undefined" || installed) return;
  installed = true;

  window.addEventListener("error", (event) => {
    console.error(event.error || event.message);
    showErrorBanner();
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error(event.reason);
    showErrorBanner();
  });
}
