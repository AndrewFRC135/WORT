
function update_song_box(match_data, focus_id, song_id)
{
    if (match_data === null)
    {
        return;
    }

    let song_box_dom = document.getElementById("song_box_" + focus_id + "_" + song_id);
    
    if (song_box_dom === null)
    {
        return;
    }

    let song_data = null;

    if (song_id === "boss") {
        song_data = match_data.setlist[focus_id].boss;
    } else {
        song_data = match_data.setlist[focus_id].songs[song_id];
    }

    // if the song box has any children, remove them all first
    while (song_box_dom.firstChild) {
        song_box_dom.removeChild(song_box_dom.firstChild);
    }

    song_box_dom.classList.value = "song-box";

    let song_title_dom = document.createElement("p");
    song_title_dom.classList.value = "song-title";
    song_title_dom.innerHTML = "<b>" + song_data.title + "</b>";

    if (song_data.speed !== null && song_data.speed !== 100)
    {
        song_title_dom.innerHTML += " <span>(" + song_data.speed + "%)</span>";
    }
    if (song_data.modifiers !== null)
    {
        song_title_dom.innerHTML += " <span>(" + song_data.modifiers + ")</span>";
    }
    
    song_title_dom.innerHTML += " - By: " + song_data.artist;
    song_box_dom.appendChild(song_title_dom);

    let charter_dom = document.createElement("p");
    charter_dom.classList.value = "song-charter";
    charter_dom.innerHTML = "<i> Charted By: " + song_data.charter + " - Featured On: " + song_data.setlist + "</i>";
    song_box_dom.appendChild(charter_dom);

    let player_1_select_dom = document.createElement("div");
    player_1_select_dom.classList.value = "player-1-select";
    player_1_select_dom.innerHTML = "<p>1</p>";
    song_box_dom.appendChild(player_1_select_dom);

    let player_2_select_dom = document.createElement("div");
    player_2_select_dom.classList.value = "player-2-select";
    player_2_select_dom.innerHTML = "<p>10</p>";
    song_box_dom.appendChild(player_2_select_dom);
}

async function load_match() {
    // async fetch the sample match data
    const response = await fetch('./sample_match.json');
    // get json promise text from the response
    let match = await response.json();
    
    // get number of focuses to interate through
    const focus_count = match.setlist.length;

    // determine how many songs per focus
    let max_song_focus_count = 0;
    for (let i = 0; i < focus_count; i++)
    {
        let c = match.setlist[i].songs.length;
        if (match.setlist[i].boss !== null) {
            c++;
        }
        if (max_song_focus_count < c) {
            max_song_focus_count = c;
        }
    }

    // get the setlist object from the DOM
    let setlist_dom = document.getElementById("setlist");

    // clear the setlist dom, if it has anything in it
    while (setlist_dom.firstChild) {
        setlist_dom.removeChild(setlist_dom.firstChild);
    }

    // create a song box for each non-tb song in a focus group
    for (let index = -1; index < max_song_focus_count; index++)
    {   // iterate through every index
        let row_dom = null;

        if (index === -2)
        {   // column group styling
            row_dom = document.createElement("colgroup");
        } 
        else if (index === -1)
        {   // column header row
            row_dom = document.createElement("tr");
        }
        else
        {   // column data row
            row_dom = document.createElement("tr");
        }

        setlist_dom.append(row_dom);

        for (let focus = 0; focus < focus_count; focus++)
        {   // iterate through all focus groups
            let cell_dom = null;

            if (index === -1)
            {   // add the row header
                cell_dom = document.createElement("th");
                cell_dom.innerText = match.setlist[focus].focus;
                row_dom.append(cell_dom);
                continue;
            }

            // otherwise, add the song data

            // create a column div, and add to the document
            cell_dom = document.createElement("td");
            //cell_dom.classList.value = "col";
            row_dom.append(cell_dom);

            // create the song box div, and add to the document
            if (index < match.setlist[focus].songs.length)
            {   // normal song from list
                cell_dom.id = "song_box_" +  focus + "_" + index;
                update_song_box(match, focus, index);
            }
            else if (index == match.setlist[focus].songs.length && match.setlist[focus].boss !== null)
            {   // add boss song here
                cell_dom.id = "song_box_" +  focus + "_boss";
                update_song_box(match, focus, "boss");
            }
            else
            {   // test
            }
        }
    }
    //document.getElementById("match").innerHTML = JSON.stringify(match, null, 2);
}
