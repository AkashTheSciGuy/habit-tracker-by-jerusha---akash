/* =========================================
   SUPABASE CONFIG
========================================= */

const SUPABASE_URL =
    "https://prixuzlbxatfhjylvefx.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_6-y8pJjTCQyLKLaMvBG0TQ_XRNbUBD4";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


function cleanAuthUrl() {

    if (
        window.location.hash.includes(
            "access_token"
        ) ||
        window.location.search.includes(
            "code="
        )
    ) {

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

    }

}


/* =========================================
   DOM ELEMENTS
========================================= */

const authScreen =
    document.getElementById("authScreen");

const appScreen =
    document.getElementById("appScreen");

const authForm =
    document.getElementById("authForm");

const authTitle =
    document.getElementById("authTitle");

const authSubtitle =
    document.getElementById("authSubtitle");

const emailInput =
    document.getElementById("emailInput");

const passwordInput =
    document.getElementById("passwordInput");

const authSubmitBtn =
    document.getElementById("authSubmitBtn");

const authToggleBtn =
    document.getElementById("authToggleBtn");

const forgotPasswordBtn =
    document.getElementById(
        "forgotPasswordBtn"
    );

const authMessage =
    document.getElementById(
        "authMessage"
    );

const logoutBtn =
    document.getElementById("logoutBtn");

const habitInput =
    document.getElementById("habitInput");

const addHabitBtn =
    document.getElementById(
        "addHabitBtn"
    );

const habitList =
    document.getElementById(
        "habitList"
    );

const verificationNotice =
    document.getElementById(
        "verificationNotice"
    );

const verificationEmail =
    document.getElementById(
        "verificationEmail"
    );

const verificationLoginBtn =
    document.getElementById(
        "verificationLoginBtn"
    );

const resendVerificationBtn =
    document.getElementById(
        "resendVerificationBtn"
    );

const habitDetails =
    document.getElementById(
        "habitDetails"
    );

const closeDetailsBtn =
    document.getElementById(
        "closeDetailsBtn"
    );

const detailsHabitName =
    document.getElementById(
        "detailsHabitName"
    );

const yearProgress =
    document.getElementById(
        "yearProgress"
    );

const monthProgress =
    document.getElementById(
        "monthProgress"
    );

const weekProgress =
    document.getElementById(
        "weekProgress"
    );

const detailsCurrentStreak =
    document.getElementById(
        "detailsCurrentStreak"
    );

const detailsBestStreak =
    document.getElementById(
        "detailsBestStreak"
    );

const completionRate =
    document.getElementById(
        "completionRate"
    );

const calendarYear =
    document.getElementById(
        "calendarYear"
    );

const calendarGrid =
    document.getElementById(
        "calendarGrid"
    );


/* =========================================
   APPLICATION STATE
========================================= */

let habits = [];

let currentUser = null;

let isSignUpMode = false;


/* =========================================
   DATE
========================================= */

function getToday() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =========================================
   STREAK
========================================= */

function calculateStreak(
    completedDates
) {

    let streak = 0;

    const currentDate =
        new Date();

    while (true) {

        const year =
            currentDate.getFullYear();

        const month =
            String(
                currentDate.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                currentDate.getDate()
            ).padStart(2, "0");

        const dateString =
            `${year}-${month}-${day}`;

        if (
            !completedDates.includes(
                dateString
            )
        ) {

            break;

        }

        streak++;

        currentDate.setDate(
            currentDate.getDate() - 1
        );

    }

    return streak;

}


/* =========================================
   HABIT DETAILS DASHBOARD
========================================= */

