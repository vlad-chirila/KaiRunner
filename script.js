const clientId = "CHANGEME";
const clientSecret = "CHANGEME";
const redirectUri = "http://localhost:1234/redirect.html";

function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get("activity_id");
  
    if (activityId) {
      const accessToken = localStorage.getItem("strava_access_token");
      if (accessToken) {
        fetchActivity(activityId, accessToken);
      } else {
        console.error("No access token found in local storage");
      }
    } else {
      handleAuthCode();
    }
  }
  
window.onload = init;

async function getAccessToken(authCode) {
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: authCode,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    console.error(`Error getting access token: ${response.statusText}`);
    return null;
  }

  const data = await response.json();
  return data.access_token;
}

async function fetchActivities(accessToken) {
  const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error(`Error fetching activities: ${response.statusText}`);
    return;
  }

  const activities = await response.json();

  if (Array.isArray(activities)) {
    displayActivities(activities);
  } else {
    console.error(`Unexpected response from Strava API:`, activities);
  }
}

async function fetchActivity(activityId, accessToken) {
  const response = await fetch(`https://www.strava.com/api/v3/activities/${activityId}`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error(`Error fetching activity: ${response.statusText}`);
    return;
  }

  const activity = await response.json();
  displayActivityDetails(activity);
}

function displayActivityDetails(activity) {
  const distanceInKm = (activity.distance / 1000).toFixed(3); // Convert meters to kilometers
  document.getElementById("activity-name").textContent = activity.name;
  document.getElementById("activity-date").textContent = new Date(activity.start_date).toUTCString();
  document.getElementById("activity-distance").textContent = distanceInKm;
  document.getElementById("activity-elevation").textContent = activity.total_elevation_gain;
  document.getElementById("activity-time").textContent = `${Math.floor(activity.moving_time / 60)} minutes`;
}

function displayActivities(activities) {
  const activityList = document.getElementById("activity-list");

  activities.forEach((activity) => {
    const distanceInKm = (activity.distance / 1000).toFixed(3); // Convert meters to kilometers
    const listItem = document.createElement("li");
    listItem.textContent = `${activity.name} - ${distanceInKm} km - ${activity.total_elevation_gain} meters elevation gain`;
    listItem.addEventListener("click", () => {
      window.location.href = `activity-detail.html?activity_id=${activity.id}`;
    });
    activityList.appendChild(listItem);
  });
}

function authenticate() {
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=activity:read_all`;
  window.location.href = authUrl;
}

function handleAuthCode() {
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");

  if (authCode) {
    getAccessToken(authCode).then((accessToken) => {
      if (accessToken) {
        localStorage.setItem("strava_access_token", accessToken);
        // Redirect back to index.html with the access token
        window.location.href = `index.html?access_token=${accessToken}`;
      } else {
        console.error("Error obtaining access token");
      }
    });
  } else {
    const accessToken = urlParams.get("access_token");
    if (accessToken) {
      fetchActivities(accessToken);
    } else {
      authenticate();
    }
  }
}
