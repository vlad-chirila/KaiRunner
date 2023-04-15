# Strava App for KaiOS
![alt](https://www.linkpicture.com/q/photo_5895559551632129834_y.jpg)
This is a sample Strava app built for the KaiOS platform using JavaScript, HTML, and CSS. The app allows users to authenticate with the Strava API, fetch and display their activities, and view details about individual activities.

## Features
Authenticate with the Strava API using OAuth 2.0
Fetch and display activities for the authenticated user
View details about individual activities, including distance, elevation gain, and map route

## Requirements
* Node.js 10+
* NPM 6+

## Getting started
Clone this repository:

```` git clone https://github.com/vlad-chirila/strava-kaios.git ````

### Install dependencies:

````
cd strava-kaios
npm install
````
Add your Strava API credentials to the .env file:
````
makefile
Copy code
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
````
Start the development server:

````
npm start
````
Open http://localhost:1234 in your browser to view the app.

## Deploying to KaiOS
To deploy your app to a KaiOS device, you will need to package it as a zip file and sign it with a valid KaiOS developer certificate. Here are the general steps that you can follow:

Create a manifest.webapp file in the root directory of your app. This file should contain metadata about your app, such as its name, version, and icons.

Package your app as a zip file:

````
zip -r strava-kaios.zip *
````
Sign your app with a KaiOS developer certificate:

````
webide -s strava-kaios.zip
````
Install your app on a KaiOS device using the KaiOS Developer Dashboard.

For more information on deploying KaiOS apps, refer to the KaiOS Developer Portal documentation.

### License
MIT

### Screenshots
![alt](https://www.linkpicture.com/q/photo_5895559551632129837_x.jpg)
![alt](https://www.linkpicture.com/q/photo_5895559551632129835_x.jpg)
![alt](https://www.linkpicture.com/q/photo_5895559551632129836_x.jpg)