function formatDateLocal(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =========================================
   DAYS IN YEAR
========================================= */

function getDaysInYear(year) {

    const startOfYear =
        new Date(year, 0, 1);

    const startOfNextYear =
        new Date(year + 1, 0, 1);

    return Math.round(
        (
            startOfNextYear -
            startOfYear
        ) /
        (
            1000 *
            60 *
            60 *
            24
        )
    );

}


/* =========================================
   BEST STREAK
========================================= */

function calculateBestStreak(
    completedDates
) {

    if (
        !completedDates ||
        completedDates.length === 0
    ) {

        return 0;

    }

    const dates = [
        ...new Set(completedDates)
    ].sort();

    let best = 1;

    let current = 1;

    for (
        let i = 1;
        i < dates.length;
        i++
    ) {

        const previous =
            new Date(
                dates[i - 1] +
                "T00:00:00"
            );

        const currentDate =
            new Date(
                dates[i] +
                "T00:00:00"
            );

        const difference =
            Math.round(
                (
                    currentDate -
                    previous
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );

        if (difference === 1) {

            current++;

            best =
                Math.max(
                    best,
                    current
                );

        } else {

            current = 1;

        }

    }

    return best;

}


/* =========================================
   YEAR PROGRESS
========================================= */

function getYearProgress(
    completedDates,
    year
) {

    const prefix =
        `${year}-`;

    return completedDates.filter(
        function (date) {

            return date.startsWith(
                prefix
            );

        }
    ).length;

}


/* =========================================
   MONTH PROGRESS
========================================= */

function getMonthProgress(
    completedDates,
    year,
    month
) {

    const monthString =
        String(month + 1)
            .padStart(2, "0");

    const prefix =
        `${year}-${monthString}-`;

    return completedDates.filter(
        function (date) {

            return date.startsWith(
                prefix
            );

        }
    ).length;

}


/* =========================================
   WEEK PROGRESS
========================================= */

function getWeekProgress(
    completedDates
) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const day =
        today.getDay();

    /*
        Monday = first day of week
        Sunday = last day
    */

    const difference =
        day === 0
            ? -6
            : 1 - day;

    const monday =
        new Date(today);

    monday.setDate(
        today.getDate() +
        difference
    );

    let completed = 0;

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(monday);

        date.setDate(
            monday.getDate() + i
        );

        const dateString =
            formatDateLocal(date);

        if (
            completedDates.includes(
                dateString
            )
        ) {

            completed++;

        }

    }

    return completed;

}


/* =========================================
   OPEN DETAILS
========================================= */

function openHabitDetails(
    habit
) {

    detailsHabitName.textContent =
        habit.name;

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        today.getMonth();

    const daysThisYear =
        getDaysInYear(year);

    const daysThisMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    const completedThisYear =
        getYearProgress(
            habit.completedDates,
            year
        );

    const completedThisMonth =
        getMonthProgress(
            habit.completedDates,
            year,
            month
        );

    const completedThisWeek =
        getWeekProgress(
            habit.completedDates
        );

    const currentStreak =
        calculateStreak(
            habit.completedDates
        );

    const bestStreak =
        calculateBestStreak(
            habit.completedDates
        );

    const rate =
        daysThisYear === 0
            ? 0
            :
            (
                completedThisYear /
                daysThisYear
            ) * 100;

    yearProgress.textContent =
        `${completedThisYear} / ${daysThisYear}`;

    monthProgress.textContent =
        `${completedThisMonth} / ${daysThisMonth}`;

    weekProgress.textContent =
        `${completedThisWeek} / 7`;

    detailsCurrentStreak.textContent =
        `${currentStreak} ${
            currentStreak === 1
                ? "day"
                : "days"
        }`;

    detailsBestStreak.textContent =
        `${bestStreak} ${
            bestStreak === 1
                ? "day"
                : "days"
        }`;

    completionRate.textContent =
        `${rate.toFixed(1)}%`;

    calendarYear.textContent =
        year;

    buildCalendars(
        habit.completedDates,
        year
    );

    habitDetails.classList.remove(
        "hidden"
    );

    document.body.classList.add(
        "details-open"
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   CLOSE DETAILS
========================================= */

function closeHabitDetails() {

    habitDetails.classList.add(
        "hidden"
    );

    document.body.classList.remove(
        "details-open"
    );

}


closeDetailsBtn.addEventListener(
    "click",
    closeHabitDetails
);


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            !habitDetails.classList.contains(
                "hidden"
            )
        ) {

            closeHabitDetails();

        }

    }
);


/* =========================================
   BUILD CALENDARS
========================================= */

