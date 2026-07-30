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
