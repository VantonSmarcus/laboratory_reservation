// Array to store profile data retrieved from the server
let profiles = [];

// Define an array variable to store the appointments
let appointments = []; 

// Function to load profile data onto the HTML page
function loadProfile(profile) {
    // Check if profiles array is not empty
    if (profile) {
        document.getElementById('username').textContent = profile.username;
        document.getElementById('profile-picture').src = profile.pfp_link;
        document.getElementById('description').textContent = profile.desc;

        //Assuming log in page can locally store the _id of the user who's logging in
        var loggedInUser = getCookie("myCookie");

        fetch('/fetch-data')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const reserveContainer = document.getElementById('reserve-container');
                const reservationsList = reserveContainer.querySelector('reservations');

                let x = 0;

                for (let i = 0; i < data.length; i++) {
                    if (data[i].name === profile.username) {
                        x++;
                        const appointment = data[i];
                        console.log("appointment room num " + appointment.roomNum + " appointment date " + appointment.date + " appointment time start " + appointment.timeStart +
                                    " appointment time end " + appointment.timeEnd + " appointment seatNum " + appointment.seatNum );
                        const listItem = document.createElement('li');
                        listItem.className = 'reserve ' + x;
                        listItem.innerHTML = `<a>${appointment.roomNum} 
                                              <div>${appointment.date} ${appointment.timeStart} - ${appointment.timeEnd} ${appointment.seatNum}</div></a>`;
                        reservationsList.appendChild(listItem);
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching appointment data:', error);
            });


            if (profile.username === loggedInUser || document.referrer.includes("login")) {
                document.getElementById('edit-profile').style.display = 'block';
            }
            else {
                document.getElementById('edit-profile').style.display = 'none';
        }

        } else {
            console.log("Could not find profile with _id " + _id);
        }
    }


// Function to set up the "Edit Profile" link with the profile ID in the URL
function setupEditProfileLink(_id) {
    // Get the "Edit Profile" link element
    console.log("Creating edit link for profile with _id " + _id);
    const editProfileLink = document.getElementById("edit-profile");

    // Update the href attribute with the profile ID
    if (editProfileLink) {
        editProfileLink.href = ``; // Update href attribute directly
        console.log("/profile/edit/" + _id);
    }
}


// Event listener to execute code when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get the profile ID from the URL query parameters
    const urlParts = window.location.pathname.split('/');
    const _id = urlParts[2];

    console.log("Profile _id retrieved is " + _id);

    if (document.URL.includes("profile") || document.URL.includes("profileSearch")) {
        console.log("url includes either profile or profileSearch");
        // Fetch profile data from the server
        fetch(`/profile/${_id}`) 
            .then(response => response.json())
            .then(fetchedProfile => {
                console.log("Profile:", fetchedProfile);
                // Load the profile data onto the HTML page
                loadProfile(fetchedProfile);
                // Set up the "Edit Profile" link
                setupEditProfileLink(fetchedProfile._id);
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
            });
    }
});