function buildCalendars(
    completedDates,
    year
) {

    calendarGrid.innerHTML =
        "";

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    for (
        let month = 0;
        month < 12;
        month++
    ) {

        const monthCard =
            document.createElement(
                "div"
            );

        monthCard.classList.add(
            "calendar-card"
        );

        const heading =
            document.createElement(
                "h3"
            );

        heading.textContent =
            monthNames[month];

        monthCard.appendChild(
            heading
        );

        const weekdays =
            document.createElement(
                "div"
            );

        weekdays.classList.add(
            "calendar-weekdays"
        );

        const weekdayNames = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ];

        weekdayNames.forEach(
            function (name) {

                const weekday =
                    document.createElement(
                        "span"
                    );

                weekday.textContent =
                    name;

                weekdays.appendChild(
                    weekday
                );

            }
        );

        monthCard.appendChild(
            weekdays
        );

        const days =
            document.createElement(
                "div"
            );

        days.classList.add(
            "calendar-days"
        );

        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();

        const mondayOffset =
            firstDay === 0
                ? 6
                : firstDay - 1;

        for (
            let i = 0;
            i < mondayOffset;
            i++
        ) {

            const empty =
                document.createElement(
                    "span"
                );

            empty.classList.add(
                "calendar-empty"
            );

            days.appendChild(
                empty
            );

        }

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();

        const todayString =
            getToday();

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const dayElement =
                document.createElement(
                    "span"
                );

            dayElement.classList.add(
                "calendar-day"
            );

            const dateString =
                `${year}-${String(
                    month + 1
                ).padStart(2, "0")}-${String(
                    day
                ).padStart(2, "0")}`;

            dayElement.textContent =
                day;

            if (
                completedDates.includes(
                    dateString
                )
            ) {

                dayElement.classList.add(
                    "completed-day"
                );

            } else if (
                dateString >
                todayString
            ) {

                dayElement.classList.add(
                    "future-day"
                );

            } else {

                dayElement.classList.add(
                    "incomplete-day"
                );

            }

            if (
                dateString ===
                todayString
            ) {

                dayElement.classList.add(
                    "today-day"
                );

            }

            days.appendChild(
                dayElement
            );

        }

        monthCard.appendChild(
            days
        );

        calendarGrid.appendChild(
            monthCard
        );

    }

}


/* =========================================
   AUTH MESSAGE
========================================= */

function showAuthMessage(
    message,
    type = ""
) {

    authMessage.textContent =
        message;

    authMessage.className =
        `auth-message ${type}`;

}


function showVerificationNotice(email) {

    verificationEmail.textContent =
        email;

    verificationNotice.classList.remove(
        "hidden"
    );

    authForm.classList.add(
        "hidden"
    );

    forgotPasswordBtn.classList.add(
        "hidden"
    );

    authToggleBtn.classList.add(
        "hidden"
    );

}


function hideVerificationNotice() {

    verificationNotice.classList.add(
        "hidden"
    );

    authForm.classList.remove(
        "hidden"
    );

    forgotPasswordBtn.classList.remove(
        "hidden"
    );

    authToggleBtn.classList.remove(
        "hidden"
    );

}


/* =========================================
   AUTH MODE
========================================= */

function setAuthMode(signUp) {

    isSignUpMode =
        signUp;

    authMessage.textContent =
        "";

    if (isSignUpMode) {

        authTitle.textContent =
            "Create Account";

        authSubtitle.textContent =
            "Create an account to securely save your habits.";

        authSubmitBtn.textContent =
            "Sign Up";

        authToggleBtn.textContent =
            "Already have an account? Log In";

        forgotPasswordBtn.style.display =
            "none";

        passwordInput.autocomplete =
            "new-password";

    } else {

        authTitle.textContent =
            "Welcome Back";

        authSubtitle.textContent =
            "Sign in to continue tracking your habits.";

        authSubmitBtn.textContent =
            "Log In";

        authToggleBtn.textContent =
            "Don't have an account? Sign Up";

        forgotPasswordBtn.style.display =
            "block";

        passwordInput.autocomplete =
            "current-password";

    }

}


/* =========================================
   SIGN UP / LOGIN
========================================= */

authForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        if (
            email === "" ||
            password === ""
        ) {

            showAuthMessage(
                "Please enter your email and password.",
                "error"
            );

            return;
        }

        authSubmitBtn.disabled =
            true;

        if (isSignUpMode) {

            await signUp(
                email,
                password
            );

        } else {

            await login(
                email,
                password
            );

        }

        authSubmitBtn.disabled =
            false;

    }
);


/* =========================================
   SIGN UP
========================================= */

