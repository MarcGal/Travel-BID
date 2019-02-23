# Express APP - Travel-BID

## Description
TravelBID is an open platform enabling users to offer and find short stay accommodation around the world. Accomodation seekers are able to post offers indicating stay duration, location, and budget. Accommodation providers can see all offers posted by seekers and bid in order to provide the service. 

## User Stories

#### Juan
Juan is 20 year old sociology student. He loves traveling around having the chance to meet new people and cultures. As most other students his age, Juan is broke. Because of that he does not travel as much as he would like to. But then he discovers TravelBid, a new app that's killing it. On travelBID he can place offers 

#### Anna
Anna is 35 years old and she works at an NGO as a project manager. She is not a big traveler but she getting to meet new people. She recently started a UX/UI parttime course at Ironhack. In order to follow the course properly she decided to stop working fulltime. In order to make ends meet she decided to rent out an extra room she has at her house. 


## MVP
- **Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **Sign up** - As a user I want to sign up on the webpage so that I can use the services provided
- **Login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **MyOffers list** - As a user I want to see all the offers I have created on the platform
- **MyBids list** - As a user I want to see all bids I have made on the platform 
- **Offer create** - As a user I want to be able to create new offers whenever I want 
- **Bid create** - As a user I want to be able to bid on the offers I find interesting 
- **Accept Bids** - As a user I must have the power to accept bids others have made on my offers.
- **Reject Bids** - As a user I should be able to reject bids made on my offers.
- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

-----
Backlog
- **Offer detail** - As a user I want to see the details of the offers I have created, including the bids that other users have made on it.
- **Bid detail** - As a user I want to see the details of my own bids. Also the details of other bids that are competing with mine. 
- **Update My Bids&Offers** - As a user I must be able to edit and update all my created offers and bids
- **Delete My Bids&Offers** - As a user I must be able to delete the offers and bids I have created.

## Backlog
List of other features outside of the MVPs scope

#### User profile:
- see my profile
- Update profile
- Upload my profile picture
- see other users profile?


#### Geo Location:
- See Bids locations
- View all bids for one offer on the map

#### Social Login
- Facebook

#### Ratings
- Rate users

## ROUTES

Router
URL
Method
Description

| Description     | Method                  | Test Text     |
| :---            |    :----:               |          :---:|
| ‘/’             | GET           | Renders homepage with service info and login & signup buttons |
| /login          | GET / POST    | Renders login form |
| /signup         | GET / POST    | Renders signup form |
| /dashboard      | GET | Renders user start page, showing open offers and bids. |
| /dashboard/q | GET | Renders list of offers matching query string |
| /offer/:ID | GET | Renders info for a specific offer and the bids made on it. |
| /offer/new | GET/POST | Renders create form and posts to DB. |
| /offer/:ID/update | GET/POST | Renders update form and posts update. |
| /offer/:ID/bid/new | GET/POST | Renders create form and posts to DB |
| /bid/:ID | GET | Renders bid infoAccept / reject button || Update button || Only info|
| /bid/:ID/update | GET/POST | Renders update form and updates DB |





## MODELS

#### User Model
```javascript
{
  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  userData: { 

    name: { type: String, required: true },

    age: { type: Number, default: '' },

    gender: { type: String, default: '' },

    description: { type: String, default: '' },
  },

  accomodationAddress: { type: String },

  accomodationDescription: { type: String },

  userImage: { type: String, default: 'link' },

  accomodationImage: { type: String, default: 'link' },

}, { timestamps: true });
```





#### Bid Model
```javascript
{
  userID: {

    type: ObjectId,

    ref: 'User',
  },

  offerID: {

    type: String,
    
    ref: 'Offer',

  },

  bidValue: {

    type: Number,

  },

  bidDescription: {

    type: String,

  },

}, { timestamps: true });
```




#### Offer Model
```javascript
{
  userID: {

    type: ObjectId,
    
    ref: 'User',
  },

  from: { type: String },

  until: { type: String },

  location: { type: String },

  budget: { type: Number },

  bids: { type: Array },

}, { timestamps: true });
```

## Links

### Trello

https://trello.com/b/FU3XOPef/travelbid

### Git

https://github.com/MarcGal/Travel-BID

[Deploy Link](http://heroku.com)

### Slides

https://slides.com/margal/travelbid/edit


