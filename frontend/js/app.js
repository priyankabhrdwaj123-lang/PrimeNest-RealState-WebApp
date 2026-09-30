// =====================================================
// PRIMENEST - MAIN JAVASCRIPT
// =====================================================


// -------------------------------
// HELPER
// -------------------------------

function $(selector) {
    return document.querySelector(selector);
}


// -------------------------------
// FAVORITES
// -------------------------------

function getFavorites() {
    return JSON.parse(localStorage.getItem("primeNestFavorites")) || [];
}

function setFavorites(favorites) {
    localStorage.setItem(
        "primeNestFavorites",
        JSON.stringify(favorites)
    );
}

function isFavorite(id) {
    const favorites = getFavorites();

    return favorites.includes(Number(id));
}

function toggleFavorite(id) {

    id = Number(id);

    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
        showToast("Removed from favorites");
    } else {
        favorites.push(id);
        showToast("Added to favorites");
    }

    setFavorites(favorites);

    return favorites;
}


// -------------------------------
// COMPARE
// -------------------------------

function getCompare() {
    return JSON.parse(localStorage.getItem("primeNestCompare")) || [];
}

function setCompare(compare) {
    localStorage.setItem(
        "primeNestCompare",
        JSON.stringify(compare)
    );
}

function addCompare(id) {

    id = Number(id);

    let compare = getCompare();

    if (compare.includes(id)) {
        showToast("Already added to compare");
        return;
    }

    if (compare.length >= 3) {
        showToast("You can compare maximum 3 properties");
        return;
    }

    compare.push(id);

    setCompare(compare);

    showToast("Property added to compare");
}


// -------------------------------
// TOAST
// -------------------------------

function showToast(message) {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


// -------------------------------
// PROPERTY CARD
// -------------------------------

// function propertyCard(property) {

//     const favorite = isFavorite(property.id);

//     return `
//         <article class="property-card">

//             <div class="property-image">

//                 <img
//                     src="${property.image}"
//                     alt="${property.title}"
//                 >

//                 <span class="property-tag">
//                     ${property.status}
//                 </span>

//                 <button
//                     class="favorite-btn property-favorite"
//                     data-id="${property.id}"
//                     aria-label="Add to favorites"
//                 >
//                     ${favorite ? "♥" : "♡"}
//                 </button>

//             </div>


//             <div class="property-info">

//                 <p class="property-type">
//                     ${property.type}
//                 </p>

//                 <h3>
//                     ${property.title}
//                 </h3>

//                 <p class="property-location">
//                     📍 ${property.location}
//                 </p>


//                 <div class="property-details">

//                     <span>
//                         🛏 ${property.bedrooms} Beds
//                     </span>

//                     <span>
//                         🛁 ${property.bathrooms} Baths
//                     </span>

//                     <span>
//                         📐 ${property.area} sq.ft
//                     </span>

//                 </div>


//                 <div class="property-bottom">

//                     <strong>
//                         ${property.priceText}
//                     </strong>

//                     <div>

//                         <a
//                             href="property.html?id=${property.id}"
//                         >
//                             View →
//                         </a>

//                         <button
//                             class="compare-btn"
//                             data-id="${property.id}"
//                             type="button"
//                         >
//                             Compare
//                         </button>

//                     </div>

//                 </div>

//             </div>

//         </article>
//     `;
// }

function propertyCard(property) {

    const favorite =
        isFavorite(property.id);

    return `
        <article
            class="property-card"
            data-property-id="${property.id}"
        >

            <div class="property-image">

                <img
                    src="${property.image}"
                    alt="${property.title}"
                    loading="lazy"
                    width="800"
                    height="550"
                >

                <span class="property-tag">
                    ${property.status}
                </span>

                <button
                    class="favorite-btn property-favorite"
                    data-id="${property.id}"
                    type="button"
                    aria-label="${favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }"
                    aria-pressed="${favorite}"
                >
                    ${favorite ? "♥" : "♡"}
                </button>

            </div>


            <div class="property-info">

                <p class="property-type">
                    ${property.type}
                </p>

                <h3>
                    ${property.title}
                </h3>

                <p class="property-location">
                    📍 ${property.location}
                </p>


                <div class="property-details">

                    <span>
                        🛏 ${property.bedrooms} Beds
                    </span>

                    <span>
                        🛁 ${property.bathrooms} Baths
                    </span>

                    <span>
                        📐 ${property.area} sq.ft
                    </span>

                </div>


                <div class="property-bottom">

                    <strong>
                        ${property.priceText}
                    </strong>

                    <div>

                        <a
                            href="property.html?id=${property.id}"
                            class="property-view-link"
                        >
                            View →
                        </a>

                        <button
                            class="compare-btn"
                            data-id="${property.id}"
                            type="button"
                        >
                            Compare
                        </button>

                    </div>

                </div>

            </div>

        </article>
    `;
}

// -------------------------------
// DYNAMIC BUTTONS
// -------------------------------

function bindDynamicButtons() {

    // document.querySelectorAll(".property-favorite")
    //     .forEach(button => {

    //         button.addEventListener("click", function () {

    //             const id = Number(this.dataset.id);

    //             const favorites = toggleFavorite(id);

    //             this.textContent =
    //                 favorites.includes(id)
    //                     ? "♥"
    //                     : "♡";

    //         });

    //     });

    document
        .querySelectorAll(".property-favorite")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(this.dataset.id);

                    const favorites =
                        toggleFavorite(id);

                    const active =
                        favorites.includes(id);

                    this.textContent =
                        active ? "♥" : "♡";

                    this.setAttribute(
                        "aria-pressed",
                        active
                    );

                    this.setAttribute(
                        "aria-label",
                        active
                            ? "Remove from favorites"
                            : "Add to favorites"
                    );

                }
            );

        });


    document.querySelectorAll(".compare-btn")
        .forEach(button => {

            button.addEventListener("click", function () {

                const id = Number(this.dataset.id);

                addCompare(id);

            });

        });

}


// -------------------------------
// DISPLAY PROPERTIES
// -------------------------------

function displayProperties(list, containerId = "propertyGrid") {

    const container = document.getElementById(containerId);

    if (!container) return;

    if (!list.length) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🏠
                </div>

                <h3>
                    No Properties Found
                </h3>

                <p>
                    Try changing your search or filters.
                </p>

            </div>
        `;

        return;
    }

    container.innerHTML =
        list.map(property => propertyCard(property)).join("");

    bindDynamicButtons();
}


// -------------------------------
// DARK MODE / THEME
// -------------------------------

function initTheme() {

    const savedTheme =
        localStorage.getItem("primeNestTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    const themeButton =
        document.querySelector("#themeToggle");

    if (!themeButton) return;

    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const isDark =
            document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "primeNestTheme",
            isDark ? "dark" : "light"
        );

    });
}


// -------------------------------
// MOBILE MENU
// -------------------------------

function initMobileMenu() {

    const menuButton =
        document.querySelector(".menu-toggle");

    const nav =
        document.querySelector(".nav-links");

    if (!menuButton || !nav) return;

    menuButton.addEventListener("click", () => {

        nav.classList.toggle("active");

    });
}


// -------------------------------
// INIT
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {

    initTheme();

    initMobileMenu();

});