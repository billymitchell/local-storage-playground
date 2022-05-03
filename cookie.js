// When user visits site 
// Check if they have a state set
    //Check if they have set an expiration for their state
    //if not, use default expiration 
// Check if state is expired using default or user set expiration 
// If expired update state to default 
// Load content based on state
// listen for state change input

const showPopup = document.querySelector("#show-popup")
const hidePopup = document.querySelector("#hide-popup")
const popupLink1 = document.querySelector("#popup-link-1")
const popupLink2 = document.querySelector("#popup-link-2")
const popup = document.querySelector(".pop-up")
const setExpirationForm = document.querySelector("#set-expiration-form")

// Get the current date
const currentTime = new Date().getTime();

// initial state and current date
const applicationState = {
    viewPopUp:  {
        key: "viewPopUp",
        state: String(true),
        timestamp: new Date().getTime()
    },
    newUser: {
        key: "newUser",
        state: String(true),
        timestamp: new Date().getTime()
    },
    userSetExpiration: {
        key: "userSetExpiration",
        // one day in milliseconds
        state: "86400000",
        timestamp: new Date().getTime()
    }
}


const checkStateRendering = () => {
    
    // if view popup is true, set css to block
    const renderBlock = () => {
        console.log("Render Block");
        popup.style.display = "block"
    }
    
        // // if view popup is false, set to display none
    const renderNone = () => {
        console.log("Render None");
        popup.style.display = "none"
    }
    
    // is viewPopUp true?
    (JSON.parse(localStorage.getItem("viewPopUp")).state === "true") ? renderBlock() : renderNone()

}


// not a new user 
const localStorageTrue = () => {

    console.log("localStorageTrue")

    // If popUp is expired
    const expiredSate = () => {
        console.log("Expired State");
        console.log("Resetting Sate to Initial");
        // Reset viewPopUp To Initial state
        localStorage.setItem(applicationState.viewPopUp.key, JSON.stringify(applicationState.viewPopUp));
        // render
        checkStateRendering()
    }


    // if localStorageStateExpirationThreshHold is set (not undefined)
    if (typeof localStorageStateExpirationThreshHold !== 'undefined') {
        // if the current time minus the popupTimeStamp is more than the expiration time
        (currentTime - JSON.parse(localStorage.getItem("viewPopUp")).timestamp > localStorageStateExpirationThreshHold) ? expiredSate() : checkStateRendering();
    } else {
        // if its not expired, render
        checkStateRendering()
    }
    

}

// If no local storage object exists, new user
const localStorageFalse = () => {
    console.log("localStorageFalse");

    // for each pice of default state
    for (defaultState in applicationState ) {
        // set local storage with the default state
        localStorage.setItem(String(defaultState), JSON.stringify(applicationState[`${defaultState}`]))
    }

    // Render State
    checkStateRendering()
}

// Does newUser State Exist? 
(localStorage.getItem("newUser")) ? localStorageTrue() : localStorageFalse()


// Update state, pass key and state
const updateState = (stateName, updatedState) => {

    // console.log("Updated State: ", stateName, updatedState);

    return () => {

        console.log("Updated State: ", stateName, updatedState);
        
        let updatedStateObject = {
            // pass key name 
            key: stateName,
            // pass current updated state
            state: String(updatedState),
            // update timestamp
            timestamp: new Date().getTime()
        }

        // update local storage 
        localStorage.setItem(stateName, JSON.stringify(updatedStateObject)),
        
        console.log("Test", localStorage.getItem(stateName));

        // render
        checkStateRendering()
    }

}


const setExpiration = (event) => {
    event.preventDefault()
    let form = event.target;
    let formData = new FormData(form)
    
    let userSetExpirationState = 

        (Number(formData.get("milliseconds"))) +
        (Number(formData.get("seconds")) * 1000) +
        (Number(formData.get("minutes")) * 60 * 1000) +
        (Number(formData.get("hours")) * 60 * 60 * 1000) +
        (Number(formData.get("days")) * 24 * 60 * 60 * 1000) +
        (Number(formData.get("years")) * 365.25 * 24 * 60 * 60 * 1000)

    updateState("userSetExpiration", userSetExpirationState)

}

showPopup.addEventListener("click", updateState("viewPopUp", true))
hidePopup.addEventListener("click", updateState("viewPopUp", false))
popupLink1.addEventListener("click", updateState("viewPopUp", false))
popupLink2.addEventListener("click", updateState("viewPopUp", false))
setExpirationForm.addEventListener("submit", setExpiration)

console.log("Initial State: ", localStorage);
