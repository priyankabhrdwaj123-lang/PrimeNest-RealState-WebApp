// =====================================================
// PRIMENEST - AUTHENTICATION
// Frontend prototype only
// Backend authentication will be added later.
// =====================================================

const USERS_KEY = "primeNestUsers";
const CURRENT_USER_KEY = "primeNestCurrentUser";


// =====================================================
// GET USERS
// =====================================================

function getUsers() {
    try {
        return JSON.parse(
            localStorage.getItem(USERS_KEY)
        ) || [];
    } catch (error) {
        console.error("Unable to read users:", error);
        return [];
    }
}


// =====================================================
// SAVE USERS
// =====================================================

function saveUsers(users) {
    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}


// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(CURRENT_USER_KEY)
        );

    } catch (error) {

        console.error(
            "Unable to read current user:",
            error
        );

        return null;
    }
}


// =====================================================
// REGISTER
// =====================================================

function registerUser(
    name,
    email,
    password,
    role
) {

    const users = getUsers();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const allowedRoles = [
        "customer",
        "owner",
        "dealer"
    ];

    // Name validation
    if (cleanName.length < 2) {

        return {
            success: false,
            message: "Please enter your full name."
        };

    }

    // Email validation
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {

        return {
            success: false,
            message: "Please enter a valid email address."
        };

    }

    // Password validation
    if (password.length < 6) {

        return {
            success: false,
            message:
                "Password must contain at least 6 characters."
        };

    }

    // Role validation
    if (!allowedRoles.includes(role)) {

        return {
            success: false,
            message: "Please select a valid role."
        };

    }

    // Check existing user
    const existingUser = users.find(
        user =>
            user.email.toLowerCase() === cleanEmail
    );

    if (existingUser) {

        return {
            success: false,
            message:
                "An account with this email already exists."
        };

    }

    // Create user
    const newUser = {

        id: Date.now(),

        name: cleanName,

        email: cleanEmail,

        // TEMPORARY FRONTEND DEMO ONLY.
        // Real password hashing will happen in backend.
        password: password,

        role: role,

        createdAt:
            new Date().toISOString()

    };

    users.push(newUser);

    saveUsers(users);

    return {

        success: true,

        message:
            "Account created successfully.",

        user: newUser

    };
}


// =====================================================
// LOGIN
// =====================================================

function loginUser(email, password) {

    const users = getUsers();

    const cleanEmail =
        email.trim().toLowerCase();

    const user = users.find(
        user =>
            user.email.toLowerCase() ===
                cleanEmail &&
            user.password === password
    );

    if (!user) {

        return {

            success: false,

            message:
                "Invalid email or password."

        };

    }

    // Never keep password in current session
    const sessionUser = {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

        createdAt: user.createdAt

    };

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(sessionUser)
    );

    return {

        success: true,

        message: "Login successful.",

        user: sessionUser

    };
}


// =====================================================
// ROLE REDIRECT
// =====================================================

function redirectByRole(role) {

    const dashboardMap = {

        customer:
            "customer-dashboard.html",

        owner:
            "owner-dashboard.html",

        dealer:
            "dealer-dashboard.html"

    };

    const destination =
        dashboardMap[role];

    if (!destination) {

        console.error(
            "Unknown user role:",
            role
        );

        window.location.href =
            "login.html";

        return;
    }

    window.location.href =
        destination;
}


// =====================================================
// REDIRECT IF ALREADY LOGGED IN
// =====================================================

function redirectIfLoggedIn() {

    const user =
        getCurrentUser();

    if (!user) {
        return;
    }

    redirectByRole(user.role);
}


// =====================================================
// LOGOUT
// =====================================================

function logoutUser() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    window.location.href =
        "login.html";
}


// =====================================================
// REQUIRE LOGIN
// =====================================================

function requireLogin() {

    const user =
        getCurrentUser();

    if (!user) {

        window.location.href =
            "login.html";

        return null;
    }

    return user;
}


// =====================================================
// REQUIRE ROLE
// =====================================================

function requireRole(requiredRole) {

    const user =
        requireLogin();

    if (!user) {
        return null;
    }

    if (user.role !== requiredRole) {

        redirectByRole(user.role);

        return null;
    }

    return user;
}


// =====================================================
// AUTH MESSAGE
// =====================================================

function showAuthMessage(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.className =
        "auth-message show " + type;
}


// =====================================================
// REGISTER FORM
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const registerForm =
            document.getElementById(
                "registerForm"
            );

        if (!registerForm) {
            return;
        }

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const name =
                    document
                        .getElementById("name")
                        .value;

                const email =
                    document
                        .getElementById("email")
                        .value;

                const password =
                    document
                        .getElementById("password")
                        .value;

                const confirmPassword =
                    document
                        .getElementById(
                            "confirmPassword"
                        )
                        .value;

                const role =
                    document
                        .getElementById("role")
                        .value;

                const terms =
                    document
                        .getElementById("terms")
                        .checked;

                const messageElement =
                    document.getElementById(
                        "registerMessage"
                    );


                // Confirm password
                if (
                    password !==
                    confirmPassword
                ) {

                    showAuthMessage(
                        messageElement,
                        "Passwords do not match.",
                        "error"
                    );

                    return;
                }


                // Terms
                if (!terms) {

                    showAuthMessage(
                        messageElement,
                        "Please accept the terms and privacy policy.",
                        "error"
                    );

                    return;
                }


                const result =
                    registerUser(
                        name,
                        email,
                        password,
                        role
                    );


                if (!result.success) {

                    showAuthMessage(
                        messageElement,
                        result.message,
                        "error"
                    );

                    return;
                }


                showAuthMessage(
                    messageElement,
                    "Account created successfully. Redirecting to login...",
                    "success"
                );


                registerForm.reset();


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    900
                );

            }
        );

    }
);