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
const setLocalExpirationForm = document.querySelector("#set-expiration-form")
const currentExpirationDisplay = document.querySelector(".current-expiration")

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
    localStorageExpiration: {
        key: "localStorageExpiration",
        // one day in milliseconds
        state: "86400000",
        timestamp: new Date().getTime()
    }
}


const checkStateRendering = () => {
    
    // if view popup is true, set css to block
    const renderBlock = () => {
        popup.style.display = "block"
    }
    
        // // if view popup is false, set to display none
    const renderNone = () => {
        popup.style.display = "none"
    }
    
    // is viewPopUp true?
    (JSON.parse(localStorage.getItem("viewPopUp")).state === "true") ? renderBlock() : renderNone()

}

//new user
const setDefaultState = () => {
    console.log("New User or Resetting State");

    // for each pice of default state
    for (defaultState in applicationState ) {
        // set local storage with the default state
        localStorage.setItem(String(defaultState), JSON.stringify(applicationState[`${defaultState}`]))
    }
    console.log("Default State: ", localStorage);
    // Render State
    checkStateRendering()
}

// not a new user 
const localStorageTrue = () => {

    console.log("localStorageTrue")
    
    // if state is expired
    const expiredSate = () => {
        console.log("Expired State");
        console.log("Resetting State to Initial");
        // Reset State
        setDefaultState()
    }

    //if current time minus view popup timestamp is greater than local storage expiration, state is expired, else render
    currentTime - JSON.parse(localStorage.getItem("viewPopUp")).timestamp > JSON.parse(localStorage.getItem("localStorageExpiration")).state ? expiredSate() : checkStateRendering();

}



// Does newUser State Exist? 
(localStorage.getItem("newUser")) ? localStorageTrue() : setDefaultState()


// Update state, pass key and state
const updateState = (stateName, updatedState) => {

    // console.log("Updated State: ", stateName, updatedState);

   

        console.log("Updated State: ", stateName, updatedState);
        
        let updatedStateObject = {
            // pass key name 
            key: stateName,
            // pass current updated state
            state: String(updatedState),
            // update timestamp
            timestamp: new Date().getTime()
        }

        console.log("State Object To Be Set, ", updatedStateObject);

        console.log("Current State, ", JSON.parse(localStorage.getItem(stateName)))
        // update local storage 
        localStorage.setItem(stateName, JSON.stringify(updatedStateObject)),
        
        console.log("Updated Current State, ", JSON.parse(localStorage.getItem(stateName)));

        // render
        checkStateRendering()


}


const setLocalStorageExpiration = (event) => {
    event.preventDefault()
    let formData = new FormData(event.target)
    
    let localStorageExpirationState = 

        (Number(formData.get("milliseconds"))) +
        (Number(formData.get("seconds")) * 1000) +
        (Number(formData.get("minutes")) * 60 * 1000) +
        (Number(formData.get("hours")) * 60 * 60 * 1000) +
        (Number(formData.get("days")) * 24 * 60 * 60 * 1000) +
        (Number(formData.get("years")) * 365.25 * 24 * 60 * 60 * 1000)

    updateState("localStorageExpiration", localStorageExpirationState)
    setCurrentExpirationDisplay()
}


const setCurrentExpirationDisplay = () => {
    currentExpirationDisplay.innerHTML = JSON.parse(localStorage.getItem("localStorageExpiration")).state / 86400000
}
setCurrentExpirationDisplay()

showPopup.addEventListener("click", () => {
    updateState("viewPopUp", true)
})
hidePopup.addEventListener("click", () => {
    updateState("viewPopUp", false)
})
popupLink1.addEventListener("click", () => {
    updateState("viewPopUp", false)
})
popupLink2.addEventListener("click", () => {
    updateState("viewPopUp", false)
})
setLocalExpirationForm.addEventListener("submit", setLocalStorageExpiration)


