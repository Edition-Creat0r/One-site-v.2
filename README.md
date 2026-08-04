# OneSite

OneSite is a prototype platform for learning, creating, playing, and building safe communities in one place.

The project currently uses:

- HTML
- CSS
- JavaScript
- Browser `localStorage`
- Netlify for hosting
- GitHub for version history and backups

## Current Features

OneSite currently includes:

- Homepage
- Shared navigation
- Topics library
- Science lessons
- Quizzes
- XP and level system
- Badges
- Dashboard
- Games library
- Creator Studio prototype
- Parent controls prototype
- Teacher Mode prototype
- OneSite Spaces prototype

## OneSite Spaces

OneSite Spaces allows users to create clubs and communities with:

- Space names
- Emojis
- Descriptions
- Age ratings
- Visibility settings
- Posts
- Members
- Roles

Current Space roles include:

- Space Owner
- Space Admin
- Space Helper
- Space Contributor
- Space Viewer

Future Spaces features may include:

- Custom roles
- Images and banners
- Community Mode
- Subspaces
- OneBux rewards
- Fundraisers
- Moderator verification
- Age verification

## Project Status

This is an early prototype.

The current account, permission, progress, parent-control, and Space systems use browser `localStorage`.

This means:

- Data is stored only in the current browser
- Clearing browser storage may erase progress
- Accounts are not yet secure
- Sign-in providers are not connected to real Google, Microsoft, or Apple accounts
- The project is not ready for real payments or sensitive information

## Main Files

```text
index.html
styles.css
nav.js
auth.js

topics.html
science.html
science.js

quiz.html
quiz.js
xp.js
badges.js
notifications.js

dashboard.html
profile.html

games.html
creator.html
creator.js

parents.html
teacher.html
join.html

spaces.html
spaces.css
spaces.js