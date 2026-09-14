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

/*
    Prevents the same user's habits from
    being loaded multiple times when both
    getSession() and SIGNED_IN fire.
*/
let loadedUserId = null;


/* =========================================
   DATE HELPERS
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


function getToday() {

    return formatDateLocal(
        new Date()
    );
}


/* =========================================
   STREAK
========================================= */

function calculateStreak(
    completedDates
) {

    if (
        !Array.isArray(
            completedDates
        )
    ) {
        return 0;
    }

    let streak = 0;

    const currentDate =
        new Date();

    currentDate.setHours(
        0,
        0,
        0,
        0
    );

    while (true) {

        const dateString =
            formatDateLocal(
                currentDate
            );

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
   DAYS IN YEAR
========================================= */

function getDaysInYear(year) {

    const start =
        new Date(
            year,
            0,
            1
        );

    const end =
        new Date(
            year + 1,
            0,
            1
        );

    return Math.round(
        (end - start) /
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
        !Array.isArray(
            completedDates
        ) ||
        completedDates.length === 0
    ) {
        return 0;
    }

    const dates = [
        ...new Set(
            completedDates
        )
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
                `${dates[i - 1]}T00:00:00`
            );

        const currentDate =
            new Date(
                `${dates[i]}T00:00:00`
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
        String(
            month + 1
        ).padStart(
            2,
            "0"
        );

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
        Monday = first day of week.
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
            formatDateLocal(
                date
            );

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
   OPEN HABIT DETAILS
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
        getDaysInYear(
            year
        );

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
        `${currentStreak} ${currentStreak === 1
            ? "day"
            : "days"
        }`;

    detailsBestStreak.textContent =
        `${bestStreak} ${bestStreak === 1
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
   CLOSE HABIT DETAILS
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

    calendarGrid.innerHTML = "";

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

    const weekdayNames = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];

    const todayString =
        getToday();

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
                ).padStart(
                    2,
                    "0"
                )}-${String(
                    day
                ).padStart(
                    2,
                    "0"
                )}`;

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


/* =========================================
   VERIFICATION NOTICE
========================================= */

function showVerificationNotice(
    email
) {

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
   VERIFICATION BUTTONS

   Registered once, instead of registering
   them from inside signUp().
========================================= */

verificationLoginBtn.addEventListener(
    "click",
    function () {

        hideVerificationNotice();

        setAuthMode(
            false
        );

        emailInput.focus();
    }
);


resendVerificationBtn.addEventListener(
    "click",
    async function () {

        const email =
            verificationEmail
                .textContent
                .trim();

        if (email === "") {
            return;
        }

        resendVerificationBtn.disabled =
            true;

        try {

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

                return;
            }

            alert(
                "A new verification email has been sent."
            );

        } catch (error) {

            console.error(
                "Verification resend error:",
                error
            );

            alert(
                "Could not resend the verification email. Please try again."
            );

        } finally {

            resendVerificationBtn.disabled =
                false;
        }
    }
);


/* =========================================
   AUTH MODE
========================================= */

function setAuthMode(
    signUp
) {

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
   SIGN UP / LOGIN FORM
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

        try {

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

        } finally {

            authSubmitBtn.disabled =
                false;
        }
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
        await supabaseClient.auth
            .signUp({
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


    /*
        Supabase returns no session when
        email verification is required.
    */
    if (!data.session) {

        showVerificationNotice(
            email
        );

        return;
    }


    currentUser =
        data.user;

    await showApp();
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

    await showApp();
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

        resetLocalAppState();

        showAuth();
    }
);


function resetLocalAppState() {

    currentUser = null;

    loadedUserId = null;

    habits = [];

    habitList.innerHTML = "";

    cancelActiveDrag();
}


/* =========================================
   SHOW APP
========================================= */

async function showApp() {

    if (!currentUser) {
        return;
    }

    authScreen.classList.add(
        "hidden"
    );

    appScreen.classList.remove(
        "hidden"
    );


    /*
        Don't reload the same user's habits
        every time Supabase refreshes a token.
    */
    if (
        loadedUserId ===
        currentUser.id
    ) {
        return;
    }


    loadedUserId =
        currentUser.id;

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

    emailInput.value = "";

    passwordInput.value = "";

    hideVerificationNotice();

    setAuthMode(
        false
    );
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
            .eq(
                "user_id",
                currentUser.id
            )
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

        /*
            Allow another attempt later.
        */
        loadedUserId = null;

        return;
    }


    habits =
        (data || []).map(
            function (habit) {

                return {
                    id:
                        habit.id,

                    name:
                        habit.name,

                    completedDates:
                        Array.isArray(
                            habit.completed_dates
                        )
                            ? habit.completed_dates
                            : [],

                    position:
                        habit.position ?? 0
                };
            }
        );


    habitList.innerHTML = "";


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

    let oldHabits = null;

    try {

        const raw =
            localStorage.getItem(
                "habits"
            );

        if (!raw) {
            return;
        }

        oldHabits =
            JSON.parse(
                raw
            );

    } catch (error) {

        console.warn(
            "Invalid old habit data in localStorage:",
            error
        );

        localStorage.removeItem(
            "habits"
        );

        return;
    }


    if (
        !Array.isArray(
            oldHabits
        ) ||
        oldHabits.length === 0
    ) {
        return;
    }


    const habitsToInsert =
        oldHabits.filter(
            function (oldHabit) {

                if (
                    !oldHabit ||
                    typeof oldHabit.name !==
                    "string"
                ) {
                    return false;
                }

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
            function (
                habit,
                index
            ) {

                return {
                    user_id:
                        currentUser.id,

                    name:
                        habit.name.trim(),

                    completed_dates:
                        Array.isArray(
                            habit.completedDates
                        )
                            ? habit.completedDates
                            : [],

                    position:
                        habits.length +
                        index
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


    (data || []).forEach(
        function (habit) {

            const newHabit = {
                id:
                    habit.id,

                name:
                    habit.name,

                completedDates:
                    Array.isArray(
                        habit.completed_dates
                    )
                        ? habit.completed_dates
                        : [],

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

function createHabitCard(
    habit
) {

    const habitCard =
        document.createElement(
            "div"
        );

    habitCard.classList.add(
        "habit-card"
    );

    habitCard.dataset.habitId =
        habit.id;


    /* =====================================
       TITLE
    ===================================== */

    const title =
        document.createElement(
            "h2"
        );

    title.textContent =
        habit.name;


    /* =====================================
       COMPLETE BUTTON
    ===================================== */

    const completeButton =
        document.createElement(
            "button"
        );

    completeButton.classList.add(
        "complete-button"
    );

    completeButton.addEventListener(
        "animationend",
        function () {

            completeButton.classList.remove(
                "just-completed"
            );
        }
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


    /* =====================================
       STREAK
    ===================================== */

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
            `Current streak: ${streak} ${streak === 1
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


    /* =====================================
       COMPLETE HABIT
    ===================================== */

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
                completeButton.querySelector(
                    ".button-count"
                );


            countElement.textContent =
                habit.completedDates.length;


            completeButton.classList.add(
                "completed"
            );

            completeButton.classList.remove(
                "just-completed"
            );

            void completeButton.offsetWidth;

            completeButton.classList.add(
                "just-completed"
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
                    )
                    .eq(
                        "user_id",
                        currentUser.id
                    );


            if (error) {

                console.error(
                    "Could not save completion:",
                    error
                );


                habit.completedDates =
                    habit.completedDates.filter(
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


    /* =====================================
       DETAILS BUTTON
    ===================================== */

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


    /* =====================================
       DELETE BUTTON
    ===================================== */

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


            deleteButton.disabled =
                true;


            const {
                error
            } =
                await supabaseClient
                    .from("habits")
                    .delete()
                    .eq(
                        "id",
                        habit.id
                    )
                    .eq(
                        "user_id",
                        currentUser.id
                    );


            if (error) {

                deleteButton.disabled =
                    false;

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
                            String(
                                item.id
                            ) !==
                            String(
                                habit.id
                            )
                        );
                    }
                );


            habitCard.remove();


            /*
                Normalize remaining positions
                after deletion.
            */
            await saveHabitOrder();
        }
    );


    /* =====================================
       BUILD CARD
    ===================================== */

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
   SMOOTH GRID DRAGGING

   Important:
   Grid slot coordinates are captured ONCE
   when dragging begins.

   The placeholder can then move without
   changing the coordinates used to choose
   the target slot.

   This prevents vertical/diagonal feedback
   loops and snapping between rows.
========================================= */

let dragState = null;

const DRAG_START_DISTANCE = 7;

const REORDER_ANIMATION_DURATION = 140;


/* =========================================
   POINTER DOWN
========================================= */

habitList.addEventListener(
    "pointerdown",
    function (event) {

        /*
            Buttons remain normal controls.
        */
        if (
            event.target.closest(
                "button, input, a"
            )
        ) {
            return;
        }


        const card =
            event.target.closest(
                ".habit-card"
            );


        if (!card) {
            return;
        }


        if (
            event.pointerType ===
            "mouse" &&
            event.button !== 0
        ) {
            return;
        }


        const rect =
            card.getBoundingClientRect();


        dragState = {

            card:
                card,

            pointerId:
                event.pointerId,

            startX:
                event.clientX,

            startY:
                event.clientY,

            offsetX:
                event.clientX -
                rect.left,

            offsetY:
                event.clientY -
                rect.top,

            width:
                rect.width,

            height:
                rect.height,

            placeholder:
                null,

            dragging:
                false,

            targetIndex:
                null,

            slotRects:
                []
        };
    }
);


/* =========================================
   POINTER MOVE
========================================= */

document.addEventListener(
    "pointermove",
    function (event) {

        if (!dragState) {
            return;
        }


        if (
            event.pointerId !==
            dragState.pointerId
        ) {
            return;
        }


        const moveX =
            event.clientX -
            dragState.startX;

        const moveY =
            event.clientY -
            dragState.startY;


        const distance =
            Math.hypot(
                moveX,
                moveY
            );


        if (
            !dragState.dragging &&
            distance <
            DRAG_START_DISTANCE
        ) {
            return;
        }


        if (
            !dragState.dragging
        ) {

            startCardDrag(
                event
            );
        }


        event.preventDefault();


        moveDraggedCard(
            event.clientX,
            event.clientY
        );


        updateDragTarget(
            event.pageX,
            event.pageY
        );

    },
    {
        passive: false
    }
);


/* =========================================
   POINTER UP / CANCEL
========================================= */

document.addEventListener(
    "pointerup",
    finishCardDrag
);


document.addEventListener(
    "pointercancel",
    finishCardDrag
);


/*
    Prevent a card from being left floating
    if the browser/window loses focus.
*/
window.addEventListener(
    "blur",
    function () {

        if (
            dragState &&
            dragState.dragging
        ) {

            restoreDraggedCard();
        }

        dragState = null;
    }
);


/* =========================================
   START DRAG
========================================= */

function startCardDrag(
    event
) {

    if (!dragState) {
        return;
    }


    const card =
        dragState.card;


    /*
        Capture the original grid slots BEFORE
        removing the card from normal grid flow.

        These coordinates stay fixed throughout
        the entire drag.
    */
    const allCards = [
        ...habitList.querySelectorAll(
            ".habit-card"
        )
    ];


    dragState.slotRects =
        allCards.map(
            function (item) {

                const rect =
                    item.getBoundingClientRect();

                return {

                    left:
                        rect.left +
                        window.scrollX,

                    top:
                        rect.top +
                        window.scrollY,

                    right:
                        rect.right +
                        window.scrollX,

                    bottom:
                        rect.bottom +
                        window.scrollY,

                    width:
                        rect.width,

                    height:
                        rect.height,

                    centerX:
                        rect.left +
                        window.scrollX +
                        rect.width / 2,

                    centerY:
                        rect.top +
                        window.scrollY +
                        rect.height / 2
                };
            }
        );


    dragState.targetIndex =
        allCards.indexOf(
            card
        );


    const placeholder =
        document.createElement(
            "div"
        );


    placeholder.classList.add(
        "habit-placeholder"
    );


    /*
        Only force the height.

        CSS Grid controls the width itself.
        A fixed placeholder width can cause
        grid reflow problems.
    */
    placeholder.style.height =
        `${dragState.height}px`;


    habitList.insertBefore(
        placeholder,
        card
    );


    dragState.placeholder =
        placeholder;

    dragState.dragging =
        true;


    card.classList.add(
        "dragging"
    );


    /*
        Make the actual card float freely above
        the CSS Grid while the placeholder keeps
        its grid position.
    */
    card.style.position =
        "fixed";

    card.style.left =
        `${event.clientX -
        dragState.offsetX
        }px`;

    card.style.top =
        `${event.clientY -
        dragState.offsetY
        }px`;

    card.style.width =
        `${dragState.width}px`;

    card.style.height =
        `${dragState.height}px`;

    card.style.margin =
        "0";

    card.style.zIndex =
        "9999";

    card.style.pointerEvents =
        "none";


    document.body.classList.add(
        "sorting-habits"
    );
}


/* =========================================
   MOVE FLOATING CARD
========================================= */

function moveDraggedCard(
    clientX,
    clientY
) {

    if (
        !dragState ||
        !dragState.dragging
    ) {
        return;
    }


    const card =
        dragState.card;


    card.style.left =
        `${clientX -
        dragState.offsetX
        }px`;


    card.style.top =
        `${clientY -
        dragState.offsetY
        }px`;
}


/* =========================================
   FIND NEAREST GRID SLOT
========================================= */

function getNearestSlotIndex(
    pageX,
    pageY
) {

    if (
        !dragState ||
        dragState.slotRects.length === 0
    ) {
        return null;
    }


    let closestIndex =
        dragState.targetIndex ?? 0;

    let closestDistance =
        Infinity;


    dragState.slotRects.forEach(
        function (
            rect,
            index
        ) {

            /*
                Distance to each ORIGINAL grid slot.

                Y is weighted slightly more than X
                so crossing rows feels deliberate,
                while diagonal movement still works.
            */
            const deltaX =
                pageX -
                rect.centerX;

            const deltaY =
                pageY -
                rect.centerY;


            const distance =
                (
                    deltaX *
                    deltaX
                ) +
                (
                    deltaY *
                    deltaY *
                    1.15
                );


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closestIndex =
                    index;
            }
        }
    );


    return closestIndex;
}


/* =========================================
   UPDATE DRAG TARGET
========================================= */

function updateDragTarget(
    pageX,
    pageY
) {

    if (
        !dragState ||
        !dragState.dragging
    ) {
        return;
    }


    const targetIndex =
        getNearestSlotIndex(
            pageX,
            pageY
        );


    if (
        targetIndex === null ||
        targetIndex ===
        dragState.targetIndex
    ) {
        return;
    }


    const oldPositions =
        captureCardPositions();


    movePlaceholderToIndex(
        targetIndex
    );


    dragState.targetIndex =
        targetIndex;


    animateCardsToNewPositions(
        oldPositions
    );
}


/* =========================================
   MOVE PLACEHOLDER TO INDEX
========================================= */

function movePlaceholderToIndex(
    targetIndex
) {

    if (
        !dragState ||
        !dragState.placeholder
    ) {
        return;
    }


    const placeholder =
        dragState.placeholder;

    const card =
        dragState.card;


    /*
        Only real cards are considered here.
        The floating dragged card and placeholder
        are ignored when determining insertion.
    */
    const cards = [
        ...habitList.querySelectorAll(
            ".habit-card:not(.dragging)"
        )
    ];


    if (
        targetIndex >=
        cards.length
    ) {

        habitList.appendChild(
            placeholder
        );

        return;
    }


    const referenceCard =
        cards[targetIndex];


    habitList.insertBefore(
        placeholder,
        referenceCard
    );


    /*
        The dragged card remains in the DOM
        while fixed-positioned, so keep it
        logically out of the placeholder's way.
    */
    if (
        card ===
        placeholder.nextSibling
    ) {

        const next =
            card.nextSibling;

        if (next) {

            habitList.insertBefore(
                placeholder,
                next
            );

        } else {

            habitList.appendChild(
                placeholder
            );
        }
    }
}


/* =========================================
   CAPTURE VISIBLE CARD POSITIONS
========================================= */

function captureCardPositions() {

    const positions =
        new Map();


    const cards =
        habitList.querySelectorAll(
            ".habit-card:not(.dragging)"
        );


    cards.forEach(
        function (card) {

            positions.set(
                card,
                card.getBoundingClientRect()
            );
        }
    );


    return positions;
}


/* =========================================
   FLIP REORDER ANIMATION
========================================= */

function animateCardsToNewPositions(
    oldPositions
) {

    oldPositions.forEach(
        function (
            oldRect,
            card
        ) {

            const newRect =
                card.getBoundingClientRect();


            const deltaX =
                oldRect.left -
                newRect.left;


            const deltaY =
                oldRect.top -
                newRect.top;


            if (
                Math.abs(
                    deltaX
                ) < 1 &&
                Math.abs(
                    deltaY
                ) < 1
            ) {
                return;
            }


            if (
                card.reorderAnimation
            ) {

                card.reorderAnimation.cancel();
            }


            card.reorderAnimation =
                card.animate(
                    [
                        {
                            transform:
                                `translate(${deltaX}px, ${deltaY}px)`
                        },
                        {
                            transform:
                                "translate(0, 0)"
                        }
                    ],
                    {
                        duration:
                            REORDER_ANIMATION_DURATION,

                        easing:
                            "cubic-bezier(0.2, 0.8, 0.2, 1)"
                    }
                );


            card.reorderAnimation
                .addEventListener(
                    "finish",
                    function () {

                        card.reorderAnimation =
                            null;
                    },
                    {
                        once: true
                    }
                );
        }
    );
}


/* =========================================
   FINISH DRAG
========================================= */

async function finishCardDrag(
    event
) {

    if (!dragState) {
        return;
    }


    if (
        event.pointerId !==
        dragState.pointerId
    ) {
        return;
    }


    /*
        Pointer was only clicked, not dragged.
    */
    if (
        !dragState.dragging
    ) {

        dragState = null;

        return;
    }


    const card =
        dragState.card;

    const placeholder =
        dragState.placeholder;


    const floatingRect =
        card.getBoundingClientRect();


    /*
        Put the real card into the placeholder's
        final location.
    */
    habitList.insertBefore(
        card,
        placeholder
    );


    placeholder.remove();


    clearDraggedCardStyles(
        card
    );


    const finalRect =
        card.getBoundingClientRect();


    const deltaX =
        floatingRect.left -
        finalRect.left;


    const deltaY =
        floatingRect.top -
        finalRect.top;


    card.animate(
        [
            {
                transform:
                    `translate(${deltaX}px, ${deltaY}px) scale(1.015)`
            },
            {
                transform:
                    "translate(0, 0) scale(1)"
            }
        ],
        {
            duration: 180,

            easing:
                "cubic-bezier(0.2, 0.8, 0.2, 1)"
        }
    );


    dragState = null;


    await saveHabitOrder();
}


/* =========================================
   CLEAR DRAG STYLES
========================================= */

function clearDraggedCardStyles(
    card
) {

    card.classList.remove(
        "dragging"
    );

    card.style.position = "";
    card.style.left = "";
    card.style.top = "";
    card.style.width = "";
    card.style.height = "";
    card.style.margin = "";
    card.style.zIndex = "";
    card.style.pointerEvents = "";

    document.body.classList.remove(
        "sorting-habits"
    );
}


/* =========================================
   CANCEL / RESTORE ACTIVE DRAG
========================================= */

function restoreDraggedCard() {

    if (
        !dragState ||
        !dragState.dragging
    ) {
        return;
    }


    const card =
        dragState.card;

    const placeholder =
        dragState.placeholder;


    if (
        placeholder &&
        placeholder.isConnected
    ) {

        habitList.insertBefore(
            card,
            placeholder
        );

        placeholder.remove();
    }


    clearDraggedCardStyles(
        card
    );
}


function cancelActiveDrag() {

    if (!dragState) {
        return;
    }

    restoreDraggedCard();

    dragState = null;
}


/* =========================================
   SAVE HABIT ORDER
========================================= */

async function saveHabitOrder() {

    if (!currentUser) {
        return;
    }


    const cards = [
        ...habitList.querySelectorAll(
            ".habit-card"
        )
    ];


    const reorderedHabits = [];


    cards.forEach(
        function (card) {

            const habit =
                habits.find(
                    function (item) {

                        return (
                            String(
                                item.id
                            ) ===
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
        Only send database updates for habits
        whose positions actually changed.
    */
    const changedHabits = [];


    habits.forEach(
        function (
            habit,
            index
        ) {

            if (
                habit.position ===
                index
            ) {
                return;
            }


            habit.position =
                index;


            changedHabits.push({
                habit:
                    habit,

                position:
                    index
            });
        }
    );


    /*
        Keep these sequential.

        This is safer if the database later
        receives position constraints.
    */
    for (
        const change of
        changedHabits
    ) {

        const {
            error
        } =
            await supabaseClient
                .from("habits")
                .update({
                    position:
                        change.position
                })
                .eq(
                    "id",
                    change.habit.id
                )
                .eq(
                    "user_id",
                    currentUser.id
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

        if (!currentUser) {
            return;
        }


        const habitName =
            habitInput.value.trim();


        if (habitName === "") {
            return;
        }


        /*
            Matches the project's existing
            45-character habit-name limit.
        */
        if (
            habitName.length > 45
        ) {

            alert(
                "Habit names can contain a maximum of 45 characters."
            );

            return;
        }


        const duplicateHabit =
            habits.some(
                function (habit) {

                    return (
                        habit.name
                            .trim()
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


        try {

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

                        completed_dates:
                            [],

                        position:
                            habits.length
                    })
                    .select()
                    .single();


            if (error) {

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
                    Array.isArray(
                        data.completed_dates
                    )
                        ? data.completed_dates
                        : [],

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


            habitInput.value = "";

            habitInput.focus();

        } finally {

            addHabitBtn.disabled =
                false;
        }
    }
);


/* =========================================
   ENTER = ADD HABIT
========================================= */

habitInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            addHabitBtn.click();
        }
    }
);


/* =========================================
   CHECK EXISTING SESSION
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

        /*
            initializeApp() handles the initial
            session, so INITIAL_SESSION is ignored
            here to avoid duplicate habit loading.
        */
        if (
            event ===
            "INITIAL_SESSION"
        ) {
            return;
        }


        /*
            Token refresh doesn't require a full
            reload of the habit list.
        */
        if (
            event ===
            "TOKEN_REFRESHED"
        ) {

            if (session) {

                currentUser =
                    session.user;
            }

            return;
        }


        if (
            event ===
            "SIGNED_IN"
        ) {

            if (!session) {
                return;
            }


            const previousUserId =
                currentUser?.id;


            currentUser =
                session.user;


            if (
                previousUserId !==
                currentUser.id
            ) {

                loadedUserId =
                    null;
            }


            await showApp();

            return;
        }


        if (
            event ===
            "SIGNED_OUT"
        ) {

            resetLocalAppState();

            showAuth();
        }
    }
);


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
    savedTheme ===
    "dark"
) {

    document.body.classList.add(
        "dark-mode"
    );
}


updateThemeButton();


/* =========================================
   START APPLICATION
========================================= */

initializeApp();