async function signUp(
    email,
    password
) {

    const {
        data,
        error
    } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password,

            options: {

                emailRedirectTo:
                    window.location.origin

            }

        });


    if (error) {

        showAuthMessage(
            error.message,
            "error"
        );

        return;
    }


    if (!data.session) {

        showVerificationNotice(
            email
        );

        return;
    }


    verificationLoginBtn.addEventListener(
        "click",
        function () {

            hideVerificationNotice();

            setAuthMode(false);

            emailInput.focus();

        }
    );


    resendVerificationBtn.addEventListener(
        "click",
        async function () {

            const email =
                verificationEmail.textContent.trim();

            if (email === "") {
                return;
            }

            resendVerificationBtn.disabled =
                true;

            const {
                error
            } =
                await supabaseClient.auth
                    .resend({
                        type: "signup",
                        email: email
                    });

            if (error) {

                console.error(
                    "Could not resend verification email:",
                    error
                );

                alert(
                    "Could not resend the verification email. Please try again."
                );

            } else {

                alert(
                    "A new verification email has been sent."
                );

            }

            resendVerificationBtn.disabled =
                false;

        }
    );


    currentUser =
        data.user;

    showApp();

}


/* =========================================
   LOGIN
========================================= */

async function login(
    email,
    password
) {

    const {
        data,
        error
    } =
        await supabaseClient.auth
            .signInWithPassword({

                email: email,

                password: password

            });


    if (error) {

        showAuthMessage(
            "Unable to log in. Please check your email and password.",
            "error"
        );

        return;
    }

    currentUser =
        data.user;

    showApp();

}


/* =========================================
   FORGOT PASSWORD
========================================= */

forgotPasswordBtn.addEventListener(
    "click",
    async function () {

        const email =
            emailInput.value.trim();

        if (email === "") {

            showAuthMessage(
                "Enter your email address first.",
                "error"
            );

            return;
        }

        const {
            error
        } =
            await supabaseClient.auth
                .resetPasswordForEmail(
                    email,
                    {
                        redirectTo:
                            window.location.origin
                    }
                );

        if (error) {

            showAuthMessage(
                error.message,
                "error"
            );

            return;
        }

        showAuthMessage(
            "If an account exists for that email, a password reset link has been sent.",
            "success"
        );

    }
);


/* =========================================
   LOGOUT
========================================= */

logoutBtn.addEventListener(
    "click",
    async function () {

        const {
            error
        } =
            await supabaseClient.auth
                .signOut();

        if (error) {

            console.error(
                "Logout error:",
                error
            );

            return;
        }

        currentUser =
            null;

        habits = [];

        habitList.innerHTML =
            "";

        showAuth();

    }
);


/* =========================================
   SHOW APP
========================================= */

async function showApp() {

    authScreen.classList.add(
        "hidden"
    );

    appScreen.classList.remove(
        "hidden"
    );

    await loadHabits();

}


/* =========================================
   SHOW AUTH
========================================= */

function showAuth() {

    appScreen.classList.add(
        "hidden"
    );

    authScreen.classList.remove(
        "hidden"
    );

    emailInput.value =
        "";

    passwordInput.value =
        "";

    setAuthMode(false);

}


/* =========================================
   SWITCH LOGIN / SIGN UP
========================================= */

authToggleBtn.addEventListener(
    "click",
    function () {

        setAuthMode(
            !isSignUpMode
        );

    }
);


/* =========================================
   LOAD HABITS
========================================= */

async function loadHabits() {

    if (!currentUser) {
        return;
    }

    const {
        data,
        error
    } =
        await supabaseClient
            .from("habits")
            .select("*")
            .order(
                "position",
                {
                    ascending: true,
                    nullsFirst: false
                }
            );

    if (error) {

        console.error(
            "Could not load habits:",
            error
        );

        alert(
            "Could not load your habits."
        );

        return;
    }

    habits =
        data.map(
            function (habit) {

                return {

                    id:
                        habit.id,

                    name:
                        habit.name,

                    completedDates:
                        habit.completed_dates || [],

                    position:
                        habit.position ?? 0

                };

            }
        );

    habitList.innerHTML =
        "";

    habits.forEach(
        function (habit) {

            createHabitCard(
                habit
            );

        }
    );

    await migrateLocalStorageHabits();

}


/* =========================================
   OLD LOCALSTORAGE MIGRATION
========================================= */

