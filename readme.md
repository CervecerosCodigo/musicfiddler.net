# [musicfiddler.net](http://musicfiddler.net)

*A project assignment for course WebProsjekt ITPE1200 @ HiOA*

## About

Music Fiddler is an content aggregator that provides news and information about all the hottest artist by using data from [last.fm](http://last.fm) and [Wikipedia](http://wikipedia.org).

## Project documentation

### Identifying the project

Utility can be a goal in it self. Groundbreaking new ideas that revolutionize the world is not easy to come up with, and most of the successful websites in the world are not groundbreaking, at least not initially. One want to provide utility for the target group, and in doing so developing the product into something that no one thought they needed until suddenly no one could get by without it.

The process of finding a realizable product for a school project has lots of constraints, time being the most limiting. A front end web project doesn't really end, where you can say "We are now finished and there is nothing else to fix or do." This has been quite important in our search for a good project. Having a clear scope for what we want to make, and keep it simple and good looking.

As students, and being young during the golden era of Internet we are flooded by online services. Many of the successful services and websites are the ones that are extensible by 3rd party developers. By not opening and API towards the general public you will not be able to attract interest from other influential parties in the "websphere". This can be bloggers, social media and more traditional media in general.

#### Learning goals

Being very technology minded and having programing and technical solutions as the goal for our future careers, we have been clear on the following learning goals:

- Make a cohesive website.
- Focus on technical aspects, without compromising user experience.
- Use Javascript to make a dynamic, user friendly website.
- Reusable CSS rules and good structure on HTMl and Javascript coding.

#### Narrowing down possibilities

Our take on the project was not to make the content ourselves but use some of the existing sources on the web, and make a website that provides more utility for the target group. This has several benefits that will be described further down in the documentation. It is not without drawbacks though, as we want to maintain a high level of content integrity, so that we don't just import lots of content without it having a strong relation to the rest of the page.

Existing data from other web services is not a very precise, and in our team discussions we discussed probably two dozen online services. Our primary objective was finding enough relevant data that would make a rich website. This means we were looking for text, images and other relevant information that are related to the primary content.

We believe that there will always be room for new types of information. Information that by itself makes sense and is useful, can be even more useful gathered and presented in one place.

#### Target group

Trying to get the whole world interested in curling (the sport) with a good web site is not possible, and in our discussions, this was an important aspect to be considered. Music sounded like a topic that almost all people can relate to, and having a broad target group, without trying too hard is a good thing, and it also has lots of existing sources on the web that we could use.

Because music is so widely used and enjoyed throughout the world we did not find it necessary to narrow it down to age groups or other types of demographics. One could argue that making a website for the younger population would require more adaptation with regards to the user interface compared to a older demographic, but this was intentionally not considered to be important for our website.

### The solution

Music Fiddler is a website that uses data from the following webservices:
- [Wikipedia](http://wikipedia.org): Extensive articles about artists
- [Last.fm](http://last.fm): Lists of top artists, albums and artist news

The website is trying to engage the user by being very minimalistic, and at the same time invite the user to click on the tiles that are presented. It's not immediately clear what should happen when you click it, and just a picture representing each artist is not revealing too much. We hope that this is will intrigue for other people also.

#### Scope of work

The limited time we are given makes the amount of functionality we can implement also less. We came to a point when we could not implement any more functionality and still maintain a certain level of good design and coherence.

We have left out several key parts of our original plans as a result of the time constraint. For instance we did not have time to implement Album information.

Last.fm does have a vast array of relevant data. Suggestions for similar artists to the one you're looking at, was one of the features we did implement, but dropped on recommendation from Anthony.

#### Technology and architecture

Javascript is used extensively throughout the solution. Ajax functions are getting data from the providers. They are running in Synchronous mode and not Async.. It was too complex to render the HTML before knowing which data that arrives through the API at a later time.

Being denied Jquery and other useful tools has been a blessing as knowledge of vanilla Javascript has been very valuable. Still, the functions are all freestanding, with out any controlling mechanism to provide updates in the view/html.

#### What does the solution offer?

Individually the two API's that are used are great examples of online services that are free for anyone to use. Still we found that combining them together would be beneficial, and the result is unlike what they can provide by them selves.

The website is analyzed with [Checker's eAvailability tool](http://checkers.eiii.eu/) and the score is 100% on all pages. It has been a conscious goal for us to follow WCAG2.0 and other guidelines to make a website that is easy to use for all people, no matter if you are healthy, or have some form of disability.

The website is scaling pretty well in lower resolutions. Laptops would be preferred viewing device but mobile phones should provide a good experience also. There is lots of data being pulled from the APIs so bandwidth is something that is a little bit concerning.

On a general note, this website is to be considered as an informational website, with no feedback forms, user interaction or similar. Not having a backend functionality has been limiting, and very few websites operates like this. The API keys are placed in Javascript files, and Javascript is doing all the API calls. Normally there should be backend service doing this job, and presenting data nicely through Json objects to the front end via RESTful api.