// Function to submit form data to update a profile
function submitForm(event) {
    event.preventDefault();

    console.log("Form submitted");
    const urlParts = window.location.pathname.split('/');
    const _id = urlParts[2]; 

    // Get values from the form
    const newUsername = document.getElementById("new-username").value;
    const newProfilePicture = document.getElementById("new-profile-picture").files[0]; // File object for the uploaded image
    const newDescription = document.getElementById("new-description").value;

    console.log("Values obtained");
    console.log("Retrieved values are Username " + newUsername + ", pfp " + newProfilePicture + ", desc " + newDescription);

    // Create a new FormData object
    const formData = new FormData();
    formData.append('newUsername', newUsername);
    formData.append('newProfilePicture', newProfilePicture); // Append the file directly
    formData.append('newDescription', newDescription);

    // Log FormData elements
    console.log("FormData elements:");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // Send POST request to server to update the profile
    console.log("Sending POST request to server");
    fetch(`/profile/${_id}`, {
        method: 'POST',
        body: formData // Pass the FormData object directly as the request body
    })
        .then(response => {
            if (response.ok) {
                // Profile updated successfully, redirect to profile page
                console.log("Profile updated successfully");
                console.log("Redirecting");
                window.location.replace("/profile/" + _id);
            } else {
                // Error updating profile, handle error
                console.error("Error updating profile");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
// Function to submit form data to search profiles
function searchProfile(event) {
    event.preventDefault();

    const searchData = document.getElementById("search-params").value;

    console.log("search-params are " + searchData);

    fetch(`/profile/search?search=${searchData}`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(foundProfiles => {
            console.log("Found profiles:", foundProfiles);

            const searchResultsContainer = document.getElementById("search-results");

            // Clear previous search results
            searchResultsContainer.innerHTML = "";

            if (foundProfiles && foundProfiles.length > 0) {
                console.log("The array exists and has elements.");

                // Iterate over found profiles and construct HTML elements
                foundProfiles.forEach(profile => {
                    const resultItem = document.createElement("div");
                    resultItem.classList.add("result-item");

                    const pfp = document.createElement("div");
                    pfp.classList.add("pfp");

                    const profilePicture = document.createElement("img");
                    profilePicture.classList.add("profile-picture");
                    profilePicture.src = profile.pfp_link;
                    profilePicture.alt = "Profile Picture";

                    const profileText = document.createElement("div");
                    profileText.classList.add("profile-text");

                    const usernameLink = document.createElement("a");
                    usernameLink.classList.add("username");
                    usernameLink.href = `profile/${profile._id}`;
                    usernameLink.textContent = profile.username;

                    const desc = document.createElement("p");
                    desc.classList.add("desc");
                    desc.textContent = profile.desc;

                    pfp.appendChild(profilePicture);
                    profileText.appendChild(usernameLink);
                    profileText.appendChild(desc);

                    resultItem.appendChild(pfp);
                    resultItem.appendChild(profileText);

                    searchResultsContainer.appendChild(resultItem);
                });
            } else {
                console.log("No profiles found.");
                searchResultsContainer.innerHTML = "<p>No results found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching or rendering profiles:", error);
        });
}





/*/


let profiles = [];
profiles = JSON.parse(localStorage.getItem('profiles')); //makes sure profiles array is consistent between pages by taking from saved local storage

var profile = {
    //Assumes when a new profile is created it is added to the profiles array
    //Also assumes profileID is assigned when a new profile is created 
    profileID: '',
    userName: '',
    profilePicture: 'Png.png', //default profile picture (forgot the folder setup for the full zip file will update later)
    description: '',
    password: '',
    isLoggedIn: 0,

    //for creating new profile
    createProfile: function (profileID, userName, password) {
        this.profileID = profileID;
        this.userName = userName;
        this.password = password;
        this.updateProfile();
    },

    //for updating existing profiles
    setProfile: function (userName, profilePicture, description, password) {
        this.userName = userName;
        this.profilePicture = profilePicture;
        this.description = description;
        this.password = password;
        this.updateProfile();
    },

    editProfile: function (userName, profilePicture, description) {
        this.userName = userName;
        this.profilePicture = profilePicture;
        this.description = description;
        this.updateProfile();
    },

    updateProfile: function () {
        // Check if the elements exist before updating
        var usernameElement = document.getElementById('username');
        var profilePictureElement = document.getElementById('profile-picture');
        var descriptionElement = document.getElementById('description');

        if (usernameElement && profilePictureElement && descriptionElement) {
            usernameElement.textContent = this.userName;
            profilePictureElement.src = this.profilePicture; // Assuming this.profilePicture contains a valid image URL
            descriptionElement.textContent = this.description;
        }
    }
};

document.addEventListener("DOMContentLoaded", function () {
    // Get the profile ID from the URL query parameters
    // This assumes when you open the profile.html webpage the URL for each link is something
    // like profile.html?profileID=123 with each id at the end being unique to the profile (ie ?profileID=001, ?profileID=002, etc. any number format is fine as long as each ID is unique)
    const urlParams = new URLSearchParams(window.location.search);
    const profileID = urlParams.get('profileID');

    // Load profile data based on the profileID
    loadProfile(profileID);

    // Make sure edit page edits the correct profile
    setupEditProfileLink(profileID);
});

function setupEditProfileLink(profileID) {
    // Get the profile ID from the currently loaded profile
    const profileID = profileID;

    // Get the "Edit Profile" link element
    const editProfileLink = document.getElementById("edit-profile");

    // Update the href attribute with the profileID
    if (editProfileLink) {
        editProfileLink.href = `edit.html?profileID=${profileID}`;
    }
}

function submitForm(event) {
    event.preventDefault();

    console.log("Form submitted");
    const urlParams = new URLSearchParams(window.location.search);
    const profileID = urlParams.get('profileID');

    // Get values from the form
    var newUsername = document.getElementById("new-username").value;
    var newProfilePictureFile = document.getElementById("new-profile-picture").files[0]; // File object for the uploaded image
    var newDescription = document.getElementById("new-description").value;

    console.log("Values obtained");

    var newProfilePicture = URL.createObjectURL(newProfilePictureFile);

    // Edit the existing profile
    editExistingProfile(profileID,newUsername, newProfilePicture, newDescription);

    // Redirect back to the main profile page
    console.log("Redirecting");
    window.location.replace("profile.html?profileID="+profileID);
}

function editExistingProfile(profile_ID,newUsername, newProfilePicture, newDescription) {
    // Assuming profileID is known and unique for each profile
    var profileID = profile_ID;
    var existingProfile = profiles.find(profile => profile.profileID === profileID);

    if (existingProfile) {
        existingProfile.editProfile(newUsername, newProfilePicture, newDescription);
        saveProfilesLocally(); // Save profiles array to localStorage
    }
}

function updateProfile(username, profilePicture, description) {
    // Update HTML elements with profile information
    document.getElementById('username').textContent = username;
    document.getElementById('profile-picture').src = profilePicture;
    document.getElementById('description').textContent = description;
}

function loadProfile(profile_ID) {
    // Load profile data from localStorage
    var savedProfiles = JSON.parse(localStorage.getItem('profiles'));

    // Update profile with loaded data
    if (savedProfiles) {
        profiles = savedProfiles;
        var profile = profiles.find(profile => profile.profileID === profile_ID);
        if (profile) {
            updateProfile(profile.userName, profile.profilePicture, profile.description);
        }
    }
}

function saveProfilesLocally() {
    // Save profiles array to localStorage
    localStorage.setItem('profiles', JSON.stringify(profiles));
}
/*/