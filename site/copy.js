// @ts-check
// SPDX-License-Identifier: AGPL-3.0-or-later
(() => {
  const status = document.querySelector("[data-copy-status]");
  if (!(status instanceof HTMLElement)) return;
  for (const button of document.querySelectorAll("[data-copy-hex]")) {
    if (!(button instanceof HTMLButtonElement)) continue;
    const value = button.dataset["copyHex"];
    if (value === undefined || !/^#[0-9A-F]{6}$/.test(value)) continue;
    button.addEventListener("click", () => {
      const success =
        document.documentElement.lang === "vi"
          ? `Đã sao chép ${value}.`
          : `Copied ${value}.`;
      const failure =
        document.documentElement.lang === "vi"
          ? "Không thể sao chép. Hãy chọn mã Hex rồi sao chép thủ công."
          : "Copy is unavailable. Select the Hex value and copy it manually.";
      const clipboard = /** @type {Clipboard | undefined} */ (
        Reflect.get(navigator, "clipboard")
      );
      if (typeof clipboard?.writeText !== "function") {
        status.textContent = failure;
        return;
      }
      clipboard.writeText(value).then(
        () => {
          status.textContent = success;
        },
        () => {
          status.textContent = failure;
        },
      );
    });
    button.disabled = false;
  }
})();