async function migrateLocalStorageHabits() {

    const oldHabits =
        JSON.parse(
            localStorage.getItem(
                "habits"
            )
        );

    if (
        !Array.isArray(oldHabits) ||
        oldHabits.length === 0
    ) {

        return;

    }

    const habitsToInsert =
        oldHabits.filter(
            function (oldHabit) {

                return !habits.some(
                    function (habit) {

                        return (
                            habit.name
                                .toLowerCase()
                            ===
                            oldHabit.name
                                .toLowerCase()
                        );

                    }
                );

            }
        );

    if (
        habitsToInsert.length === 0
    ) {

        localStorage.removeItem(
            "habits"
        );

        return;
    }

    const rows =
        habitsToInsert.map(
            function (habit, index) {

                return {

                    user_id:
                        currentUser.id,

                    name:
                        habit.name,

                    completed_dates:
                        habit.completedDates || [],

                    position:
                        habits.length + index

                };

            }
        );

    const {
        data,
        error
    } =
        await supabaseClient
            .from("habits")
            .insert(rows)
            .select();

    if (error) {

        console.error(
            "Could not migrate habits:",
            error
        );

        return;
    }

    data.forEach(
        function (habit) {

            const newHabit = {

                id:
                    habit.id,

                name:
                    habit.name,

                completedDates:
                    habit.completed_dates || [],

                position:
                    habit.position ?? 0

            };

            habits.push(
                newHabit
            );

            createHabitCard(
                newHabit
            );

        }
    );

    localStorage.removeItem(
        "habits"
    );

}


/* =========================================
   CREATE HABIT CARD
========================================= */

function createHabitCard(habit) {

    const habitCard =
        document.createElement(
            "div"
        );

    habitCard.classList.add(
        "habit-card"
    );


    /* =====================================
       FIXED DRAG REORDERING
    ===================================== */

    habitCard.draggable =
        true;


    habitCard.dataset.habitId =
        habit.id;


    const title =
        document.createElement(
            "h2"
        );

    title.textContent =
        habit.name;


    const completeButton =
        document.createElement(
            "button"
        );

    completeButton.classList.add(
        "complete-button"
    );

    completeButton.innerHTML = `

        <span class="button-day">
            TODAY
        </span>

        <span class="button-count">
            ${habit.completedDates.length}
        </span>

        <span class="button-text">
            TAP TO COMPLETE
        </span>

    `;


    const streakText =
        document.createElement(
            "p"
        );

    streakText.classList.add(
        "streak-text"
    );


    function updateStreak() {

        const streak =
            calculateStreak(
                habit.completedDates
            );

        streakText.textContent =
            `Current streak: ${streak} ${
                streak === 1
                    ? "day"
                    : "days"
            }`;

    }


    updateStreak();


    const today =
        getToday();


    if (
        habit.completedDates.includes(
            today
        )
    ) {

        completeButton.classList.add(
            "completed"
        );

        completeButton
            .querySelector(
                ".button-text"
            )
            .textContent =
            "COMPLETED ✓";

    }


    /* =================================
       COMPLETE HABIT
    ================================= */

    completeButton.addEventListener(
        "click",
        async function () {

            const today =
                getToday();

            if (
                habit.completedDates.includes(
                    today
                )
            ) {

                return;

            }

            habit.completedDates.push(
                today
            );

            const countElement =
                completeButton
                    .querySelector(
                        ".button-count"
                    );

            countElement.textContent =
                habit.completedDates.length;

            completeButton.classList.add(
                "completed"
            );

            completeButton
                .querySelector(
                    ".button-text"
                )
                .textContent =
                "COMPLETED ✓";

            updateStreak();

            const {
                error
            } =
                await supabaseClient
                    .from("habits")
                    .update({

                        completed_dates:
                            habit.completedDates

                    })
                    .eq(
                        "id",
                        habit.id
                    );

            if (error) {

                console.error(
                    "Could not save completion:",
                    error
                );

                habit.completedDates =
                    habit.completedDates
                        .filter(
                            function (date) {

                                return (
                                    date !== today
                                );

                            }
                        );

                countElement.textContent =
                    habit.completedDates.length;

                completeButton.classList.remove(
                    "completed"
                );

                completeButton
                    .querySelector(
                        ".button-text"
                    )
                    .textContent =
                    "TAP TO COMPLETE";

                updateStreak();

                alert(
                    "Could not save your completion."
                );

            }

        }
    );


    /* =================================
       DETAILS
    ================================= */

    const detailsButton =
        document.createElement(
            "button"
        );

    detailsButton.classList.add(
        "details-button"
    );

    detailsButton.textContent =
        "Details";

    detailsButton.addEventListener(
        "click",
        function () {

            openHabitDetails(
                habit
            );

        }
    );


    /* =================================
       DELETE
    ================================= */

    const deleteButton =
        document.createElement(
            "button"
        );

    deleteButton.classList.add(
        "delete-button"
    );

    deleteButton.textContent =
        "Delete";

    deleteButton.addEventListener(
        "click",
        async function () {

            const confirmed =
                confirm(
                    `Delete "${habit.name}"?`
                );

            if (!confirmed) {
                return;
            }

            const {
                error
            } =
                await supabaseClient
                    .from("habits")
                    .delete()
                    .eq(
                        "id",
                        habit.id
                    );

            if (error) {

                console.error(
                    "Could not delete habit:",
                    error
                );

                alert(
                    "Could not delete this habit."
                );

                return;
            }

            habits =
                habits.filter(
                    function (item) {

                        return (
                            item.id !==
                            habit.id
                        );

                    }
                );

            habitCard.remove();

        }
    );


    /* =================================
       BUILD CARD
    ================================= */

    habitCard.appendChild(
        title
    );

    habitCard.appendChild(
        completeButton
    );

    habitCard.appendChild(
        streakText
    );

    habitCard.appendChild(
        detailsButton
    );

    habitCard.appendChild(
        deleteButton
    );

    habitList.appendChild(
        habitCard
    );

}


