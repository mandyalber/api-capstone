'use strict'

//handle users clicking the "Search" button
function handleSearchClicked (){
    $('.search').submit(event => {
        event.preventDefault()
        let searchTerm = $('#js-searchfield').val()        
        console.log('search term is: ' + searchTerm)
        //(selector).animate({styles},speed,easing,callback)
        $('html, body').animate({ scrollTop: $('main').offset().top - 100});
        clearSearchResults()
        getYoutubeResults(searchTerm)
        getWikiResults(searchTerm)        
    })
}

//clear results from any prior searches
function clearSearchResults(){
    $('.js-youtube-results').empty()
    $('.js-wiki-results').empty()
    $('.js-youtube-redirect').empty()
    $('form')[0].reset();
}

//format parameters
function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//fetch results from YouTube's API
function getYoutubeResults (searchTerm){
    const baseURL = 'https://www.googleapis.com/youtube/v3/search'
    const apiKey = 'AIzaSyBfUY85nX5tg2xoHLj-QXsxdSLstdVO6OA'
    const params = {        
        key: apiKey,
        q: 'What is ' + searchTerm,
        part: 'snippet',
        type: 'video',
        maxResults: 4,
        order: 'Relevance',
        type: 'video'
    }

    const queryString = formatQueryParams(params)
    const url = baseURL + '?' + queryString

    console.log('YouTube search url is: ' + url);

    fetch(url)
    .then(response => {
        if (response.ok) {
        return response.json()
        }
        throw new Error(response.status)
        
    })
    .then(youtubeResponseJson => displayYoutubeResults(youtubeResponseJson, searchTerm))
    .catch(err => { 
        console.log(err.message)
        $('#js-youtube-error').text(`Oops, something went wrong. ${err.message} error. Please try again later.`)
    })
}

//fetch results from Wikipedia's API
function getWikiResults (searchTerm){

    const baseURL = 'https://en.wikipedia.org/w/api.php'
    const params = {   
        action: 'query',     
        format: 'json',
        origin: '*',
        prop: 'extracts|pageimages',
        titles: searchTerm,
        redirects: 1,
        indexpageids: 1,
        exchars: 1200, 
        exsectionformat: 'plain',
        piprop: 'name|thumbnail|original',
        pithumbsize: 250      
    }

    const queryString = formatQueryParams(params)
    const url = baseURL + '?' + queryString

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
        $('#js-wiki-error').text(`Oops, something went wrong. ${err.message} error. Please try again later.`)
    })    
}

//display YouTube results
function displayYoutubeResults(youtubeResponseJson, searchTerm){
    console.log('YouTube JSON response is: ')
    console.log(youtubeResponseJson)
    console.log(searchTerm)
    if (youtubeResponseJson.items.length === 0){
        console.log('no results')
        $('.js-youtube-results').append(
            `<p>Sorry, no YouTube videos were found. Please check your spelling and try again.</p><p>Or, you can try browsing <a href="https://www.google.com/search?q=${searchTerm}" target="_blank">Google&rsquo;s search results</a></p><p class="google-search"><img src="images/google-search.jpg" alt="google-search"></p>`
        )
    }
    else {
            
        let videos = []      
        for (let i = 0; i < youtubeResponseJson.items.length; i++){
            videos.push(`
                    <div class="video-item">
                        <a href="https://www.youtube.com/watch?v=${youtubeResponseJson.items[i].id.videoId}" target="_blank">
                        <img class="thumbnail" src="${youtubeResponseJson.items[i].snippet.thumbnails.medium.url}"></a>
                        <h3>${youtubeResponseJson.items[i].snippet.title}</h3>
                        <p class="description">${youtubeResponseJson.items[i].snippet.description}</p>
                    </div>`)    
        }
    
        $('.js-youtube-results').append(videos)
        $('.js-youtube-redirect').append(`<hr><p><a href="https://www.youtube.com/results?search_query=${searchTerm}" target="_blank">See more on YouTube</a></p>`)    
        $('div').removeClass('hidden')
    }
}

//display Wiki results
function displayWikiResults(wikiResponseJson){
    console.log('Wikipedia JSON response is: ')
    console.log(wikiResponseJson)

    let pageId = wikiResponseJson.query.pageids[0]
    let title = wikiResponseJson.query.pages[pageId].title
    let extract = wikiResponseJson.query.pages[pageId].extract
    let wikiHtml = ""
    
    if (pageId === '-1') {
        wikiHtml += `<p>Sorry, no Wikipedia page was found. Please check your spelling and try again.</p><p>Or, you can try browsing <a href="https://www.google.com/search?q=${title}" target="_blank">Google&rsquo;s search results</a></p><p class="google-search"><img src="images/google-search.jpg" alt="google-search"></p>`
    }
    else {
        if (wikiResponseJson.query.pages[pageId].thumbnail) {
            console.log('thumbnail is available')
            wikiHtml += `
                <div class="wiki-img"><img src="${wikiResponseJson.query.pages[pageId].thumbnail.source}" alt="${wikiResponseJson.query.pages[pageId].pageimage}"/></div>
                <h3 class="wiki-title">${title}</h3>
                <div class="wiki-extract">${extract}</div>
                <hr/>
                <p class="wiki-redirect"><a href="https://en.wikipedia.org/wiki/${title}" target="_blank">See more on Wikipedia</a></p>`
        }
        else {
            console.log('no thumbnail')
            wikiHtml += `            
                <h3 class="wiki-title">${title}</h3>
                <div class="wiki-extract">${extract}</div>
                <hr/>
                <p class="wiki-redirect"><a href="https://en.wikipedia.org/wiki/${title}" target="_blank">See more on Wikipedia</a></p>`
        }
    }

    $('.js-wiki-results').append(wikiHtml)
    $('div').removeClass('hidden')
}


$(handleSearchClicked)