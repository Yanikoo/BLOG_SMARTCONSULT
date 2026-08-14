(() => {
    const header = document.querySelector("[data-site-header]");

    if (!header) {
        return;
    }

    const burger = header.querySelector(".site-header__burger");
    const navigation = header.querySelector(".site-header__nav");

    if (!burger || !navigation) {
        return;
    }

    const setMenuState = (isOpen, returnFocus = false) => {
        header.classList.toggle("site-header--menu-open", isOpen);
        document.documentElement.classList.toggle("site-menu-open", isOpen);
        burger.setAttribute("aria-expanded", String(isOpen));
        burger.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");

        if (returnFocus) {
            burger.focus();
        }
    };

    burger.addEventListener("click", () => {
        setMenuState(burger.getAttribute("aria-expanded") !== "true");
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest(".site-header__nav-link")) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && header.classList.contains("site-header--menu-open")) {
            setMenuState(false, true);
        }
    });

    window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
        if (event.matches) {
            setMenuState(false);
        }
    });
})();

(() => {
    const shareButtons = document.querySelectorAll("[data-share-network]");
    const copyButton = document.querySelector("[data-share-link]");

    if (!shareButtons.length && !copyButton) {
        return;
    }

    const pageUrl = window.location.href;
    const pageTitle = document.title;
    const shareUrls = {
        vk: `https://vk.com/share.php?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}&utm_source=share2`,
        ok: `https://connect.ok.ru/offer?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}&utm_source=share2`
    };

    shareButtons.forEach((button) => {
        const network = button.dataset.shareNetwork;

        if (shareUrls[network]) {
            button.href = shareUrls[network];

            button.addEventListener("click", (event) => {
                if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
                    return;
                }

                event.preventDefault();

                const popupWidth = 640;
                const popupHeight = 520;
                const popupLeft = Math.max(0, window.screenX + (window.outerWidth - popupWidth) / 2);
                const popupTop = Math.max(0, window.screenY + (window.outerHeight - popupHeight) / 2);

                window.open(
                    button.href,
                    "articleShareWindow",
                    `popup=yes,width=${popupWidth},height=${popupHeight},left=${Math.round(popupLeft)},top=${Math.round(popupTop)},noopener,noreferrer`
                );
            });
        }
    });

    if (!copyButton) {
        return;
    }

    const copyPageUrl = async () => {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(pageUrl);
            return;
        }

        const field = document.createElement("textarea");
        field.value = pageUrl;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        document.execCommand("copy");
        field.remove();
    };

    copyButton.addEventListener("click", async () => {
        try {
            await copyPageUrl();
            copyButton.setAttribute("aria-label", "Ссылка скопирована");
            copyButton.title = "Ссылка скопирована";

            window.setTimeout(() => {
                copyButton.setAttribute("aria-label", "Копировать ссылку на статью");
                copyButton.title = "Копировать ссылку";
            }, 2000);
        } catch {
            copyButton.setAttribute("aria-label", "Не удалось скопировать ссылку");
        }
    });
})();
