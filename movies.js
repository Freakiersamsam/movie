// Movie database with difficulty ratings (1=easiest, 5=hardest)
// Difficulty based on cultural impact and general recognition
// All quotes are consecutive dialogue from actual scripts

const MOVIE_DATABASE = [
    // ============================================
    // DIFFICULTY 1 - EXTREMELY POPULAR BLOCKBUSTERS (36 films)
    // ============================================
    {
        title: "Titanic",
        year: "1997",
        actors: ["Kate Winslet", "Leonardo DiCaprio"],
        quotes: [
            "Jack, I'm flying!",
            "You're flying, Rose.",
        ],
        difficulty: 1
    },
    {
        title: "Star Wars",
        year: "1977",
        actors: ["Mark Hamill", "Alec Guinness"],
        quotes: [
            "I want to learn the ways of the Force and become a Jedi like my father.",
            "You must do what you feel is right, of course.",
        ],
        difficulty: 1
    },
    {
        title: "The Godfather",
        year: "1972",
        actors: ["Salvatore Corsitto", "Marlon Brando"],
        quotes: [
            "I believe in America.",
            "Why did you go to the police? Why didn't you come to me first?",
        ],
        difficulty: 1
    },
    {
        title: "Forrest Gump",
        year: "1994",
        actors: ["Tom Hanks", "Sally Field"],
        quotes: [
            "My mama always said life was like a box of chocolates. You never know what you're gonna get.",
            "Run, Forrest! Run!",
        ],
        difficulty: 1
    },
    {
        title: "The Lion King",
        year: "1994",
        actors: ["Nathan Lane", "Jeremy Irons"],
        quotes: [
            "Hakuna Matata. It means no worries.",
            "Long live the King.",
        ],
        difficulty: 1
    },
    {
        title: "Jurassic Park",
        year: "1993",
        actors: ["Jeff Goldblum", "Richard Attenborough"],
        quotes: [
            "Life finds a way.",
            "Welcome to Jurassic Park.",
        ],
        difficulty: 1
    },
    {
        title: "The Matrix",
        year: "1999",
        actors: ["Keanu Reeves", "Laurence Fishburne"],
        quotes: [
            "I know kung fu.",
            "Show me.",
        ],
        difficulty: 1
    },
    {
        title: "Jaws",
        year: "1975",
        actors: ["Robert Shaw", "Roy Scheider"],
        quotes: [
            "Here's to swimmin' with bow-legged women.",
            "I'll drink to that.",
        ],
        difficulty: 1
    },
    {
        title: "Harry Potter and the Sorcerer's Stone",
        year: "2001",
        actors: ["Robbie Coltrane", "Daniel Radcliffe"],
        quotes: [
            "You're a wizard, Harry.",
            "I'm a what?",
        ],
        difficulty: 1
    },
    {
        title: "The Avengers",
        year: "2012",
        actors: ["Mark Ruffalo", "Robert Downey Jr."],
        quotes: [
            "I'm always angry.",
            "We have a Hulk.",
        ],
        difficulty: 1
    },
    {
        title: "The Wizard of Oz",
        year: "1939",
        actors: ["Judy Garland", "Billie Burke"],
        quotes: [
            "Toto, I've a feeling we're not in Kansas anymore.",
            "Are you a good witch or a bad witch?",
        ],
        difficulty: 1
    },
    {
        title: "E.T. the Extra-Terrestrial",
        year: "1982",
        actors: ["Henry Thomas", "E.T."],
        quotes: [
            "E.T. phone home.",
            "And they'll come?",
        ],
        difficulty: 1
    },
    {
        title: "The Lord of the Rings: The Fellowship of the Ring",
        year: "2001",
        actors: ["Elijah Wood", "Ian McKellen"],
        quotes: [
            "I wish the Ring had never come to me.",
            "So do all who live to see such times, but that is not for them to decide.",
        ],
        difficulty: 1
    },
    {
        title: "Toy Story",
        year: "1995",
        actors: ["Tom Hanks", "Tim Allen"],
        quotes: [
            "To infinity and beyond!",
            "That wasn't flying. That was falling with style.",
        ],
        difficulty: 1
    },
    {
        title: "The Empire Strikes Back",
        year: "1980",
        actors: ["James Earl Jones", "Mark Hamill"],
        quotes: [
            "No, I am your father.",
            "No. No! That's not true! That's impossible!",
        ],
        difficulty: 1
    },
    {
        title: "Avatar",
        year: "2009",
        actors: ["Sam Worthington", "Zoe Saldana"],
        quotes: [
            "I see you.",
            "I see you too.",
        ],
        difficulty: 1
    },
    {
        title: "The Dark Knight Rises",
        year: "2012",
        actors: ["Tom Hardy", "Christian Bale"],
        quotes: [
            "No one cared who I was until I put on the mask.",
            "If I pull that off, will you die?",
        ],
        difficulty: 1
    },
    {
        title: "Raiders of the Lost Ark",
        year: "1981",
        actors: ["Harrison Ford", "Karen Allen"],
        quotes: [
            "It's not the years, honey. It's the mileage.",
            "I can't believe you're the same girl.",
        ],
        difficulty: 1
    },
    {
        title: "Spider-Man",
        year: "2002",
        actors: ["Tobey Maguire", "Cliff Robertson"],
        quotes: [
            "With great power comes great responsibility.",
            "Remember that, Peter. Remember that.",
        ],
        difficulty: 1
    },
    {
        title: "Frozen",
        year: "2013",
        actors: ["Idina Menzel", "Kristen Bell"],
        quotes: [
            "Let it go! Let it go!",
            "Elsa!",
        ],
        difficulty: 1
    },
    {
        title: "Finding Nemo",
        year: "2003",
        actors: ["Albert Brooks", "Alexander Gould"],
        quotes: [
            "Just keep swimming. Just keep swimming.",
            "Dad, I don't think that's helping.",
        ],
        difficulty: 1
    },
    {
        title: "Shrek",
        year: "2001",
        actors: ["Mike Myers", "Eddie Murphy"],
        quotes: [
            "Ogres are like onions.",
            "They stink?",
        ],
        difficulty: 1
    },
    {
        title: "Iron Man",
        year: "2008",
        actors: ["Robert Downey Jr.", "Gwyneth Paltrow"],
        quotes: [
            "I am Iron Man.",
            "You've always been Iron Man.",
        ],
        difficulty: 1
    },
    {
        title: "Gladiator",
        year: "2000",
        actors: ["Russell Crowe", "Joaquin Phoenix"],
        quotes: [
            "My name is Maximus Decimus Meridius.",
            "And I will have my vengeance, in this life or the next.",
        ],
        difficulty: 1
    },
    {
        title: "The Sixth Sense",
        year: "1999",
        actors: ["Haley Joel Osment", "Bruce Willis"],
        quotes: [
            "I see dead people.",
            "In your dreams?",
        ],
        difficulty: 1
    },
    {
        title: "Inception",
        year: "2010",
        actors: ["Leonardo DiCaprio", "Ellen Page"],
        quotes: [
            "What's the most resilient parasite?",
            "An idea.",
        ],
        difficulty: 1
    },
    {
        title: "The Hunger Games",
        year: "2012",
        actors: ["Jennifer Lawrence", "Josh Hutcherson"],
        quotes: [
            "May the odds be ever in your favor.",
            "I volunteer! I volunteer as tribute!",
        ],
        difficulty: 1
    },
    {
        title: "Black Panther",
        year: "2018",
        actors: ["Chadwick Boseman", "Michael B. Jordan"],
        quotes: [
            "Wakanda forever!",
            "Is this your king?",
        ],
        difficulty: 1
    },
    {
        title: "Avengers: Endgame",
        year: "2019",
        actors: ["Robert Downey Jr.", "Chris Evans"],
        quotes: [
            "I am Iron Man.",
            "Avengers, assemble!",
        ],
        difficulty: 1
    },
    {
        title: "The Incredibles",
        year: "2004",
        actors: ["Craig T. Nelson", "Holly Hunter"],
        quotes: [
            "Where is my super suit?",
            "What?",
        ],
        difficulty: 1
    },
    {
        title: "Toy Story 3",
        year: "2010",
        actors: ["Tom Hanks", "Tim Allen"],
        quotes: [
            "So long, partner.",
            "To infinity and beyond!",
        ],
        difficulty: 1
    },
    {
        title: "Rocky",
        year: "1976",
        actors: ["Sylvester Stallone", "Talia Shire"],
        quotes: [
            "Yo, Adrian!",
            "I love you!",
        ],
        difficulty: 1
    },
    {
        title: "Aladdin",
        year: "1992",
        actors: ["Scott Weinger", "Linda Larkin"],
        quotes: [
            "Do you trust me?",
            "Yes.",
        ],
        difficulty: 1
    },
    {
        title: "Dumb and Dumber",
        year: "1994",
        actors: ["Jim Carrey", "Lauren Holly"],
        quotes: [
            "I got worms.",
            "I beg your pardon?",
        ],
        difficulty: 1
    },
    {
        title: "The Mask",
        year: "1994",
        actors: ["Jim Carrey", "Cameron Diaz"],
        quotes: [
            "You are a rug. I am talking astro-turf here.",
            "Hey, I'm a gentleman. If they can't appreciate that, it's their problem.",
        ],
        difficulty: 1
    },
    {
        title: "Ace Ventura: Pet Detective",
        year: "1994",
        actors: ["Jim Carrey", "Courteney Cox"],
        quotes: [
            "Get out of the tank.",
            "Can't hear you Flipper, Flipper... gotta find Flipper",
        ],
        difficulty: 1
    },

    // ============================================
    // DIFFICULTY 2 - VERY POPULAR & WELL-KNOWN (111 films)
    // ============================================
    {
        title: "Casablanca",
        year: "1942",
        actors: ["Dooley Wilson", "Humphrey Bogart"],
        quotes: [
            "Boss, ain't you going to bed?",
            "Not right now.",
        ],
        difficulty: 2
    },
    {
        title: "The Shawshank Redemption",
        year: "1994",
        actors: ["Morgan Freeman", "Tim Robbins"],
        quotes: [
            "Get busy living, or get busy dying.",
            "Hope is a good thing, maybe the best of things.",
        ],
        difficulty: 2
    },
    {
        title: "Pulp Fiction",
        year: "1994",
        actors: ["John Travolta", "Samuel L. Jackson"],
        quotes: [
            "They call it a Royale with Cheese.",
            "Royale with Cheese. What do they call a Big Mac?",
        ],
        difficulty: 2
    },
    {
        title: "The Dark Knight",
        year: "2008",
        actors: ["Heath Ledger", "Christian Bale"],
        quotes: [
            "Why so serious?",
            "Let's put a smile on that face!",
        ],
        difficulty: 2
    },
    {
        title: "Fight Club",
        year: "1999",
        actors: ["Brad Pitt", "Edward Norton"],
        quotes: [
            "The first rule of Fight Club is: you do not talk about Fight Club.",
            "I am Jack's complete lack of surprise.",
        ],
        difficulty: 2
    },
    {
        title: "The Terminator",
        year: "1984",
        actors: ["Arnold Schwarzenegger", "Michael Biehn"],
        quotes: [
            "I'll be back.",
            "Come with me if you want to live.",
        ],
        difficulty: 2
    },
    {
        title: "Back to the Future",
        year: "1985",
        actors: ["Michael J. Fox", "Christopher Lloyd"],
        quotes: [
            "Wait a minute, Doc. Are you telling me you built a time machine out of a DeLorean?",
            "The way I see it, if you're gonna build a time machine into a car, why not do it with some style?",
        ],
        difficulty: 2
    },
    {
        title: "The Silence of the Lambs",
        year: "1991",
        actors: ["Jodie Foster", "Anthony Hopkins"],
        quotes: [
            "If you didn't kill him, then who did, sir?",
            "Who can say? Best thing for him, really. His therapy was going nowhere.",
        ],
        difficulty: 2
    },
    {
        title: "Schindler's List",
        year: "1993",
        actors: ["Liam Neeson", "Ben Kingsley"],
        quotes: [
            "I could have got more out. I could have got more.",
            "Oskar, there are eleven hundred people who are alive because of you.",
        ],
        difficulty: 2
    },
    {
        title: "Goodfellas",
        year: "1990",
        actors: ["Ray Liotta", "Robert De Niro"],
        quotes: [
            "As far back as I can remember, I always wanted to be a gangster.",
            "You know why you went to the can? You went to the can because you didn't have the balls.",
        ],
        difficulty: 2
    },
    {
        title: "The Green Mile",
        year: "1999",
        actors: ["Tom Hanks", "Michael Clarke Duncan"],
        quotes: [
            "I'm tired, boss.",
            "You and me both, John.",
        ],
        difficulty: 2
    },
    {
        title: "Saving Private Ryan",
        year: "1998",
        actors: ["Tom Hanks", "Matt Damon"],
        quotes: [
            "Earn this.",
            "Yes, sir.",
        ],
        difficulty: 2
    },
    {
        title: "The Departed",
        year: "2006",
        actors: ["Leonardo DiCaprio", "Matt Damon"],
        quotes: [
            "I'm the guy who does his job. You must be the other guy.",
            "Maybe. Maybe not. Maybe fuck yourself.",
        ],
        difficulty: 2
    },
    {
        title: "The Prestige",
        year: "2006",
        actors: ["Christian Bale", "Hugh Jackman"],
        quotes: [
            "Are you watching closely?",
            "Every magic trick consists of three parts.",
        ],
        difficulty: 2
    },
    {
        title: "Memento",
        year: "2000",
        actors: ["Guy Pearce", "Carrie-Anne Moss"],
        quotes: [
            "I have to believe in a world outside my own mind.",
            "What's the last thing you remember?",
        ],
        difficulty: 2
    },
    {
        title: "The Usual Suspects",
        year: "1995",
        actors: ["Kevin Spacey", "Chazz Palminteri"],
        quotes: [
            "The greatest trick the Devil ever pulled was convincing the world he didn't exist.",
            "And like that... he's gone.",
        ],
        difficulty: 2
    },
    {
        title: "Seven",
        year: "1995",
        actors: ["Brad Pitt", "Morgan Freeman"],
        quotes: [
            "What's in the box?",
            "Nothing you need to see.",
        ],
        difficulty: 2
    },
    {
        title: "The Truman Show",
        year: "1998",
        actors: ["Jim Carrey", "Ed Harris"],
        quotes: [
            "Good morning! And in case I don't see you, good afternoon, good evening, and good night!",
            "We accept the reality of the world with which we're presented.",
        ],
        difficulty: 2
    },
    {
        title: "American Beauty",
        year: "1999",
        actors: ["Kevin Spacey", "Annette Bening"],
        quotes: [
            "I'm just an ordinary guy with nothing to lose.",
            "You don't get to tell me what to do ever again.",
        ],
        difficulty: 2
    },
    {
        title: "The Social Network",
        year: "2010",
        actors: ["Jesse Eisenberg", "Andrew Garfield"],
        quotes: [
            "I'm CEO, bitch.",
            "Is he allowed to do that?",
        ],
        difficulty: 2
    },
    {
        title: "Interstellar",
        year: "2014",
        actors: ["Matthew McConaughey", "Anne Hathaway"],
        quotes: [
            "We used to look up at the sky and wonder at our place in the stars.",
            "Now we just look down and worry about our place in the dirt.",
        ],
        difficulty: 2
    },
    {
        title: "Mad Max: Fury Road",
        year: "2015",
        actors: ["Tom Hardy", "Charlize Theron"],
        quotes: [
            "What a lovely day!",
            "We are not things!",
        ],
        difficulty: 2
    },
    {
        title: "Django Unchained",
        year: "2012",
        actors: ["Jamie Foxx", "Christoph Waltz"],
        quotes: [
            "The D is silent.",
            "I know.",
        ],
        difficulty: 2
    },
    {
        title: "No Country for Old Men",
        year: "2007",
        actors: ["Javier Bardem", "Woody Harrelson"],
        quotes: [
            "What's the most you ever lost on a coin toss?",
            "Sir?",
        ],
        difficulty: 2
    },
    {
        title: "There Will Be Blood",
        year: "2007",
        actors: ["Daniel Day-Lewis", "Paul Dano"],
        quotes: [
            "I drink your milkshake!",
            "I drink it up!",
        ],
        difficulty: 2
    },
    {
        title: "Whiplash",
        year: "2014",
        actors: ["J.K. Simmons", "Miles Teller"],
        quotes: [
            "Not quite my tempo.",
            "Were you rushing or were you dragging?",
        ],
        difficulty: 2
    },
    {
        title: "Parasite",
        year: "2019",
        actors: ["Song Kang-ho", "Lee Sun-kyun"],
        quotes: [
            "You know what kind of plan never fails?",
            "No plan at all.",
        ],
        difficulty: 2
    },
    {
        title: "Get Out",
        year: "2017",
        actors: ["Daniel Kaluuya", "Allison Williams"],
        quotes: [
            "I would have voted for Obama for a third term if I could.",
            "Do they know I'm black?",
        ],
        difficulty: 2
    },
    {
        title: "The Grand Budapest Hotel",
        year: "2014",
        actors: ["Ralph Fiennes", "Tony Revolori"],
        quotes: [
            "You see, there are still faint glimmers of civilization left in this barbaric slaughterhouse.",
            "Indeed, sir.",
        ],
        difficulty: 2
    },
    {
        title: "Slumdog Millionaire",
        year: "2008",
        actors: ["Dev Patel", "Freida Pinto"],
        quotes: [
            "When somebody asks me a question, I tell them the answer.",
            "This is your destiny.",
        ],
        difficulty: 2
    },
    {
        title: "The King's Speech",
        year: "2010",
        actors: ["Colin Firth", "Geoffrey Rush"],
        quotes: [
            "I have a voice!",
            "Yes, you do.",
        ],
        difficulty: 2
    },
    {
        title: "A Beautiful Mind",
        year: "2001",
        actors: ["Russell Crowe", "Jennifer Connelly"],
        quotes: [
            "I need to believe that something extraordinary is possible.",
            "You are all I want.",
        ],
        difficulty: 2
    },
    {
        title: "The Revenant",
        year: "2015",
        actors: ["Leonardo DiCaprio", "Tom Hardy"],
        quotes: [
            "I ain't afraid to die anymore.",
            "I was just doing my job.",
        ],
        difficulty: 2
    },
    {
        title: "La La Land",
        year: "2016",
        actors: ["Ryan Gosling", "Emma Stone"],
        quotes: [
            "Here's to the ones who dream.",
            "Foolish as they may seem.",
        ],
        difficulty: 2
    },
    {
        title: "Moonlight",
        year: "2016",
        actors: ["Mahershala Ali", "Ashton Sanders"],
        quotes: [
            "At some point, you gotta decide for yourself who you're going to be.",
            "Can't let nobody make that decision for you.",
        ],
        difficulty: 2
    },
    {
        title: "The Breakfast Club",
        year: "1985",
        actors: ["Judd Nelson", "Molly Ringwald"],
        quotes: [
            "Does Barry Manilow know you raid his wardrobe?",
            "We're all pretty bizarre. Some of us are just better at hiding it.",
        ],
        difficulty: 2
    },
    {
        title: "Ferris Bueller's Day Off",
        year: "1986",
        actors: ["Matthew Broderick", "Alan Ruck"],
        quotes: [
            "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it.",
            "Ferris, my father loves this car more than life itself.",
        ],
        difficulty: 2
    },
    {
        title: "Ghostbusters",
        year: "1984",
        actors: ["Bill Murray", "Dan Aykroyd"],
        quotes: [
            "Who you gonna call?",
            "Ghostbusters!",
        ],
        difficulty: 2
    },
    {
        title: "Home Alone",
        year: "1990",
        actors: ["Macaulay Culkin", "Joe Pesci"],
        quotes: [
            "Keep the change, ya filthy animal!",
            "Merry Christmas, ya filthy animal!",
        ],
        difficulty: 2
    },
    {
        title: "Mrs. Doubtfire",
        year: "1993",
        actors: ["Robin Williams", "Sally Field"],
        quotes: [
            "It was a run-by fruiting!",
            "Helloooo!",
        ],
        difficulty: 2
    },
    {
        title: "Die Hard",
        year: "1988",
        actors: ["Bruce Willis", "Alan Rickman"],
        quotes: [
            "Yippee-ki-yay, motherfucker.",
            "Now I have a machine gun. Ho ho ho.",
        ],
        difficulty: 2
    },
    {
        title: "The Fugitive",
        year: "1993",
        actors: ["Harrison Ford", "Tommy Lee Jones"],
        quotes: [
            "I didn't kill my wife!",
            "I don't care!",
        ],
        difficulty: 2
    },
    {
        title: "Apollo 13",
        year: "1995",
        actors: ["Tom Hanks", "Kevin Bacon"],
        quotes: [
            "Houston, we have a problem.",
            "Roger that. We see you venting.",
        ],
        difficulty: 2
    },
    {
        title: "Braveheart",
        year: "1995",
        actors: ["Mel Gibson", "Sophie Marceau"],
        quotes: [
            "They may take our lives, but they'll never take our freedom!",
            "Every man dies. Not every man really lives.",
        ],
        difficulty: 2
    },
    {
        title: "The Rock",
        year: "1996",
        actors: ["Sean Connery", "Nicolas Cage"],
        quotes: [
            "Welcome to the Rock.",
            "I'd take pleasure in guttin' you, boy.",
        ],
        difficulty: 2
    },
    {
        title: "Independence Day",
        year: "1996",
        actors: ["Bill Pullman", "Jeff Goldblum"],
        quotes: [
            "Today, we celebrate our Independence Day!",
            "Must go faster. Must go faster!",
        ],
        difficulty: 2
    },
    {
        title: "Men in Black",
        year: "1997",
        actors: ["Will Smith", "Tommy Lee Jones"],
        quotes: [
            "Here come the Men in Black!",
            "A person is smart. People are dumb, panicky dangerous animals.",
        ],
        difficulty: 2
    },
    {
        title: "The Fifth Element",
        year: "1997",
        actors: ["Bruce Willis", "Milla Jovovich"],
        quotes: [
            "Multipass!",
            "Leeloo Dallas, multipass.",
        ],
        difficulty: 2
    },
    {
        title: "American History X",
        year: "1998",
        actors: ["Edward Norton", "Edward Furlong"],
        quotes: [
            "Has anything you've done made your life better?",
            "I've been going to this place all my life.",
        ],
        difficulty: 2
    },
    {
        title: "The Big Lebowski",
        year: "1998",
        actors: ["Jeff Bridges", "John Goodman"],
        quotes: [
            "Yeah, well, that's just like, your opinion, man.",
            "This is what happens when you fuck a stranger in the ass!",
        ],
        difficulty: 2
    },
    {
        title: "American Pie",
        year: "1999",
        actors: ["Jason Biggs", "Chris Klein"],
        quotes: [
            "This one time, at band camp...",
            "I had sex with Michelle!",
        ],
        difficulty: 2
    },
    {
        title: "The Mummy",
        year: "1999",
        actors: ["Brendan Fraser", "Rachel Weisz"],
        quotes: [
            "You must not read from the book!",
            "We are in serious trouble.",
        ],
        difficulty: 2
    },
    {
        title: "Cast Away",
        year: "2000",
        actors: ["Tom Hanks", "Wilson"],
        quotes: [
            "Wilson! Wilson!",
            "I'm sorry, Wilson!",
        ],
        difficulty: 2
    },
    {
        title: "Erin Brockovich",
        year: "2000",
        actors: ["Julia Roberts", "Albert Finney"],
        quotes: [
            "They're called boobs, Ed.",
            "I noticed.",
        ],
        difficulty: 2
    },
    {
        title: "Catch Me If You Can",
        year: "2002",
        actors: ["Leonardo DiCaprio", "Tom Hanks"],
        quotes: [
            "Two little mice fell in a bucket of cream.",
            "The first mouse quickly gave up and drowned.",
        ],
        difficulty: 2
    },
    {
        title: "The Bourne Identity",
        year: "2002",
        actors: ["Matt Damon", "Franka Potente"],
        quotes: [
            "I can tell you the license plate numbers of all six cars outside.",
            "I can tell you that our waitress is left-handed.",
        ],
        difficulty: 2
    },
    {
        title: "Pirates of the Caribbean: The Curse of the Black Pearl",
        year: "2003",
        actors: ["Johnny Depp", "Orlando Bloom"],
        quotes: [
            "Why is the rum always gone?",
            "This is the day you will always remember as the day you almost caught Captain Jack Sparrow!",
        ],
        difficulty: 2
    },
    {
        title: "Kill Bill: Vol. 1",
        year: "2003",
        actors: ["Uma Thurman", "Lucy Liu"],
        quotes: [
            "Silly rabbit. Trix are for kids.",
            "Do you still want to kill me?",
        ],
        difficulty: 2
    },
    {
        title: "Eternal Sunshine of the Spotless Mind",
        year: "2004",
        actors: ["Jim Carrey", "Kate Winslet"],
        quotes: [
            "Meet me in Montauk.",
            "Okay.",
        ],
        difficulty: 2
    },
    {
        title: "300",
        year: "2006",
        actors: ["Gerard Butler", "Lena Headey"],
        quotes: [
            "This is Sparta!",
            "Tonight we dine in hell!",
        ],
        difficulty: 2
    },
    {
        title: "Superbad",
        year: "2007",
        actors: ["Jonah Hill", "Michael Cera"],
        quotes: [
            "McLovin? What kind of stupid name is that?",
            "People don't forget!",
        ],
        difficulty: 2
    },
    {
        title: "Juno",
        year: "2007",
        actors: ["Ellen Page", "Michael Cera"],
        quotes: [
            "That ain't no Etch-a-Sketch. This is one doodle that can't be undid.",
            "Honest to blog?",
        ],
        difficulty: 2
    },
    {
        title: "The Hangover",
        year: "2009",
        actors: ["Bradley Cooper", "Zach Galifianakis"],
        quotes: [
            "What happens in Vegas stays in Vegas.",
            "Except herpes. That shit'll come back with you.",
        ],
        difficulty: 2
    },
    {
        title: "District 9",
        year: "2009",
        actors: ["Sharlto Copley", "Jason Cope"],
        quotes: [
            "Get your fookin' tentacle out of my face!",
            "This is my district!",
        ],
        difficulty: 2
    },
    {
        title: "Up",
        year: "2009",
        actors: ["Ed Asner", "Jordan Nagai"],
        quotes: [
            "Adventure is out there!",
            "It's just a house.",
        ],
        difficulty: 2
    },
    {
        title: "127 Hours",
        year: "2010",
        actors: ["James Franco", "Amber Tamblyn"],
        quotes: [
            "This rock has been waiting for me my entire life.",
            "I chose this. I chose all of this.",
        ],
        difficulty: 2
    },
    {
        title: "The Help",
        year: "2011",
        actors: ["Viola Davis", "Emma Stone"],
        quotes: [
            "You is kind. You is smart. You is important.",
            "Eat my shit.",
        ],
        difficulty: 2
    },
    {
        title: "Drive",
        year: "2011",
        actors: ["Ryan Gosling", "Carey Mulligan"],
        quotes: [
            "I drive.",
            "That's what you do?",
        ],
        difficulty: 2
    },
    {
        title: "The Wolf of Wall Street",
        year: "2013",
        actors: ["Leonardo DiCaprio", "Jonah Hill"],
        quotes: [
            "I'm not leaving! I'm not fucking leaving!",
            "The show goes on!",
        ],
        difficulty: 2
    },
    {
        title: "Gravity",
        year: "2013",
        actors: ["Sandra Bullock", "George Clooney"],
        quotes: [
            "I hate space.",
            "What do you hate about it?",
        ],
        difficulty: 2
    },
    {
        title: "Gone Girl",
        year: "2014",
        actors: ["Ben Affleck", "Rosamund Pike"],
        quotes: [
            "I'm the cunt you married.",
            "The only time you liked yourself was when you were trying to be someone this cunt might like.",
        ],
        difficulty: 2
    },
    {
        title: "Birdman",
        year: "2014",
        actors: ["Michael Keaton", "Edward Norton"],
        quotes: [
            "Popularity is the slutty little cousin of prestige.",
            "I'm not here to be liked. I'm here to be respected.",
        ],
        difficulty: 2
    },
    {
        title: "Ex Machina",
        year: "2014",
        actors: ["Domhnall Gleeson", "Oscar Isaac"],
        quotes: [
            "One day the AIs are going to look back on us the same way we look at fossil skeletons.",
            "Isn't it strange, to create something that hates you?",
        ],
        difficulty: 2
    },
    {
        title: "Room",
        year: "2015",
        actors: ["Brie Larson", "Jacob Tremblay"],
        quotes: [
            "I want to be five.",
            "You are five.",
        ],
        difficulty: 2
    },
    {
        title: "Arrival",
        year: "2016",
        actors: ["Amy Adams", "Jeremy Renner"],
        quotes: [
            "Language is the first weapon drawn in a conflict.",
            "If you could see your whole life from start to finish, would you change things?",
        ],
        difficulty: 2
    },
    {
        title: "Dunkirk",
        year: "2017",
        actors: ["Fionn Whitehead", "Tom Hardy"],
        quotes: [
            "All we did is survive.",
            "That's enough.",
        ],
        difficulty: 2
    },
    {
        title: "Three Billboards Outside Ebbing, Missouri",
        year: "2017",
        actors: ["Frances McDormand", "Woody Harrelson"],
        quotes: [
            "Raped while dying.",
            "And still no arrests?",
        ],
        difficulty: 2
    },
    {
        title: "A Quiet Place",
        year: "2018",
        actors: ["Emily Blunt", "John Krasinski"],
        quotes: [
            "Who are we if we can't protect them?",
            "We protect them by teaching them.",
        ],
        difficulty: 2
    },
    {
        title: "Joker",
        year: "2019",
        actors: ["Joaquin Phoenix", "Robert De Niro"],
        quotes: [
            "Is it just me, or is it getting crazier out there?",
            "You get what you fucking deserve!",
        ],
        difficulty: 2
    },
    {
        title: "1917",
        year: "2019",
        actors: ["George MacKay", "Dean-Charles Chapman"],
        quotes: [
            "There is only one way this war ends. Last man standing.",
            "I hope you're right.",
        ],
        difficulty: 2
    },
    {
        title: "Trainspotting",
        year: "1996",
        actors: ["Ewan McGregor", "Ewan McGregor"],
        quotes: [
            "Choose life.",
            "Choose a job. Choose a career. Choose a family.",
        ],
        difficulty: 2
    },
    {
        title: "V for Vendetta",
        year: "2005",
        actors: ["Hugo Weaving", "Natalie Portman"],
        quotes: [
            "Remember, remember, the fifth of November.",
            "People should not be afraid of their governments. Governments should be afraid of their people.",
        ],
        difficulty: 2
    },
    {
        title: "Elf",
        year: "2003",
        actors: ["Will Ferrell", "James Caan"],
        quotes: [
            "The best way to spread Christmas cheer is singing loud for all to hear.",
            "Santa! I know him!",
        ],
        difficulty: 2
    },
    {
        title: "Anchorman",
        year: "2004",
        actors: ["Will Ferrell", "Christina Applegate"],
        quotes: [
            "I'm kind of a big deal.",
            "Really.",
        ],
        difficulty: 2
    },
    {
        title: "Step Brothers",
        year: "2008",
        actors: ["Will Ferrell", "John C. Reilly"],
        quotes: [
            "Did we just become best friends?",
            "Yep!",
        ],
        difficulty: 2
    },
    {
        title: "Bridesmaids",
        year: "2011",
        actors: ["Kristen Wiig", "Maya Rudolph"],
        quotes: [
            "Help me, I'm poor.",
            "You're your problem and you're also your solution.",
        ],
        difficulty: 2
    },
    {
        title: "Good Morning, Vietnam",
        year: "1987",
        actors: ["Robin Williams", "Forest Whitaker"],
        quotes: [
            "Good morning, Vietnam!",
            "What's the matter, nothing to say?",
        ],
        difficulty: 2
    },
    {
        title: "Top Gun",
        year: "1986",
        actors: ["Tom Cruise", "Val Kilmer"],
        quotes: [
            "I feel the need... the need for speed!",
            "You can be my wingman anytime.",
        ],
        difficulty: 2
    },
    {
        title: "Jerry Maguire",
        year: "1996",
        actors: ["Tom Cruise", "Cuba Gooding Jr."],
        quotes: [
            "Show me the money!",
            "You had me at hello.",
        ],
        difficulty: 2
    },
    {
        title: "As Good as It Gets",
        year: "1997",
        actors: ["Jack Nicholson", "Helen Hunt"],
        quotes: [
            "You make me want to be a better man.",
            "That's maybe the best compliment of my life.",
        ],
        difficulty: 2
    },
    {
        title: "The Notebook",
        year: "2004",
        actors: ["Ryan Gosling", "Rachel McAdams"],
        quotes: [
            "If you're a bird, I'm a bird.",
            "It wasn't over. It still isn't over!",
        ],
        difficulty: 2
    },
    {
        title: "500 Days of Summer",
        year: "2009",
        actors: ["Joseph Gordon-Levitt", "Zooey Deschanel"],
        quotes: [
            "I love how she makes me feel, like anything's possible.",
            "This is me accepting the hurt.",
        ],
        difficulty: 2
    },
    {
        title: "Silver Linings Playbook",
        year: "2012",
        actors: ["Bradley Cooper", "Jennifer Lawrence"],
        quotes: [
            "There's always gonna be a part of me that's sloppy and dirty.",
            "But I like that.",
        ],
        difficulty: 2
    },
    {
        title: "Little Miss Sunshine",
        year: "2006",
        actors: ["Abigail Breslin", "Greg Kinnear"],
        quotes: [
            "Do what you love and fuck the rest.",
            "You're not a loser.",
        ],
        difficulty: 2
    },
    {
        title: "Life of Pi",
        year: "2012",
        actors: ["Suraj Sharma", "Irrfan Khan"],
        quotes: [
            "I must say a word about fear.",
            "It is life's only true opponent.",
        ],
        difficulty: 2
    },
    {
        title: "Her",
        year: "2013",
        actors: ["Joaquin Phoenix", "Scarlett Johansson"],
        quotes: [
            "Sometimes I think I have felt everything I'm ever gonna feel.",
            "And from here on out, I'm not gonna feel anything new.",
        ],
        difficulty: 2
    },
    {
        title: "Blade Runner 2049",
        year: "2017",
        actors: ["Ryan Gosling", "Harrison Ford"],
        quotes: [
            "I know what's real.",
            "You do?",
        ],
        difficulty: 2
    },
    {
        title: "Sicario",
        year: "2015",
        actors: ["Emily Blunt", "Benicio del Toro"],
        quotes: [
            "You should move to a small town, where the rule of law still exists.",
            "You're asking me how a watch is made. For now, just keep an eye on the time.",
        ],
        difficulty: 2
    },
    {
        title: "Prisoners",
        year: "2013",
        actors: ["Hugh Jackman", "Jake Gyllenhaal"],
        quotes: [
            "Pray for the best, but prepare for the worst.",
            "We're gonna find them.",
        ],
        difficulty: 2
    },
    {
        title: "Edge of Tomorrow",
        year: "2014",
        actors: ["Tom Cruise", "Emily Blunt"],
        quotes: [
            "Come find me when you wake up.",
            "On your feet, maggot!",
        ],
        difficulty: 2
    },
    {
        title: "Baby Driver",
        year: "2017",
        actors: ["Ansel Elgort", "Kevin Spacey"],
        quotes: [
            "I was just listening to some music.",
            "Was it, uh, was it Debora?",
        ],
        difficulty: 2
    },
    {
        title: "Scott Pilgrim vs. the World",
        year: "2010",
        actors: ["Michael Cera", "Mary Elizabeth Winstead"],
        quotes: [
            "Bread makes you fat?",
            "Bread makes you fat.",
        ],
        difficulty: 2
    },
    {
        title: "Zombieland",
        year: "2009",
        actors: ["Jesse Eisenberg", "Woody Harrelson"],
        quotes: [
            "Time to nut up or shut up.",
            "I'm not easy to get along with.",
        ],
        difficulty: 2
    },
    {
        title: "Shaun of the Dead",
        year: "2004",
        actors: ["Simon Pegg", "Nick Frost"],
        quotes: [
            "You've got red on you.",
            "We're coming to get you, Barbara.",
        ],
        difficulty: 2
    },
    {
        title: "Hot Fuzz",
        year: "2007",
        actors: ["Simon Pegg", "Nick Frost"],
        quotes: [
            "For the greater good.",
            "The greater good.",
        ],
        difficulty: 2
    },
    {
        title: "21 Jump Street",
        year: "2012",
        actors: ["Jonah Hill", "Channing Tatum"],
        quotes: [
            "We're reviving a canceled undercover police program from the '80s.",
            "And revamping it for modern times.",
        ],
        difficulty: 2
    },
    {
        title: "The Other Guys",
        year: "2010",
        actors: ["Will Ferrell", "Mark Wahlberg"],
        quotes: [
            "Aim for the bushes.",
            "There goes my hero.",
        ],
        difficulty: 2
    },
    {
        title: "Zoolander",
        year: "2001",
        actors: ["Ben Stiller", "Owen Wilson"],
        quotes: [
            "What is this? A center for ants?",
            "But why male models?",
        ],
        difficulty: 2
    },
    {
        title: "Wedding Crashers",
        year: "2005",
        actors: ["Owen Wilson", "Vince Vaughn"],
        quotes: [
            "I almost numchucked you.",
            "You don't just chuck those around.",
        ],
        difficulty: 2
    },
    {
        title: "Knocked Up",
        year: "2007",
        actors: ["Seth Rogen", "Katherine Heigl"],
        quotes: [
            "I'm pregnant.",
            "Fuck off.",
        ],
        difficulty: 2
    },
    {
        title: "Groundhog Day",
        year: "1993",
        actors: ["Bill Murray", "Andie MacDowell"],
        quotes: [
            "There was a young man from Nantucket...",
            "That's really funny. When are you going to grow up?",
        ],
        difficulty: 2
    },

    // ============================================
    // DIFFICULTY 3 - CULT CLASSICS & FILM BUFF FAVORITES (47 films)
    // ============================================
    {
        title: "Taxi Driver",
        year: "1976",
        actors: ["Robert De Niro", "Robert De Niro"],
        quotes: [
            "You talkin' to me?",
            "You talkin' to me? You talkin' to me? Then who the hell else are you talkin' to?",
        ],
        difficulty: 3
    },
    {
        title: "A Few Good Men",
        year: "1992",
        actors: ["Tom Cruise", "Jack Nicholson"],
        quotes: [
            "I want the truth!",
            "You can't handle the truth!",
        ],
        difficulty: 3
    },
    {
        title: "When Harry Met Sally",
        year: "1989",
        actors: ["Billy Crystal", "Meg Ryan"],
        quotes: [
            "When you realize you want to spend the rest of your life with somebody, you want the rest of your life to start as soon as possible.",
            "I'll have what she's having.",
        ],
        difficulty: 3
    },
    {
        title: "Dirty Dancing",
        year: "1987",
        actors: ["Patrick Swayze", "Jennifer Grey"],
        quotes: [
            "Nobody puts Baby in a corner.",
            "I carried a watermelon.",
        ],
        difficulty: 3
    },
    {
        title: "The Princess Bride",
        year: "1987",
        actors: ["Cary Elwes", "Mandy Patinkin"],
        quotes: [
            "As you wish.",
            "Hello. My name is Inigo Montoya. You killed my father. Prepare to die.",
        ],
        difficulty: 3
    },
    {
        title: "Scarface",
        year: "1983",
        actors: ["Al Pacino", "Steven Bauer"],
        quotes: [
            "Say hello to my little friend!",
            "In this country, you gotta make the money first.",
        ],
        difficulty: 3
    },
    {
        title: "Good Will Hunting",
        year: "1997",
        actors: ["Matt Damon", "Robin Williams"],
        quotes: [
            "How do you like them apples?",
            "It's not your fault. It's not your fault.",
        ],
        difficulty: 3
    },
    {
        title: "Apocalypse Now",
        year: "1979",
        actors: ["Martin Sheen", "Marlon Brando"],
        quotes: [
            "I love the smell of napalm in the morning.",
            "The horror... the horror...",
        ],
        difficulty: 3
    },
    {
        title: "Raging Bull",
        year: "1980",
        actors: ["Robert De Niro", "Joe Pesci"],
        quotes: [
            "You fuck my wife?",
            "What? How could you ask me that?",
        ],
        difficulty: 3
    },
    {
        title: "The Deer Hunter",
        year: "1978",
        actors: ["Christopher Walken", "Robert De Niro"],
        quotes: [
            "This is this.",
            "What do you mean, this is this?",
        ],
        difficulty: 3
    },
    {
        title: "One Flew Over the Cuckoo's Nest",
        year: "1975",
        actors: ["Jack Nicholson", "Louise Fletcher"],
        quotes: [
            "But I tried, didn't I? Goddammit, at least I did that.",
            "Mr. McMurphy, you are under my jurisdiction.",
        ],
        difficulty: 3
    },
    {
        title: "Chinatown",
        year: "1974",
        actors: ["Jack Nicholson", "Faye Dunaway"],
        quotes: [
            "Forget it, Jake. It's Chinatown.",
            "She's my sister and my daughter!",
        ],
        difficulty: 3
    },
    {
        title: "The Graduate",
        year: "1967",
        actors: ["Dustin Hoffman", "Anne Bancroft"],
        quotes: [
            "Mrs. Robinson, you're trying to seduce me.",
            "Aren't you?",
        ],
        difficulty: 3
    },
    {
        title: "12 Angry Men",
        year: "1957",
        actors: ["Henry Fonda", "Lee J. Cobb"],
        quotes: [
            "It's possible!",
            "You sat right here and said guilty with everyone else.",
        ],
        difficulty: 3
    },
    {
        title: "Psycho",
        year: "1960",
        actors: ["Anthony Perkins", "Janet Leigh"],
        quotes: [
            "A boy's best friend is his mother.",
            "We all go a little mad sometimes.",
        ],
        difficulty: 3
    },
    {
        title: "Vertigo",
        year: "1958",
        actors: ["James Stewart", "Kim Novak"],
        quotes: [
            "Only one is a wanderer. Two together are always going somewhere.",
            "Where are we going?",
        ],
        difficulty: 3
    },
    {
        title: "The Shining",
        year: "1980",
        actors: ["Jack Nicholson", "Shelley Duvall"],
        quotes: [
            "Here's Johnny!",
            "All work and no play makes Jack a dull boy.",
        ],
        difficulty: 3
    },
    {
        title: "Alien",
        year: "1979",
        actors: ["Sigourney Weaver", "Tom Skerritt"],
        quotes: [
            "In space, no one can hear you scream.",
            "Get out of there! Behind you!",
        ],
        difficulty: 3
    },
    {
        title: "Blade Runner",
        year: "1982",
        actors: ["Harrison Ford", "Rutger Hauer"],
        quotes: [
            "I've seen things you people wouldn't believe.",
            "All those moments will be lost in time, like tears in rain.",
        ],
        difficulty: 3
    },
    {
        title: "2001: A Space Odyssey",
        year: "1968",
        actors: ["Douglas Rain", "Keir Dullea"],
        quotes: [
            "I'm sorry, Dave. I'm afraid I can't do that.",
            "What's the problem?",
        ],
        difficulty: 3
    },
    {
        title: "A Clockwork Orange",
        year: "1971",
        actors: ["Malcolm McDowell", "Patrick Magee"],
        quotes: [
            "I was cured all right.",
            "It's funny how the colors of the real world only seem really real when you viddy them on the screen.",
        ],
        difficulty: 3
    },
    {
        title: "The Exorcist",
        year: "1973",
        actors: ["Linda Blair", "Max von Sydow"],
        quotes: [
            "The power of Christ compels you!",
            "Your mother sucks cocks in hell!",
        ],
        difficulty: 3
    },
    {
        title: "Annie Hall",
        year: "1977",
        actors: ["Woody Allen", "Diane Keaton"],
        quotes: [
            "La-di-da, la-di-da.",
            "You're a real Kafkaesque character.",
        ],
        difficulty: 3
    },
    {
        title: "Network",
        year: "1976",
        actors: ["Peter Finch", "Faye Dunaway"],
        quotes: [
            "I'm as mad as hell, and I'm not going to take this anymore!",
            "You're television incarnate, Diana.",
        ],
        difficulty: 3
    },
    {
        title: "The French Connection",
        year: "1971",
        actors: ["Gene Hackman", "Roy Scheider"],
        quotes: [
            "Picking your feet in Poughkeepsie?",
            "What?",
        ],
        difficulty: 3
    },
    {
        title: "All the President's Men",
        year: "1976",
        actors: ["Robert Redford", "Dustin Hoffman"],
        quotes: [
            "Follow the money.",
            "What do you mean?",
        ],
        difficulty: 3
    },
    {
        title: "Dog Day Afternoon",
        year: "1975",
        actors: ["Al Pacino", "John Cazale"],
        quotes: [
            "Attica! Attica!",
            "Which country do you want to go to?",
        ],
        difficulty: 3
    },
    {
        title: "Midnight Cowboy",
        year: "1969",
        actors: ["Dustin Hoffman", "Jon Voight"],
        quotes: [
            "I'm walkin' here! I'm walkin' here!",
            "Up yours, you son of a bitch!",
        ],
        difficulty: 3
    },
    {
        title: "The Wild Bunch",
        year: "1969",
        actors: ["William Holden", "Ernest Borgnine"],
        quotes: [
            "If they move, kill 'em.",
            "Let's go.",
        ],
        difficulty: 3
    },
    {
        title: "Bonnie and Clyde",
        year: "1967",
        actors: ["Warren Beatty", "Faye Dunaway"],
        quotes: [
            "We rob banks.",
            "Ain't he something?",
        ],
        difficulty: 3
    },
    {
        title: "The Maltese Falcon",
        year: "1941",
        actors: ["Humphrey Bogart", "Mary Astor"],
        quotes: [
            "The stuff that dreams are made of.",
            "What is it?",
        ],
        difficulty: 3
    },
    {
        title: "Double Indemnity",
        year: "1944",
        actors: ["Fred MacMurray", "Barbara Stanwyck"],
        quotes: [
            "How could I have known that murder can sometimes smell like honeysuckle?",
            "Goodbye, baby.",
        ],
        difficulty: 3
    },
    {
        title: "Sunset Boulevard",
        year: "1950",
        actors: ["Gloria Swanson", "William Holden"],
        quotes: [
            "I am big. It's the pictures that got small.",
            "You're Norma Desmond. You used to be in silent pictures.",
        ],
        difficulty: 3
    },
    {
        title: "Risky Business",
        year: "1983",
        actors: ["Tom Cruise", "Rebecca De Mornay"],
        quotes: [
            "Sometimes you gotta say 'What the fuck.'",
            "What the fuck.",
        ],
        difficulty: 3
    },
    {
        title: "Rain Man",
        year: "1988",
        actors: ["Dustin Hoffman", "Tom Cruise"],
        quotes: [
            "I'm an excellent driver.",
            "Yeah, you are.",
        ],
        difficulty: 3
    },
    {
        title: "Platoon",
        year: "1986",
        actors: ["Charlie Sheen", "Willem Dafoe"],
        quotes: [
            "I think now, looking back, we did not fight the enemy.",
            "We fought ourselves.",
        ],
        difficulty: 3
    },
    {
        title: "Wall Street",
        year: "1987",
        actors: ["Michael Douglas", "Charlie Sheen"],
        quotes: [
            "Greed, for lack of a better word, is good.",
            "Greed works.",
        ],
        difficulty: 3
    },
    {
        title: "Stand by Me",
        year: "1986",
        actors: ["Wil Wheaton", "River Phoenix"],
        quotes: [
            "I never had any friends later on like the ones I had when I was twelve.",
            "Jesus, does anyone?",
        ],
        difficulty: 3
    },
    {
        title: "Dead Poets Society",
        year: "1989",
        actors: ["Robin Williams", "Robert Sean Leonard"],
        quotes: [
            "Carpe diem. Seize the day, boys.",
            "Make your lives extraordinary.",
        ],
        difficulty: 3
    },
    {
        title: "Cool Hand Luke",
        year: "1967",
        actors: ["Paul Newman", "Strother Martin"],
        quotes: [
            "What we've got here is failure to communicate.",
            "Some men you just can't reach.",
        ],
        difficulty: 3
    },
    {
        title: "Butch Cassidy and the Sundance Kid",
        year: "1969",
        actors: ["Paul Newman", "Robert Redford"],
        quotes: [
            "Who are those guys?",
            "I can't swim!",
        ],
        difficulty: 3
    },
    {
        title: "The Sting",
        year: "1973",
        actors: ["Paul Newman", "Robert Redford"],
        quotes: [
            "Ya follow?",
            "Not yet.",
        ],
        difficulty: 3
    },
    {
        title: "Serpico",
        year: "1973",
        actors: ["Al Pacino", "John Randolph"],
        quotes: [
            "The reality is that we do not wash our own laundry.",
            "It just gets dirtier.",
        ],
        difficulty: 3
    },
    {
        title: "Marathon Man",
        year: "1976",
        actors: ["Dustin Hoffman", "Laurence Olivier"],
        quotes: [
            "Is it safe?",
            "I don't know what you mean.",
        ],
        difficulty: 3
    },
    {
        title: "The Conversation",
        year: "1974",
        actors: ["Gene Hackman", "John Cazale"],
        quotes: [
            "I don't have anything personal.",
            "Nothing of value.",
        ],
        difficulty: 3
    },
    {
        title: "To Kill a Mockingbird",
        year: "1962",
        actors: ["Gregory Peck", "Mary Badham"],
        quotes: [
            "You never really understand a person until you consider things from his point of view.",
            "Sir?",
        ],
        difficulty: 3
    },
    {
        title: "In the Heat of the Night",
        year: "1967",
        actors: ["Sidney Poitier", "Rod Steiger"],
        quotes: [
            "They call me Mr. Tibbs!",
            "I don't think we're going to get along.",
        ],
        difficulty: 3
    },

    // ============================================
    // DIFFICULTY 4 - DEEPER CUTS & INDIE DARLINGS (54 films)
    // ============================================
    {
        title: "Donnie Darko",
        year: "2001",
        actors: ["Jake Gyllenhaal", "Frank the Rabbit"],
        quotes: [
            "Why are you wearing that stupid bunny suit?",
            "Why are you wearing that stupid man suit?",
        ],
        difficulty: 4
    },
    {
        title: "Reservoir Dogs",
        year: "1992",
        actors: ["Harvey Keitel", "Steve Buscemi"],
        quotes: [
            "I don't tip.",
            "You don't tip?",
        ],
        difficulty: 4
    },
    {
        title: "The Big Sleep",
        year: "1946",
        actors: ["Humphrey Bogart", "Lauren Bacall"],
        quotes: [
            "I don't mind if you don't like my manners. I don't like them myself.",
            "You know what he'll do when he comes back? Beat my teeth out, then kick me in the stomach for mumbling.",
        ],
        difficulty: 4
    },
    {
        title: "The Third Man",
        year: "1949",
        actors: ["Joseph Cotten", "Orson Welles"],
        quotes: [
            "In Italy for 30 years under the Borgias they had warfare, terror, murder, and bloodshed, but they produced Michelangelo.",
            "Look down there. Would you really feel any pity if one of those dots stopped moving forever?",
        ],
        difficulty: 4
    },
    {
        title: "Mulholland Drive",
        year: "2001",
        actors: ["Naomi Watts", "Laura Harring"],
        quotes: [
            "Silencio.",
            "No hay banda.",
        ],
        difficulty: 4
    },
    {
        title: "Blue Velvet",
        year: "1986",
        actors: ["Dennis Hopper", "Isabella Rossellini"],
        quotes: [
            "Heineken? Fuck that shit! Pabst Blue Ribbon!",
            "Baby wants to fuck!",
        ],
        difficulty: 4
    },
    {
        title: "Eraserhead",
        year: "1977",
        actors: ["Jack Nance", "Charlotte Stewart"],
        quotes: [
            "In Heaven, everything is fine.",
            "They're not even sure it is a baby.",
        ],
        difficulty: 4
    },
    {
        title: "Persona",
        year: "1966",
        actors: ["Liv Ullmann", "Bibi Andersson"],
        quotes: [
            "I thought you were dead.",
            "No, I'm not dead.",
        ],
        difficulty: 4
    },
    {
        title: "8½",
        year: "1963",
        actors: ["Marcello Mastroianni", "Claudia Cardinale"],
        quotes: [
            "Everything's confused again, but that doesn't matter.",
            "All the confusion of my life has been a reflection of myself!",
        ],
        difficulty: 4
    },
    {
        title: "Breathless",
        year: "1960",
        actors: ["Jean-Paul Belmondo", "Jean Seberg"],
        quotes: [
            "I told you I don't like your friends.",
            "Between grief and nothing, I will take grief.",
        ],
        difficulty: 4
    },
    {
        title: "The 400 Blows",
        year: "1959",
        actors: ["Jean-Pierre Léaud", "Claire Maurier"],
        quotes: [
            "My parents are the cause of every trouble in my life.",
            "I'd rather be at the reformatory than at home.",
        ],
        difficulty: 4
    },
    {
        title: "Tokyo Story",
        year: "1953",
        actors: ["Chishu Ryu", "Chieko Higashiyama"],
        quotes: [
            "Isn't life disappointing?",
            "Yes, it is.",
        ],
        difficulty: 4
    },
    {
        title: "Rashomon",
        year: "1950",
        actors: ["Toshiro Mifune", "Machiko Kyo"],
        quotes: [
            "It's human to lie.",
            "Most human beings can't tell the truth about themselves.",
        ],
        difficulty: 4
    },
    {
        title: "Seven Samurai",
        year: "1954",
        actors: ["Takashi Shimura", "Toshiro Mifune"],
        quotes: [
            "Again we are defeated.",
            "No. The farmers have won. We have lost.",
        ],
        difficulty: 4
    },
    {
        title: "M",
        year: "1931",
        actors: ["Peter Lorre", "Gustaf Gründgens"],
        quotes: [
            "I can't help myself! I haven't any control over this evil thing inside of me!",
            "The fire, the voices, they won't leave me alone!",
        ],
        difficulty: 4
    },
    {
        title: "Bicycle Thieves",
        year: "1948",
        actors: ["Lamberto Maggiorani", "Enzo Staiola"],
        quotes: [
            "Why should I kill myself worrying when I'll end up just as dead?",
            "There's a cure for everything except death.",
        ],
        difficulty: 4
    },
    {
        title: "La Dolce Vita",
        year: "1960",
        actors: ["Marcello Mastroianni", "Anita Ekberg"],
        quotes: [
            "Marcello, come here! Hurry up!",
            "Sweetness itself!",
        ],
        difficulty: 4
    },
    {
        title: "Amarcord",
        year: "1973",
        actors: ["Bruno Zanin", "Pupella Maggio"],
        quotes: [
            "At last, the day has come!",
            "We're going to see the Rex!",
        ],
        difficulty: 4
    },
    {
        title: "The Conformist",
        year: "1970",
        actors: ["Jean-Louis Trintignant", "Stefania Sandrelli"],
        quotes: [
            "I want to be like everyone else.",
            "Normal. Normal!",
        ],
        difficulty: 4
    },
    {
        title: "L'Avventura",
        year: "1960",
        actors: ["Monica Vitti", "Gabriele Ferzetti"],
        quotes: [
            "What do we do now?",
            "I don't know.",
        ],
        difficulty: 4
    },
    {
        title: "Pather Panchali",
        year: "1955",
        actors: ["Kanu Bannerjee", "Karuna Bannerjee"],
        quotes: [
            "I'll bring something for you.",
            "When will you come back?",
        ],
        difficulty: 4
    },
    {
        title: "The Battle of Algiers",
        year: "1966",
        actors: ["Brahim Hadjadj", "Jean Martin"],
        quotes: [
            "Starting a revolution is hard, and it's even harder to continue it.",
            "To win, we will have to make the French leave.",
        ],
        difficulty: 4
    },
    {
        title: "Memories of Murder",
        year: "2003",
        actors: ["Song Kang-ho", "Kim Sang-kyung"],
        quotes: [
            "Document this. You see? He's laughing.",
            "Do you see my eyes? They can read people.",
        ],
        difficulty: 4
    },
    {
        title: "Oldboy",
        year: "2003",
        actors: ["Choi Min-sik", "Yoo Ji-tae"],
        quotes: [
            "Laugh and the world laughs with you. Weep and you weep alone.",
            "I'm going to kill you.",
        ],
        difficulty: 4
    },
    {
        title: "Stalker",
        year: "1979",
        actors: ["Alexander Kaidanovsky", "Anatoly Solonitsyn"],
        quotes: [
            "Let everything that's been planned come true.",
            "The Zone wants to be respected. Otherwise it will punish.",
        ],
        difficulty: 4
    },
    {
        title: "Solaris",
        year: "1972",
        actors: ["Donatas Banionis", "Natalya Bondarchuk"],
        quotes: [
            "We don't need other worlds. We need mirrors.",
            "We think of ourselves as seekers of truth.",
        ],
        difficulty: 4
    },
    {
        title: "Andrei Rublev",
        year: "1966",
        actors: ["Anatoly Solonitsyn", "Ivan Lapikov"],
        quotes: [
            "You are a great master. Why do you play the fool?",
            "I paint for God, not for people.",
        ],
        difficulty: 4
    },
    {
        title: "Come and See",
        year: "1985",
        actors: ["Aleksey Kravchenko", "Olga Mironova"],
        quotes: [
            "He doesn't want to die.",
            "So much for the Partisan!",
        ],
        difficulty: 4
    },
    {
        title: "The Mirror",
        year: "1975",
        actors: ["Margarita Terekhova", "Filipp Yankovsky"],
        quotes: [
            "I remember I was very surprised when I first saw a chandelier.",
            "Let everything happen to you: beauty and terror.",
        ],
        difficulty: 4
    },
    {
        title: "Wings of Desire",
        year: "1987",
        actors: ["Bruno Ganz", "Solveig Dommartin"],
        quotes: [
            "I wish I could say: 'now' and 'now' and 'now.'",
            "When the child was a child, it walked with its arms swinging.",
        ],
        difficulty: 4
    },
    {
        title: "Au Hasard Balthazar",
        year: "1966",
        actors: ["Anne Wiazemsky", "Walter Green"],
        quotes: [
            "The world is wicked. You can't love the world.",
            "God doesn't exist for donkeys.",
        ],
        difficulty: 4
    },
    {
        title: "Pickpocket",
        year: "1959",
        actors: ["Martin LaSalle", "Marika Green"],
        quotes: [
            "For me, theft is a form of liberty.",
            "Oh Jeanne, to reach you at last, what a strange path I had to take.",
        ],
        difficulty: 4
    },
    {
        title: "Viridiana",
        year: "1961",
        actors: ["Silvia Pinal", "Francisco Rabal"],
        quotes: [
            "Thank God I'm an atheist.",
            "If only you knew what good I want to do.",
        ],
        difficulty: 4
    },
    {
        title: "Aguirre, the Wrath of God",
        year: "1972",
        actors: ["Klaus Kinski", "Helena Rojo"],
        quotes: [
            "I am the great traitor. There must be no other.",
            "I am the Wrath of God!",
        ],
        difficulty: 4
    },
    {
        title: "Primer",
        year: "2004",
        actors: ["Shane Carruth", "David Sullivan"],
        quotes: [
            "Are you hungry? I haven't eaten since later this afternoon.",
            "What are you doing?",
        ],
        difficulty: 4
    },
    {
        title: "Pi",
        year: "1998",
        actors: ["Sean Gullette", "Mark Margolis"],
        quotes: [
            "When I was a little kid, my mother told me not to stare into the sun.",
            "So once when I was six, I did.",
        ],
        difficulty: 4
    },
    {
        title: "Melancholia",
        year: "2011",
        actors: ["Kirsten Dunst", "Charlotte Gainsbourg"],
        quotes: [
            "The Earth is evil. We don't need to grieve for it.",
            "Nobody will miss it.",
        ],
        difficulty: 4
    },
    {
        title: "Under the Skin",
        year: "2013",
        actors: ["Scarlett Johansson", "Jeremy McWilliams"],
        quotes: [
            "Where are you from?",
            "I'm from a different planet.",
        ],
        difficulty: 4
    },
    {
        title: "Holy Motors",
        year: "2012",
        actors: ["Denis Lavant", "Édith Scob"],
        quotes: [
            "Who were we, when we were who we were?",
            "Beauty is in the eye.",
        ],
        difficulty: 4
    },
    {
        title: "Enter the Void",
        year: "2009",
        actors: ["Nathaniel Brown", "Paz de la Huerta"],
        quotes: [
            "I'm not dead.",
            "Are you sure?",
        ],
        difficulty: 4
    },
    {
        title: "The Lobster",
        year: "2015",
        actors: ["Colin Farrell", "Rachel Weisz"],
        quotes: [
            "If you encounter any problems, you cannot resort to violence.",
            "You will turn into an animal of your choosing.",
        ],
        difficulty: 4
    },
    {
        title: "Synecdoche, New York",
        year: "2008",
        actors: ["Philip Seymour Hoffman", "Samantha Morton"],
        quotes: [
            "Everything is more complicated than you think.",
            "I know how to do it now.",
        ],
        difficulty: 4
    },
    {
        title: "The Master",
        year: "2012",
        actors: ["Joaquin Phoenix", "Philip Seymour Hoffman"],
        quotes: [
            "If you figure out a way to live without a master, any master, be sure to let the rest of us know.",
            "For you'd be the first in the history of the world.",
        ],
        difficulty: 4
    },
    {
        title: "Waking Life",
        year: "2001",
        actors: ["Wiley Wiggins", "Ethan Hawke"],
        quotes: [
            "Dream is destiny.",
            "The trick is to combine your waking rational abilities with the infinite possibilities of your dreams.",
        ],
        difficulty: 4
    },
    {
        title: "Upstream Color",
        year: "2013",
        actors: ["Amy Seimetz", "Shane Carruth"],
        quotes: [
            "Are you scared?",
            "I feel like I'm here with you.",
        ],
        difficulty: 4
    },
    {
        title: "A Scanner Darkly",
        year: "2006",
        actors: ["Keanu Reeves", "Robert Downey Jr."],
        quotes: [
            "What does a scanner see?",
            "Into the head? Into the heart?",
        ],
        difficulty: 4
    },
    {
        title: "The Holy Mountain",
        year: "1973",
        actors: ["Alejandro Jodorowsky", "Horacio Salinas"],
        quotes: [
            "You are excrement. You can change yourself into gold.",
            "Zoom back camera!",
        ],
        difficulty: 4
    },
    {
        title: "El Topo",
        year: "1970",
        actors: ["Alejandro Jodorowsky", "Brontis Jodorowsky"],
        quotes: [
            "Too much perfection is a mistake.",
            "You are seven years old. You are a man.",
        ],
        difficulty: 4
    },
    {
        title: "Inland Empire",
        year: "2006",
        actors: ["Laura Dern", "Jeremy Irons"],
        quotes: [
            "I'm in this dark place.",
            "You say you're married?",
        ],
        difficulty: 4
    },
    {
        title: "Antichrist",
        year: "2009",
        actors: ["Willem Dafoe", "Charlotte Gainsbourg"],
        quotes: [
            "Chaos reigns.",
            "Nature is Satan's church.",
        ],
        difficulty: 4
    },
    {
        title: "Possessor",
        year: "2020",
        actors: ["Andrea Riseborough", "Christopher Abbott"],
        quotes: [
            "Pull me out.",
            "I need to stay focused.",
        ],
        difficulty: 4
    },
    {
        title: "mother!",
        year: "2017",
        actors: ["Jennifer Lawrence", "Javier Bardem"],
        quotes: [
            "You never loved me. You just loved how much I loved you.",
            "I gave you everything!",
        ],
        difficulty: 4
    },
    {
        title: "Annihilation",
        year: "2018",
        actors: ["Natalie Portman", "Jennifer Jason Leigh"],
        quotes: [
            "It's not destroying. It's making something new.",
            "Ventress wants to face it. You want to fight it. But I don't think I want either of those things.",
        ],
        difficulty: 4
    },
    {
        title: "Under the Silver Lake",
        year: "2018",
        actors: ["Andrew Garfield", "Riley Keough"],
        quotes: [
            "I've been waiting for you.",
            "What is it you think you're looking for?",
        ],
        difficulty: 4
    },

    // ============================================
    // DIFFICULTY 5 - ARTHOUSE & INTERNATIONAL CINEMA (41 films)
    // ============================================
    {
        title: "L'Atalante",
        year: "1934",
        actors: ["Jean Dasté", "Dita Parlo"],
        quotes: [
            "When you're under the water, you can see the one you love.",
            "The water shows you their face.",
        ],
        difficulty: 5
    },
    {
        title: "Sansho the Bailiff",
        year: "1954",
        actors: ["Kinuyo Tanaka", "Yoshiaki Hanayagi"],
        quotes: [
            "Without mercy, man is like a beast.",
            "Is life so dear or peace so sweet?",
        ],
        difficulty: 5
    },
    {
        title: "Satantango",
        year: "1994",
        actors: ["Mihály Víg", "Putyi Horváth"],
        quotes: [
            "There's nothing to understand. The world is complete as it is.",
            "We're all alone and we're heading towards defeat.",
        ],
        difficulty: 5
    },
    {
        title: "Jeanne Dielman",
        year: "1975",
        actors: ["Delphine Seyrig", "Jan Decorte"],
        quotes: [
            "I'm making meatloaf.",
            "I prefer to work alone.",
        ],
        difficulty: 5
    },
    {
        title: "The Turin Horse",
        year: "2011",
        actors: ["János Derzsi", "Erika Bók"],
        quotes: [
            "The horse won't eat.",
            "We must carry on.",
        ],
        difficulty: 5
    },
    {
        title: "Wavelength",
        year: "1967",
        actors: ["Hollis Frampton", "Amy Taubin"],
        quotes: [
            "I think there's been a murder.",
            "Can you call the police?",
        ],
        difficulty: 5
    },
    {
        title: "Last Year at Marienbad",
        year: "1961",
        actors: ["Delphine Seyrig", "Giorgio Albertazzi"],
        quotes: [
            "You're still hesitating.",
            "I never hesitate.",
        ],
        difficulty: 5
    },
    {
        title: "Cléo from 5 to 7",
        year: "1962",
        actors: ["Corinne Marchand", "Antoine Bourseiller"],
        quotes: [
            "Ugliness is a kind of death.",
            "As long as I'm beautiful, I'm alive.",
        ],
        difficulty: 5
    },
    {
        title: "Le Samouraï",
        year: "1967",
        actors: ["Alain Delon", "François Périer"],
        quotes: [
            "There is no greater solitude than that of the samurai.",
            "Unless it is that of the tiger in the jungle.",
        ],
        difficulty: 5
    },
    {
        title: "Chungking Express",
        year: "1994",
        actors: ["Tony Leung", "Faye Wong"],
        quotes: [
            "If memories could be canned, would they also have expiry dates?",
            "Dreams. If only I could live in them.",
        ],
        difficulty: 5
    },
    {
        title: "In the Mood for Love",
        year: "2000",
        actors: ["Tony Leung", "Maggie Cheung"],
        quotes: [
            "I don't know how to say it. I wonder if there is anyone behind you.",
            "He didn't turn back. It's like me.",
        ],
        difficulty: 5
    },
    {
        title: "Yi Yi",
        year: "2000",
        actors: ["Nien-Jen Wu", "Elaine Jin"],
        quotes: [
            "I'm old. I don't have anything new to say.",
            "Every day I feel I'm living someone else's life.",
        ],
        difficulty: 5
    },
    {
        title: "Tropical Malady",
        year: "2004",
        actors: ["Banlop Lomnoi", "Sakda Kaewbuadee"],
        quotes: [
            "I'm the shaman of the bygone past.",
            "I'm the tiger spirit.",
        ],
        difficulty: 5
    },
    {
        title: "Cemetery of Splendour",
        year: "2015",
        actors: ["Jenjira Pongpas", "Banlop Lomnoi"],
        quotes: [
            "The soldiers are sleeping again.",
            "They're dreaming of the palace.",
        ],
        difficulty: 5
    },
    {
        title: "Werckmeister Harmonies",
        year: "2000",
        actors: ["Lars Rudolph", "Peter Fitz"],
        quotes: [
            "The sun has come to a standstill.",
            "There is nothing else to do but wait.",
        ],
        difficulty: 5
    },
    {
        title: "The Man from London",
        year: "2007",
        actors: ["Miroslav Krobot", "Tilda Swinton"],
        quotes: [
            "I saw something I shouldn't have.",
            "Something terrible.",
        ],
        difficulty: 5
    },
    {
        title: "Uncle Boonmee Who Can Recall His Past Lives",
        year: "2010",
        actors: ["Thanapat Saisaymar", "Jenjira Pongpas"],
        quotes: [
            "I've been thinking about my past lives lately.",
            "Do you remember them all?",
        ],
        difficulty: 5
    },
    {
        title: "Nostalgia",
        year: "1983",
        actors: ["Oleg Yankovsky", "Erland Josephson"],
        quotes: [
            "Man is happy when he has faith.",
            "But what if he has no faith?",
        ],
        difficulty: 5
    },
    {
        title: "The Sacrifice",
        year: "1986",
        actors: ["Erland Josephson", "Susan Fleetwood"],
        quotes: [
            "In the beginning was the Word.",
            "Why did you say that?",
        ],
        difficulty: 5
    },
    {
        title: "Ivan's Childhood",
        year: "1962",
        actors: ["Kolya Burlyayev", "Valentin Zubkov"],
        quotes: [
            "He's not a child anymore.",
            "The war has taken that from him.",
        ],
        difficulty: 5
    },
    {
        title: "The Ascent",
        year: "1977",
        actors: ["Boris Plotnikov", "Vladimir Gostyukhin"],
        quotes: [
            "Why didn't you shoot?",
            "I couldn't.",
        ],
        difficulty: 5
    },
    {
        title: "The Color of Pomegranates",
        year: "1969",
        actors: ["Sofiko Chiaureli", "Melkon Alekyan"],
        quotes: [
            "I am the man whose life and soul are torture.",
            "My poems are like pomegranate seeds.",
        ],
        difficulty: 5
    },
    {
        title: "Shadows of Forgotten Ancestors",
        year: "1965",
        actors: ["Ivan Mykolaichuk", "Larisa Kadochnikova"],
        quotes: [
            "Marichka, where are you?",
            "I'm here, Ivan.",
        ],
        difficulty: 5
    },
    {
        title: "The Round-Up",
        year: "1966",
        actors: ["János Görbe", "Zoltán Latinovits"],
        quotes: [
            "Who is your leader?",
            "I don't know.",
        ],
        difficulty: 5
    },
    {
        title: "Red Psalm",
        year: "1972",
        actors: ["Lajos Balázsovits", "András Bálint"],
        quotes: [
            "The revolution has begun.",
            "We will sing and dance.",
        ],
        difficulty: 5
    },
    {
        title: "Histoire(s) du cinéma",
        year: "1988",
        actors: ["Jean-Luc Godard", "Julie Delpy"],
        quotes: [
            "All great fiction films tend toward documentary.",
            "All great documentaries tend toward fiction.",
        ],
        difficulty: 5
    },
    {
        title: "Film Socialisme",
        year: "2010",
        actors: ["Catherine Tanvier", "Christian Sinniger"],
        quotes: [
            "No comment.",
            "Pas de commentaire.",
        ],
        difficulty: 5
    },
    {
        title: "The Death of Mr. Lazarescu",
        year: "2005",
        actors: ["Ion Fiscuteanu", "Luminita Gheorghiu"],
        quotes: [
            "I don't feel well.",
            "We need to get you to a hospital.",
        ],
        difficulty: 5
    },
    {
        title: "4 Months, 3 Weeks and 2 Days",
        year: "2007",
        actors: ["Anamaria Marinca", "Laura Vasiliu"],
        quotes: [
            "You have to help me.",
            "I'll do whatever you need.",
        ],
        difficulty: 5
    },
    {
        title: "The Cranes Are Flying",
        year: "1957",
        actors: ["Tatyana Samoylova", "Aleksey Batalov"],
        quotes: [
            "Wait for me, and I'll come back.",
            "I'll wait forever.",
        ],
        difficulty: 5
    },
    {
        title: "A Brighter Summer Day",
        year: "1991",
        actors: ["Chen Chang", "Lisa Yang"],
        quotes: [
            "I don't know how I got here.",
            "But I'm here now.",
        ],
        difficulty: 5
    },
    {
        title: "The Best of Youth",
        year: "2003",
        actors: ["Luigi Lo Cascio", "Alessio Boni"],
        quotes: [
            "We were young, and we believed in everything.",
            "Life was beginning.",
        ],
        difficulty: 5
    },
    {
        title: "The Handmaiden",
        year: "2016",
        actors: ["Kim Min-hee", "Kim Tae-ri"],
        quotes: [
            "From that moment, we were together.",
            "No one can separate us now.",
        ],
        difficulty: 5
    },
    {
        title: "Burning",
        year: "2018",
        actors: ["Yoo Ah-in", "Steven Yeun"],
        quotes: [
            "There are so many greenhouses in Korea now.",
            "They have to disappear.",
        ],
        difficulty: 5
    },
    {
        title: "Happy Together",
        year: "1997",
        actors: ["Tony Leung", "Leslie Cheung"],
        quotes: [
            "Let's start over.",
            "Not again.",
        ],
        difficulty: 5
    },
    {
        title: "Blow-Up",
        year: "1966",
        actors: ["David Hemmings", "Vanessa Redgrave"],
        quotes: [
            "I saw something.",
            "Nothing's wrong. It's beautiful.",
        ],
        difficulty: 5
    },
    {
        title: "Red Desert",
        year: "1964",
        actors: ["Monica Vitti", "Richard Harris"],
        quotes: [
            "I need something real.",
            "What is this fog?",
        ],
        difficulty: 5
    },
    {
        title: "L'Eclisse",
        year: "1962",
        actors: ["Monica Vitti", "Alain Delon"],
        quotes: [
            "I wish I didn't love you, or that I loved you much more.",
            "I don't know.",
        ],
        difficulty: 5
    },
    {
        title: "La Notte",
        year: "1961",
        actors: ["Marcello Mastroianni", "Jeanne Moreau"],
        quotes: [
            "When was the last time you told me you loved me?",
            "I can't remember.",
        ],
        difficulty: 5
    },
    {
        title: "Contempt",
        year: "1963",
        actors: ["Brigitte Bardot", "Michel Piccoli"],
        quotes: [
            "I love you totally, tenderly, tragically.",
            "Me too, Paul.",
        ],
        difficulty: 5
    },
    {
        title: "La Haine",
        year: "1995",
        actors: ["Vincent Cassel", "Hubert Koundé"],
        quotes: [
            "It's about a society on its way down.",
            "And as it falls, it keeps telling itself: 'So far so good.'",
        ],
        difficulty: 5
    }
];
