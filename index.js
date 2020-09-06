/*
1. users should be able to clearly understand what the app is asking them to do - high


10. users should be presented with a manageable amount of results - medium
7. users should get a link to access more results on the api's originating sites - medium
2. users should be able to enter a search term without worrying about punctuation, case, etc - medium


4. users should be shown a message if their term is not found and prompted with ideas to fix search term - low
8. users should be scrolled down to results with a link to return to top - low
9. users should be prompted with examples to know what to enter - low
*/

//users should be able to enter a search term
function handleSearchClicked (){
    $('.search').submit(event => {
        event.preventDefault()
        let searchTerm = $('#js-searchfield').val()
        
        console.log('search term is: ' + searchTerm)
        getYoutubeResults(searchTerm)
        getWikiResults(searchTerm)
        //$('form')[0].reset();
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
    const apiKey = 'AIzaSyCRCQ5w0o8O1bStec0UI5nQuCTROFkgF1s'
    const params = {        
        key: apiKey,
        q: 'What is ' + searchTerm,
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
        console.log(err)
        $('#js-youtube-error').text(`Oops, something went wrong. Please try again later.`)
    })
    

}


//get results from wikipedia
function getWikiResults (searchTerm){

    const searchURL = 'https://en.wikipedia.org/w/api.php'
    const params = {   
        action: 'query',     
        format: 'json',
        origin: '*',
        prop: 'extracts|pageimages',
        titles: searchTerm,
        indexpageids: 1,
        exchars: 1200, 
        piprop: 'name|thumbnail|original',
        pithumbsize: 250      
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
        $('#js-wiki-error').text(`Oops, something went wrong: ${err.message}`)
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
            <li>
            <div class="video">
                <a href="https://www.youtube.com/watch?v=${youtubeResponseJson.items[i].id.videoId}" target="_blank">
                    <img class="thumbnail" src="${youtubeResponseJson.items[i].snippet.thumbnails.medium.url}">
                    <h3>${youtubeResponseJson.items[i].snippet.title}</h3>
                    <p class="description">${youtubeResponseJson.items[i].snippet.description}</p>
                </a>
            </div>                
            </li>`)    
    }
    
    $('.js-youtube-list').empty().append(videos)
    $('.js-youtube-results').append('<hr><p><a href="https://www.youtube.com/results?search_query=' + $('#js-searchfield').val() + 
    `" target="_blank">See more on YouTube</a></p>`)
    
    $('div').removeClass('hidden')
    

}

//display wiki results
function displayWikiResults(wikiResponseJson){
    console.log('Wikipedia JSON response is: ')
    console.log(wikiResponseJson)
    var pageId = wikiResponseJson.query.pageids[0]
    let wikiHtml = ""
    
      
    wikiHtml += `
        <img src="${wikiResponseJson.query.pages[wikiResponseJson.query.pageids[0]].thumbnail.source}" alt="${wikiResponseJson.query.pages[wikiResponseJson.query.pageids[0]].pageimage}"/>
        <h3>${wikiResponseJson.query.pages[wikiResponseJson.query.pageids[0]].title}</h3>
        <p>${wikiResponseJson.query.pages[wikiResponseJson.query.pageids[0]].extract}</p>
        <hr/>
        <p><a href="https://en.wikipedia.org/wiki/${wikiResponseJson.query.pages[wikiResponseJson.query.pageids[0]].title}" target="_blank">See more on Wikipedia</a></p>
        `

    console.log(pageId)
    
    //console.log("title is: " + wikiHtml)
    $('.js-wiki-results').empty().append(wikiHtml)
    $('div').removeClass('hidden')
}


$(handleSearchClicked)