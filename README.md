# Discover Durham

A hub for connecting me (and eventually more people) to Durham businesses of all kinds!

## Project Description

 A website that allows people to store and rate local Durham businesses. Utilizing Node.JS and SelevteKit, the system will allow for people to input places they been to, adding it to a larger depository, that will allow users to filter based on the owner of the business (wip), kind of business or the star rating. I vaguely want this to model something in between yelp and wikipedia (as of right now as there’s not enough time to make a full fledge product with login + profiles). This system will also connect to MongoDB for easy access of all information on a public domain.

## Target Audience and Motivation

This idea originated from work last semester with the black community on Fayetteville street in Durham. A lot of these businesses do amazing work but don’t have the platform to get out there and connect with more people outside of Durham or even local colleges. Being a student at Duke I notice that it is a struggle point for us as students to learn more about durham and  a struggle point of the university giving visibility to Durham. I want to provide a way for all of us to be more connected and through this creation, I hope to spark ideas for future involvement with Durham, specifically from big names like Duke. How can we continue to enligten people about the beautiful community around them whilst also pushing forward community? Hopefully with this application the target audience, durham natives and temporary residences, are able to start doing more of both.

## Human-Centered Design Analysis




## Installation

You need Node.js to run this project.

    # Clone the repo
    git@github.com:larkspurjohn-gif/midtermProj.git
    cd trial-on

    # Install dependencies
    npm install

    # Start the development server
    npm run dev

## Usage

Admin side is used to CRUD (Create, Read, Update, Delete) business information. It features a graph to keep track of how many businesses are under each rating but this might change later on to how many of each what business type as that could be more important to see (maybe having both views would be nice).

On the home side, it is a view only simplfied version of the CRUD as it shows you all the same information but in an easy digestable way for people to see it. This also includes filiter buttons for star ratings and business types so you can see the worse of the worse and best of the best.

## License

Private

## Acknowledgements

Thank you to the glourious people that are behind SvelteKit, Node.Js, MongoDB!
My inspirations for this project came primarly from Yelp and my Notion Board, shoutout to them!

Svelte, HTML, CSS, and JavaScript were used in this project.

## Roadmap

My next steps is make this more accessible for all to use rather than just my self. I would do this through figuring out a domain and making login screens with different access restrictions. I also would love to add more filiter options making it easier to navigate. In future interations their will be more business information as well about each business added. Depending on if this is more blog style or not the non-admin side might allow creation of reviews as well.