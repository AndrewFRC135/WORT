async function load_match() {
    // async fetch the sample match data
    const response = await fetch('./sample_match.json');
    // get json promise text from the response
    let match = await response.json();
    
    document.getElementById("match").innerHTML = JSON.stringify(match, null, 2);
}