/* =========================================
   FIXED DRAG & DROP REORDERING
========================================= */

let draggedCard = null;


/* =========================================
   DRAG START
========================================= */

habitList.addEventListener(
    "dragstart",
    function (event) {

        const card =
            event.target.closest(
                ".habit-card"
            );

        if (!card) {
            return;
        }

        draggedCard =
            card;

        card.classList.add(
            "dragging"
        );

        event.dataTransfer.effectAllowed =
            "move";

        event.dataTransfer.setData(
            "text/plain",
            card.dataset.habitId
        );

    }
);


/* =========================================
   DRAG OVER
========================================= */

habitList.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        if (!draggedCard) {
            return;
        }

        const cards = [
            ...habitList.querySelectorAll(
                ".habit-card:not(.dragging)"
            )
        ];

        if (cards.length === 0) {
            return;
        }

        const mouseY =
            event.clientY;

        let closestCard =
            null;

        let closestDistance =
            Infinity;


        cards.forEach(
            function (card) {

                const rect =
                    card.getBoundingClientRect();

                const distance =
                    Math.abs(
                        mouseY -
                        (
                            rect.top +
                            rect.height / 2
                        )
                    );

                if (
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;

                    closestCard =
                        card;

                }

            }
        );


        if (!closestCard) {
            return;
        }


        const rect =
            closestCard.getBoundingClientRect();


        if (
            mouseY <
            rect.top +
            rect.height / 2
        ) {

            if (
                draggedCard !==
                closestCard.previousElementSibling
            ) {

                habitList.insertBefore(
                    draggedCard,
                    closestCard
                );

            }

        } else {

            if (
                draggedCard !==
                closestCard.nextElementSibling
            ) {

                habitList.insertBefore(
                    draggedCard,
                    closestCard.nextSibling
                );

            }

        }

    }
);


/* =========================================
   DRAG END
========================================= */

habitList.addEventListener(
    "dragend",
    async function () {

        if (!draggedCard) {
            return;
        }

        draggedCard.classList.remove(
            "dragging"
        );

        draggedCard =
            null;

        await saveHabitOrder();

    }
);


/* =========================================
   SAVE HABIT ORDER
========================================= */

