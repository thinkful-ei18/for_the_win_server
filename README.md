# For The Win
The basketball enthusiast's preferred way to track stats for their favorite players.
<br>
<br>
For The Win is an app where you can make or join a fantasy basketball league (up to 5 members) and keep up with the stats of your favorite basketball players. Once you register for a free account simply choose 10 players to be on your team and track their stats on the dashboard. Each occurence of an offensive or defensive stat counts as a single point towards the user's total score. I.E., if one of your players had (4) 2 point shots, (1) assist and (3) rebounds in their last game, their total score for that day would be 8 points. 
<br>
<br>
In addition, each user can view the schedule for all NBA teams on that day.

### Demo Account
username: demo@gmail.com <br>
password: demo12345

### Deployed version
  https://for-the-win-app.netlify.com/
  
### Client repo
  https://github.com/thinkful-ei18/for_the_win_client
  
### API Documentation
A RESTful API, created by myself, as well as a third party API hosted by <a href='https://www.mysportsfeeds.com/data-feeds/api-docs#'>MySportsFeed</a> were used to handle the requests from the client portion of For The Win. 

<br><br>

<b>'./routes/leagueRouter.js'</b> -- details the creation, addition to and retrieval of a fantasy basketball league. <br>
<b>'./routes/loginRouter.js'</b> -- details the login process using OAuth 2.0. <br>
<b>'./routes/registerRouter.js'</b> -- details the user creation process, with several verification steps along the way. <br>
<b>'./routes/teamRouter.js'</b> -- details how each user adds to, removes from, or gets their team of 10 players.

<br><br>

<b>'./routes/proxyRouter.js'</b> -- incorporates the use of the following feeds from MySportsFeeds: Cumulative Player Stats, Player Game Logs, Roster Players and Daily Game Schedule.

## Deployed version
  https://for-the-win-app.netlify.com/


### Server Tech Stack
![Server Tech Stack](/images/server_tech_stack.jpg?raw=true "Server Tech Stack")

<br>
<br>

#### This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
