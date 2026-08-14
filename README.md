# Hytai Glow

A hub for connecting me (and eventually more people) to Black businesses in Durham of all kinds!

## Project Description

 A website that allows people to store and rate local black Durham businesses. Utilizing Node.JS and SelevteKit, the system will allow for people to input places they been to, adding it to a larger depository, that will allow users to filter based on the kind of business or search up the business they are looking for. I vaguely want this to model something like yelp but more based on qualitive reviews that promote growth and care within that small business aspect(as of right now as there’s not enough time to make a full fledge login procedure). This system will also connect to MongoDB for Seasy access of all information on a public domain.

## Target Audience and Motivation

This idea originated from work last semester (Fall 2025) with the black community on Fayetteville street in Durham. A lot of these businesses do amazing work but don’t have the platform to get out there or don't know where to continue with newfound developments. It's hard to start a new business by yourself so bringig the community together to help uplift can be such a strong resource. How can we continue to enligten people about the beautiful community around them whilst also pushing forward community? Hopefully with this application the target audience, durham natives and temporary residences, are able to start doing more of both.

## Human-Centered Design Analysis

### This websites can afford to have...
* Clear Business Information cards that show exactly the business, business type, and amount of comments.
* Clear access between the admin and home page through a nav bar, with distincit central movement
* A login page that closes off admin to only one authorized user (as of right now)
* Digestable information in form of a graph of number of businesses relating to the type and a chart demonstrating the data
* Edits and Deletions of business to ensure top recent events
* Community based review improvements through glows and grows that can be utilized
* Discoverability as it allows a community perspective on different local business

### This website cannot afford...
* To change the types of business avaliable to rate as there are set catorgeries to help make the filitering process easier
* To be used in self interest instead of the interest of others to promote black owned businesses
* Payment as this application should allow community to be built and followed thru.

There will be an intentional constraint in a future interation to limit what a regular guest, business, and executive operater will have access to, ensuring quality information.

### Signifers
* Filiter options on home page, to tell you exactly what each business is under
* Glows and grows used to demonstrate what the business highlights
* Button styling, when selected the color changes on the filiters
* Letter sizes to demonstrate what the headings and descriptions are

### Visual, Spatial, Auditory, or Interactive cues
* Transition: Smooth transitions between admin and home page
* Cursor Changes: Pointer cursor on interactive elements, default on static content
* Business tracker: Graph to indicate how many businesses are in each section

### System Respond to User Input
The systems responsds to the user by inputting the businesses into the chart and the home databse for viewing by the other guest on the websites. You can tell it works when you see the visual cue of the added business in the chart and see the graph grows. You can also tell if you switch to home and see the visual cue of the total incressing by the local directory tag and the added business sections.

### Feedback Loop
#### Process:

1. Input: Business name, type, owner, hours, and description (short and long)
2. System creates an item with all this given information
3. System takes information and uses it to fill in chart  and home/ view-only mode for the website.
4. User is now able to view information through an admin view and a user view (if given that access)
5. User can filiter through businesses to see everything in databse.
6. Prompts user to add glows and grows to the websites
7. Users will be able to make a business request of who they would like to see on site

#### Loop effect:
More visibility → more real-world engagement → more submissions → even more visibility

## Installation

You need Node.js to run this project.
Once the repo is clone you MUST make your own .env file that contains your own MONGODB

    # Clone the repo
    git@github.com:larkspurjohn-gif/midtermProj.git
    cd my-midterm

    # Install dependencies
    npm install

    # Start the development server
    npm run dev

## Usage

Admin side is used to CRUD (Create, Read, Update, Delete) business information. It features a graph to keep track of how many businesses are under each rating but this might change later on to how many of each what business type as that could be more important to see (maybe having both views would be nice). The log in for admin right noww is as follows: User- admin, Pass-admin123

On the home side, it is a view only simplfied version of the CRUD as it shows you all the same information but in an easy digestable way for people to see it. This also includes filiter buttons for business types so you can see the businesses under each catorgery. When you click each business you can leave a glow or grow review or read others. It will showcase the top glow and grow at the top of the page. You can also see the business information when clicking on the tab by reviews.

## License

Public

## Acknowledgements

Thank you to the glourious people that are behind SvelteKit, Node.Js, MongoDB!
My inspirations for this project came primarly from Yelp and my Notion Board, shoutout to them!
Also to the black durham community for showing me the beauty that is hidden here.

Svelte, HTML, CSS, and JavaScript were used in this project.

## Roadmap

My next steps is make this more accessible for all to use rather than just my self. I would do this through figuring out a domain and making login screens with different access restrictions. I also would love to add an about the owner section to help put spotlight on the owner and how and why they got here. In future interations their will be information added about the business location.