async function saveHabitOrder() {

    const cards = [
        ...habitList.querySelectorAll(
            ".habit-card"
        )
    ];


    /*
        Update local array so the
        JavaScript state matches
        the visual card order.
    */

    const reorderedHabits =
        [];


    cards.forEach(
        function (card) {

            const habit =
                habits.find(
                    function (item) {

                        return (
                            String(item.id) ===
                            String(
                                card.dataset.habitId
                            )
                        );

                    }
                );


            if (habit) {

                reorderedHabits.push(
                    habit
                );

            }

        }
    );


    habits =
        reorderedHabits;


    /*
        Save every card's new
        position to Supabase.
    */

    for (
        let i = 0;
        i < habits.length;
        i++
    ) {

        habits[i].position =
            i;


        const {
            error
        } =
            await supabaseClient
                .from("habits")
                .update({
                    position: i
                })
                .eq(
                    "id",
                    habits[i].id
                );


        if (error) {

            console.error(
                "Could not save habit order:",
                error
            );

        }

    }

}


/* =========================================
   ADD HABIT
========================================= */

addHabitBtn.addEventListener(
    "click",
    async function () {

        const habitName =
            habitInput.value.trim();

        if (habitName === "") {
            return;
        }


        const duplicateHabit =
            habits.some(
                function (habit) {

                    return (
                        habit.name
                            .toLowerCase()
                        ===
                        habitName
                            .toLowerCase()
                    );

                }
            );


        if (duplicateHabit) {

            alert(
                "This habit already exists."
            );

            return;
        }


        addHabitBtn.disabled =
            true;


        const {
            data,
            error
        } =
            await supabaseClient
                .from("habits")
                .insert({

                    user_id:
                        currentUser.id,

                    name:
                        habitName,

                    completed_dates: [],

                    position:
                        habits.length

                })
                .select()
                .single();


        if (error) {

            addHabitBtn.disabled =
                false;

            if (
                error.code ===
                "23505"
            ) {

                alert(
                    "This habit already exists."
                );

            } else {

                console.error(
                    "Could not create habit:",
                    error
                );

                alert(
                    "Could not create the habit. Please try again."
                );

            }

            return;
        }


        const newHabit = {

            id:
                data.id,

            name:
                data.name,

            completedDates:
                data.completed_dates || [],

            position:
                data.position ??
                habits.length

        };


        habits.push(
            newHabit
        );


        createHabitCard(
            newHabit
        );


        habitInput.value =
            "";


        addHabitBtn.disabled =
            false;

    }
);


/* =========================================
   ENTER = ADD
========================================= */

habitInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            addHabitBtn.click();

        }

    }
);


/* =========================================
   CHECK SESSION
========================================= */

async function initializeApp() {

    const {
        data,
        error
    } =
        await supabaseClient.auth
            .getSession();


    if (error) {

        console.error(
            "Session error:",
            error
        );

        showAuth();

        return;

    }


    cleanAuthUrl();


    if (data.session) {

        currentUser =
            data.session.user;

        await showApp();

    } else {

        showAuth();

    }

}


/* =========================================
   AUTH STATE
========================================= */

supabaseClient.auth.onAuthStateChange(
    async function (
        event,
        session
    ) {

        if (
            event ===
            "INITIAL_SESSION" ||
            event ===
            "SIGNED_IN" ||
            event ===
            "TOKEN_REFRESHED"
        ) {

            if (session) {

                currentUser =
                    session.user;

                await showApp();

            }

            return;

        }


        if (
            event ===
            "SIGNED_OUT"
        ) {

            currentUser =
                null;

            habits = [];

            habitList.innerHTML =
                "";

            showAuth();

        }

    }
);


/* =========================================
   START
========================================= */

initializeApp();


/* =========================================
   LIGHT / DARK THEME
========================================= */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

const themeIcon =
    document.getElementById(
        "themeIcon"
    );

const themeText =
    document.getElementById(
        "themeText"
    );


function updateThemeButton() {

    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    if (isDark) {

        themeIcon.textContent =
            "☀";

        themeText.textContent =
            "Light";

    } else {

        themeIcon.textContent =
            "☾";

        themeText.textContent =
            "Dark";

    }

}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );

        const isDark =
            document.body.classList.contains(
                "dark-mode"
            );

        localStorage.setItem(
            "theme",
            isDark
                ? "dark"
                : "light"
        );

        updateThemeButton();

    }
);


/* =========================================
   LOAD SAVED THEME
========================================= */

const savedTheme =
    localStorage.getItem(
        "theme"
    );


if (
    savedTheme === "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );

}


updateThemeButton();