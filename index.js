/*
1. users should be able to clearly understand what the app is asking them to do - high

2. users should be able to enter a search term without worrying about punctuation, case, etc - medium

3. users should understand where the results they are seeing came from - high

4. users should be shown a message if their term is not found and prompted with ideas to fix search term - low

5. users should be told if there was an error accessing the data - high
 
6. users should be able to make a new search and have the previous search history cleared - high

7. users should get a link to access more results on the api's originating sites - medium

8. users should be scrolled down to results with a link to return to top - low

9. users should be prompted with examples to know what to enter - low

10. users should be presented with a manageable amount of results and be able to go to the origin for more - medium
*/

//users should be able to enter a search term
function handleSearchClicked (){
    $('.search').submit(event => {
        event.preventDefault()
        let searchTerm = $('#js-searchfield').val()
        $('#js-searchfield').val('')
        console.log('search term is: ' + searchTerm)
        getYoutubeResults(searchTerm)
        getWikiResults(searchTerm)
    })
}

//format params
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//get results from youtube
function getYoutubeResults (searchTerm){
    const searchURL = 'https://www.googleapis.com/youtube/v3/search'
    const apiKey = 'AIzaSyCMXiIyZ8hCP9ETbcAQqe1QQaWpHerhTBk'
    const params = {        
        key: apiKey,
        q: searchTerm,
        part: 'snippet',
        type: 'video',
        maxResults: 5,
        order: 'Relevance',
        type: 'video'
    }

    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString

    console.log('YouTube search url is: ' + url);

    fetch(url)
    .then(response => {
        if (response.ok) {
        return response.json()
        }
        throw new Error(response.statusText)
    })
    .then(youtubeResponseJson => displayYoutubeResults(youtubeResponseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`)
    })
    

}


//get results from wikipedia
function getWikiResults (searchTerm){

    const searchURL = 'https://en.wikipedia.org/w/api.php'
    const params = {   
        action: 'query',     
        format: 'json',
        origin: '*',
        titles: searchTerm        
    }

    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString

    console.log('Wiki search url is: ' + url);

    fetch(url)
    .then(response => {
        if (response.ok) {
        return response.json()
        }
        throw new Error(response.statusText)
    })
    .then(wikiResponseJson => displayWikiResults(wikiResponseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`)
    })
    
}

//display youtube results
function displayYoutubeResults(youtubeResponseJson){
    console.log('YouTube JSON response is: ')
    console.log(youtubeResponseJson)
    let videos = []
    //use a for loop to append to a ul 
    for (let i = 0; i < youtubeResponseJson.items.length; i++){
        videos.push(`
                <li><h3>${youtubeResponseJson.items[i].snippet.title}</h3>
                <p class="description">Description: ${youtubeResponseJson.items[i].snippet.description}</p>
                <p class="link">Link: <a href=""></a></p>
            </li>`)
     console.log(videos)
    }

    $('.youtube-search-results').empty().append(videos)
    $('section').removeClass('hidden')

}

//display wiki results
function displayWikiResults(wikiResponseJson){
    console.log('Wikipedia JSON response is: ')
    console.log(wikiResponseJson)

    let wikiHtml = `<li>test</li>`
    ('wiki-search-results').empty().append(wikiHtml)
    $('section').removeClass('hidden')
}


$(handleSearchClicked)