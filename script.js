function maskPassword(pass) {
    let str = "";
    for (let index = 0; index < pass.length; index++) {
        str += "*";
    }
    return str;
}

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            document.getElementById("alert").style.display = "inline";
            setTimeout(() => {
                document.getElementById("alert").style.display = "none";
            }, 2000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}

const deletePassword = (website) => {
    let data = localStorage.getItem("passwords");
    let arr = JSON.parse(data);
    arrUpdated = arr.filter((e) => {
        return e.website !== website;
    });
    localStorage.setItem("passwords", JSON.stringify(arrUpdated));
    alert('Successfully deleted password');
    showPasswords();
}

// Logic to fill the table
const showPasswords = () => {
    let tb = document.querySelector("table");
    let data = localStorage.getItem("passwords");
    if (data == null || JSON.parse(data).length == 0) {
        tb.innerHTML = "No Data To Show";
    } else {
        tb.innerHTML = `<tr>
            <th>Website</th>
            <th>Username</th>
            <th>Password</th>
            <th>Delete</th>
        </tr>`;
        let arr = JSON.parse(data);
        let str = "";
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];

            str += `<tr>
                <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button" width="10" height="10">
                </td>
                <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button" width="10" height="10">
                </td>
                <td>${maskPassword(element.password)} <img onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy Button" width="10" height="10">
                </td>
                <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
            </tr>`;
        }
        tb.innerHTML = tb.innerHTML + str;
    }
    website.value = "";
    username.value = "";
    password.value = "";
}

console.log("Working");
showPasswords();
document.querySelector(".btn").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Clicked....");
    console.log(username.value, password.value);
    let passwords = localStorage.getItem("passwords");
    if (passwords == null) {
        let json = [];
        if (isPasswordValid(password.value)) {
            json.push({ website: website.value, username: username.value, password: password.value });
            alert("Password Saved");
            localStorage.setItem("passwords", JSON.stringify(json));
        } 
    } else {
        let json = JSON.parse(localStorage.getItem("passwords"));
        if (isPasswordValid(password.value)) {
            json.push({ website: website.value, username: username.value, password: password.value });
            alert("Password Saved");
            localStorage.setItem("passwords", JSON.stringify(json));
        } 
    }
    showPasswords();
});

function isPasswordValid(password) {
    // Define your password requirements here
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/.test(password);

    // Password should meet all requirements
    if (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialCharacter
    ) {
        return true;
    } 
}
const passwordInput = document.querySelector(".pass-field input");
const eyeIcon = document.querySelector(".pass-field i");
const requirementList = document.querySelectorAll(".requirement-list li");

// An array of password requirements with corresponding 
// regular expressions and index of the requirement list item
const requirements = [
    { regex: /.{8,}/, index: 0 }, // Minimum of 8 characters
    { regex: /[0-9]/, index: 1 }, // At least one number
    { regex: /[a-z]/, index: 2 }, // At least one lowercase letter
    { regex: /[^A-Za-z0-9]/, index: 3 }, // At least one special character
    { regex: /[A-Z]/, index: 4 }, // At least one uppercase letter
]

passwordInput.addEventListener("keyup", (e) => {
    requirements.forEach(item => {
        // Check if the password matches the requirement regex
        const isValid = item.regex.test(e.target.value);
        const requirementItem = requirementList[item.index];

        // Updating class and icon of requirement item if requirement matched or not
        if (isValid) {
            requirementItem.classList.add("valid");
            requirementItem.firstElementChild.className = "fa-solid fa-check";
        } else {
            requirementItem.classList.remove("valid");
            requirementItem.firstElementChild.className = "fa-solid fa-circle";
        }
    });
});

eyeIcon.addEventListener("click", () => {
    // Toggle the password input type between "password" and "text"
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";

    // Update the eye icon class based on the password input type
    eyeIcon.className = `fa-solid fa-eye${passwordInput.type === "password" ? "" : "-slash"}`;
});
