const clientId = "CHANGEME";
const clientSecret = "CHANGEME";
const redirectUri = "http://localhost:1234/redirect.html";
const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=read_all`;
const activityList = document.getElementById("activity-list");

function authenticate() {
  // Redirect user to the Strava authentication page.
  window.location.href = authUrl;
}

async function getAccessToken(code) {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
    }),
  });

  const data = await response.json();
  return data.access_token;
}

async function fetchActivities(accessToken) {
  const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  const activities = await response.json();
  displayActivities(activities);
}

function displayActivities(activities) {
  activities.forEach((activity) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${activity.name} - ${activity.distance} meters - ${activity.total_elevation_gain} meters elevation gain`;
    activityList.appendChild(listItem);
  });
  }
  
  function handleAuthCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const activityId = urlParams.get("activity_id");
    
    if (authCode) {
    getAccessToken(authCode).then((accessToken) => {
    // Store the access token in localStorage for easy access across pages
    localStorage.setItem("strava_access_token", accessToken);
    if (activityId) {
    fetchActivityDetail(accessToken, activityId);
    } else {
    fetchActivities(accessToken);
    }
    });
    } else if (activityId) {
    const accessToken = localStorage.getItem("strava_access_token");
    if (accessToken) {
    fetchActivityDetail(accessToken, activityId);
    } else {
    authenticate();
    }
    } else {
    authenticate();
    }
  }
 
async function fetchActivityDetail(accessToken, activityId) {
    const response = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
  
    const activity = await response.json();
    displayActivityDetail(activity);
  }
  
  function displayActivityDetail(activity) {
    const activityName = document.getElementById("activity-name");
    const activityMap = document.getElementById("activity-map");
    const activityStats = document.getElementById("activity-stats");
  
    activityName.textContent = activity.name;
  
    // Display activity stats
    const stats = [
      { label: "Distance", value: `${activity.distance} meters` },
      { label: "Elevation Gain", value: `${activity.total_elevation_gain} meters` },
      { label: "Moving Time", value: `${activity.moving_time} seconds` },
      { label: "Elapsed Time", value: `${activity.elapsed_time} seconds` },
    ];
  
    stats.forEach((stat) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${stat.label}: ${stat.value}`;
      activityStats.appendChild(listItem);
    });
  }
  
  // Modify the displayActivities function in script.js to open the activity detail page
  
  function displayActivities(activities) {
    activities.forEach((activity) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${activity.name} - ${activity.distance} meters - ${activity.total_elevation_gain} meters elevation gain`;
      listItem.addEventListener("click", () => {
        window.location.href = `activity-detail.html?activity_id=${activity.id}`;
      });
      activityList.appendChild(listItem);
    });
  }
  
   
  // Initialize the app
  handleAuthCode();
