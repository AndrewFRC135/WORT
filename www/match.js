function undo_last(match)
{
    if (match.state.pick_count === 0)
    {   // we are undoing a ban
        // TODO
    }
    else if (match.state.pick_count === match.state.song_count)
    {   // picks currently equal songs; so undo last song result
        for (let focus = 0; focus < match.setlist.length; focus++)
        {
            for (let i = 0; i < match.setlist[focus].songs.length; i++)
            {
                let song_data = match.setlist[focus].songs[i].result;

                if (song_data.order_index === (match.state.pick_count - 1))
                {
                    song_data.won_by = null;
                    update_all(match);
                    return;
                }
            }

            if (match.setlist[focus].tiebreaker.result.order_index === (match.state.pick_count - 1))
            {
                match.setlist[focus].tiebreaker.result.won_by = null;
                update_all(match);
                return;
            }
        }
    }
    else
    {   // undo last pick
        if (match.state.pick_count === match.about.ruleset.best_of)
        {   // also undo the last win won by
            for (let focus = 0; focus < match.setlist.length; focus++)
            {
                match.setlist[focus].tiebreaker.result.picked_by = null;
                match.setlist[focus].tiebreaker.result.order_index = null;
            }

            for (let focus = 0; focus < match.setlist.length; focus++)
            {
                for (let i = 0; i < match.setlist[focus].songs.length; i++)
                {
                    let song_data = match.setlist[focus].songs[i].result;
    
                    if (song_data.order_index === (match.state.pick_count - 2))
                    {
                        song_data.won_by = null;
                        update_all(match);
                        return;
                    }
                }
            }

        }

        // undo the last pick
        for (let focus = 0; focus < match.setlist.length; focus++)
        {   // 
            for (let i = 0; i < match.setlist[focus].songs.length; i++)
            {
                let song_data = match.setlist[focus].songs[i].result;

                if (song_data.order_index === (match.state.pick_count - 1))
                {
                    song_data.picked_by = null;
                    song_data.order_index = null;
                    update_all(match);
                    return;
                }
            }
        }
    }
}

function start(match)
{
    let dom = document.getElementById("pid-0-name");
    match.players[0].name = dom.value;

    dom = document.getElementById("pid-0-pronouns");
    match.players[0].pronouns = dom.value;

    dom = document.getElementById("pid-1-name");
    match.players[1].name = dom.value;

    dom = document.getElementById("pid-1-pronouns");
    match.players[1].pronouns = dom.value;

    dom = document.getElementById("match-name-input");
    match.about.match_name = dom.value;

    update_all(match);
}

function reset_all(match)
{
    //confirm("Are you sure you want to reset all match data?");
    //alert("are you sure?");

    for (let focus = 0; focus < match.setlist.length; focus++)
    {
        for (let i = 0; i < match.setlist[focus].songs.length; i++)
        {
            let song_data = match.setlist[focus].songs[i].result;

            song_data.picked_by = null;
            song_data.banned_by = null;
            song_data.won_by = null;
            song_data.order_index = null;
        }

        match.setlist[focus].tiebreaker.picked_by = null;
        match.setlist[focus].tiebreaker.order_index = null;
        match.setlist[focus].tiebreaker.won_by = null;
    }

    update_all(match);
}

function select_song_box(match, focus_id, song_id)
{
    if (match.state.picking_player_id === null)
    {
        alert("Contact Customer Support (please). Error: 1");
        return;
    }

    if (match.state.awaiting_pick === false)
    {   // this is a ban for this player! 'yay'
        // mark this song as banned by this player
        match.setlist[focus_id].songs[song_id].result.banned_by = match.state.picking_player_id;
        match.setlist[focus_id].songs[song_id].result.order_index = match.state.ban_count;
    }
    else
    {   // this is a pick for this player!
        match.setlist[focus_id].songs[song_id].result.picked_by = match.state.picking_player_id;
        match.setlist[focus_id].songs[song_id].result.order_index = match.state.pick_count;
    }

    update_all(match);
}

function select_player_box(match, pid)
{
    //if (match.state.match_winner_id !== null || match.state.picking_player_id !== null)
    //{
        //alert("A song must be selected first before selecting a winning player");
    //    return;
    //}

    // find the song that is in progress
    for (let focus = 0; focus < match.setlist.length; focus++)
    {
        for (let i = 0; i < match.setlist[focus].songs.length; i++)
        {
            let song_data = match.setlist[focus].songs[i].result;

            if (song_data.picked_by !== null && song_data.won_by === null)
            {   // this is the in progress song, set its winner
                song_data.won_by = pid;
                update_all(match);
                return;
            }
        }
        if (match.setlist[focus].tiebreaker.result.picked_by !== null && match.setlist[focus].tiebreaker.result.won_by === null)
        {   // this is the in progress song, set its winner
            match.setlist[focus].tiebreaker.result.won_by = pid;
            update_all(match);
            return;
        }
    }
}

function update_all(match)
{
    update_match_state(match);

    for (let focus = 0; focus < match.setlist.length; focus++)
    {
        for (let i = 0; i < match.setlist[focus].songs.length; i++)
        {
            update_song_box(match, focus, i);
        }
        update_song_box(match, focus, "tb");
    }
}

function update_song_box(match, focus_id, song_id)
{
    let song_box_dom = document.getElementById("song_box_" + focus_id + "_" + song_id);
   
    if (song_box_dom === null) {
        return;
    }

    let song_data = null;

    // selec the relevent song data
    if (song_id === "tb") {
        song_data = match.setlist[focus_id].tiebreaker;
    } else {
        song_data = match.setlist[focus_id].songs[song_id];
    }

    // if the song box has any children, remove them all first
    while (song_box_dom.firstChild) {
        song_box_dom.removeChild(song_box_dom.firstChild);
    }

    song_box_dom.classList.value = "";

    // force dom refresh
    void song_box_dom.offsetWidth;

    // apply song box objects
    song_box_dom.classList.value = "song-box";
    song_box_dom.onclick = null;
    
    if (song_data.result.banned_by !== null)
    {   // this song has already been banned
        song_box_dom.classList.add("pid-" + song_data.result.banned_by + "-ban");
        // add strike through overlay
        let song_box_overlay = document.createElement("div");
        song_box_overlay.classList.value = "pid-" + song_data.result.banned_by + "-ban";
        song_box_dom.appendChild(song_box_overlay);
    }
    else if (song_data.result.picked_by !== null)
    {   // this song has already been picked
        if (song_id !== "tb")
        {
            song_box_dom.classList.add("pid-" + song_data.result.picked_by + "-pick");
            if (song_data.result.order_index === (match.state.pick_count - 1) && song_data.result.won_by === null)
            {   // song most recently picked
                song_box_dom.classList.add("pid-" + song_data.result.picked_by + "-pulse");
            }
            else if (song_data.result.won_by !== null)
            {   // song has a winner
                song_box_dom.classList.add("pid-" + song_data.result.won_by + "-win");
            }
        }
        else if (match.state.match_winner_id === null)
        {
            song_box_dom.classList.add("tiebreak-song-pulse");
        }
        else
        {
            song_box_dom.classList.add("tiebreak-song-pick");
            if (song_data.result.won_by !== null)
            {   // song has a winner
                song_box_dom.classList.add("pid-" + song_data.result.won_by + "-win");
            }
        }
    }
    else if (match.state.picking_player_id !== null && song_id !== "tb")
    {   // somebody is picking something, and this one is pickable
        song_box_dom.classList.add("pid-" + match.state.picking_player_id + "-hover");
        song_box_dom.onclick = function() {select_song_box(match, focus_id, song_id)};
    }

    // song title paragrah
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

    // song charter paragraph
    let charter_dom = document.createElement("p");
    charter_dom.classList.value = "song-charter";
    charter_dom.innerHTML = "<i> Charted By: " + song_data.charter + " - Featured On: " + song_data.setlist + "</i>";
    song_box_dom.appendChild(charter_dom);

    // add player select objects, if this one has indeed been selected
    if (song_data.result.picked_by !== null)
    {
        let player_select_dom = document.createElement("div");
        player_select_dom.innerHTML = "<p>" + (song_data.result.order_index + 1) + "</p>";
        song_box_dom.appendChild(player_select_dom);
    }
}

function update_match_state(match) 
{   // update all match state information based upon current song result information
    
    let instruction_dom = document.getElementById("instruction");

    let result_buttons_dom = document.getElementById("result-buttons");

    while (result_buttons_dom.firstChild) {
        result_buttons_dom.removeChild(result_buttons_dom.firstChild);
    }

    dom = document.getElementById("pid-0-box");
    dom.innerHTML = match.players[0].name;

    if (match.players[0].pronouns !== null && match.players[0].pronouns.length > 0)
    {
        dom.innerHTML += " (" + match.players[0].pronouns + ")";
    }

    dom = document.getElementById("pid-1-box");
    dom.innerHTML = match.players[1].name;

    if (match.players[1].pronouns !== null && match.players[1].pronouns.length > 0)
    {
        dom.innerHTML += " (" + match.players[1].pronouns + ")";
    }

    dom = document.getElementById("title-box");
    dom.innerHTML = match.about.tournament_name + "<br>" + match.about.match_name;

    // clear match state
    match.state = {};
    match.state.awaiting_pick = false;
    match.state.picking_player_id = null;
    match.state.last_song_winner_id = null;
    match.state.match_winner_id = null;
    match.state.ban_count = 0;
    match.state.pick_count = 0;
    match.state.song_count = 0;

    // clear player states
    for (let i = 0; i < match.players.length; i++)
    {
        match.players[i].state = {};
        match.players[i].state.ban_count = 0;
        match.players[i].state.pick_count = 0;
        match.players[i].state.song_count = 0;
    }

    let max_song_index = -1;

    // iterate over all songs an all focus groups
    for (let focus = 0; focus < match.setlist.length; focus++)
    {
        match.setlist[focus].unpicked_count = match.setlist[focus].songs.length;

        for (let i = 0; i < match.setlist[focus].songs.length; i++)
        {
            let song_result = match.setlist[focus].songs[i].result;

            if (Number.isInteger(song_result.banned_by))
            {   // this song is already banned; get banning player, and add to their ban total
                match.players[song_result.banned_by].state.ban_count++;
                match.state.ban_count++;

            }
            if (Number.isInteger(song_result.picked_by))
            {   // this song is already picked, and add to their pick total
                match.players[song_result.picked_by].state.pick_count++;
                match.state.pick_count++;
                match.setlist[focus].unpicked_count--;

            }
            if (Number.isInteger(song_result.won_by))
            {   // this song is already won, and add to their pick total
                match.players[song_result.won_by].state.song_count++;
                match.state.song_count++;

                if (song_result.order_index !== null && song_result.order_index > max_song_index)
                {   // this song is the most recently won song (so far); set the correct player id
                    match.state.last_song_winner_id = song_result.won_by;
                    max_song_index = song_result.order_index;
                }
            }
        }

        if (Number.isInteger(match.setlist[focus].tiebreaker.result.picked_by))
        {
            match.state.pick_count++;

            if (Number.isInteger(match.setlist[focus].tiebreaker.result.won_by))
            {   // this song is already won, and add to their pick total
                match.players[match.setlist[focus].tiebreaker.result.won_by].state.song_count++;
                match.state.song_count++;

                if (match.setlist[focus].tiebreaker.result.order_index !== null && match.setlist[focus].tiebreaker.result.order_index > max_song_index)
                {   // this song is the most recently won song (so far); set the correct player id
                    match.state.last_song_winner_id = match.setlist[focus].tiebreaker.result.won_by;
                    max_song_index = match.setlist[focus].tiebreaker.result.order_index;
                }
            }
        }
    }

    for (let i = 0; i < match.players.length; i++)
    {   // get the last song winner and the match winner, if any
        if (match.players[i].state.song_count >= Math.ceil(match.about.ruleset.best_of / 2))
        {   // this player already won, ya dingus!
            match.state.match_winner_id = i;
            break;
        }
    }

    if (match.state.match_winner_id === null && match.state.pick_count === match.state.song_count && match.state.pick_count == (match.about.ruleset.best_of - 1))
    {   // all songs picked, select the tie breaker (most unplayed, or hybrid if same)

        if (match.setlist[1].unpicked_count > match.setlist[0].unpicked_count && match.setlist[1].unpicked_count > match.setlist[2].unpicked_count)
        {   // hybrid bigger than all
            match.setlist[1].tiebreaker.result.picked_by = 2;
            match.setlist[1].tiebreaker.result.order_index = match.state.pick_count;
        }
        else if (match.setlist[0].unpicked_count > match.setlist[2].unpicked_count && match.setlist[0].unpicked_count >= match.setlist[1].unpicked_count)
        {   // solo bigger than strum, and hybrid <= solo
            match.setlist[0].tiebreaker.result.picked_by = 2;
            match.setlist[0].tiebreaker.result.order_index = match.state.pick_count;
        }
        else if (match.setlist[2].unpicked_count > match.setlist[0].unpicked_count && match.setlist[2].unpicked_count >= match.setlist[1].unpicked_count)
        {   // solo bigger than strum, and hybrid <= solo
            match.setlist[2].tiebreaker.result.picked_by = 2;
            match.setlist[2].tiebreaker.result.order_index = match.state.pick_count;
        }
        else
        {   // must be hybrid
            match.setlist[1].tiebreaker.result.picked_by = 2;
            match.setlist[1].tiebreaker.result.order_index = match.state.pick_count;
        }
        match.state.pick_count++;
    }

    // determine the current match state
    if (match.state.ban_count < (match.about.ruleset.bans_per_player * 2))
    {   // we are still banning song
        let i = match.players.length - 1;

        // get ban count of last player
        let last_player_ban_count = match.players[i].state.ban_count;

        while (i > 0)
        {   // check all other players in order of prioirty
            if (match.players[i - 1].state.ban_count > last_player_ban_count)
            {   // previous player has more bans than this player; break to select them
                break;
            }
            i--;
        }

        // i is the player to ban next
        match.state.picking_player_id = i;
        instruction_dom.innerHTML = "Select the next song ban for player \"" + match.players[match.state.picking_player_id].name + "\"";
        return;
    }
    else if (match.state.match_winner_id === null && match.state.pick_count === match.state.song_count && match.state.pick_count < match.about.ruleset.best_of - 1)
    {   // Not awaiting a song result, determine who should be picking
        // set the awaiting pick flag
        match.state.awaiting_pick = true;

        if (match.state.last_song_winner_id === null) 
        { // nobody has won a song yet; first player goes first
            match.state.picking_player_id = 0;
        } 
        else 
        { // picking player should be the player after the 
            match.state.picking_player_id = (match.state.last_song_winner_id + 1) % match.players.length;
        }

        instruction_dom.innerHTML = "Select the next song pick for player \"" + match.players[match.state.picking_player_id].name + "\"";
    }
    else if (match.state.match_winner_id === null)
    {
        let song_name = "";
        // find the song that is in progress
        for (let focus = 0; focus < match.setlist.length; focus++)
        {
            for (let i = 0; i < match.setlist[focus].songs.length; i++)
            {
                let song_data = match.setlist[focus].songs[i];
    
                if (song_data.result.picked_by !== null && song_data.result.won_by === null)
                {   // this is the in progress song, set its winner
                    song_name = song_data.title;
                }
            }

            if (match.setlist[focus].tiebreaker.result.picked_by !== null && match.setlist[focus].tiebreaker.result.won_by === null)
            {   // this is the in progress song, set its winner
                song_name = match.setlist[focus].tiebreaker.title;
            }
        }

        instruction_dom.innerHTML = "Select the winner of song \"" + song_name + "\"";

        let pid_0_win = document.createElement("button");
        pid_0_win.innerText = match.players[0].name;
        pid_0_win.onclick = pid_0_win.onclick = function() {select_player_box(match, 0)};
        result_buttons_dom.appendChild(pid_0_win);

        let pid_1_win = document.createElement("button");
        pid_1_win.innerText = match.players[1].name;
        pid_1_win.onclick = pid_1_win.onclick = function() {select_player_box(match, 1)};
        result_buttons_dom.appendChild(pid_1_win);  
    }
    else
    {
        instruction_dom.innerHTML = "Player \"" + match.players[match.state.match_winner_id].name + "\" has won the match!";
    }
}

async function load_match(match_file_name) {
    // async fetch the sample match data
    const response = await fetch("./" + match_file_name);
    // get json promise text from the response
    let match = await response.json();

    let undo_button = document.getElementById("undo-button");
    undo_button.onclick = function() {undo_last(match)};

    let reset_button = document.getElementById("reset-button");
    reset_button.onclick = function() {reset_all(match)};

    let start_button = document.getElementById("start-button");
    start_button.onclick = function() {start(match)};

    // get the header dom
    let header_dom = document.getElementById("header");

    // empty the header dom
    while (header_dom.firstChild) {
        header_dom.removeChild(header_dom.firstChild);
    }

    let pid_0_dom = document.createElement("div");
    pid_0_dom.id = "pid-0-box";
    pid_0_dom.classList.value = "col pid-0-color"

    header_dom.append(pid_0_dom);

    let title_dom = document.createElement("div");
    title_dom.id = "title-box";
    title_dom.classList.value = "col"
    header_dom.append(title_dom);

    let pid_1_dom = document.createElement("div");
    pid_1_dom.id = "pid-1-box";
    pid_1_dom.classList.value = "col pid-1-color"

    pid_1_dom.onclick = function() {select_player_box(match, 1)};

    header_dom.append(pid_1_dom);

    update_match_state(match);

    // determine how many songs per focus
    let max_song_focus_count = 0;
    for (let i = 0; i < match.setlist.length; i++)
    {
        let c = match.setlist[i].songs.length;

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

        row_dom = document.createElement("tr");

        setlist_dom.append(row_dom);

        for (let focus = 0; focus < match.setlist.length; focus++)
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
        }
    }

    let tb_row_dom = document.createElement("tr");
    tb_row_dom.classList.value = "break-bar";
    setlist_dom.append(tb_row_dom);

    tb_row_dom = document.createElement("tr");
    setlist_dom.append(tb_row_dom);

    for (let focus = 0; focus < match.setlist.length; focus++)
    {   // iterate through all focus groups
        let tb_dom = document.createElement("td");
        tb_row_dom.append(tb_dom);

        tb_dom.id = "song_box_" +  focus + "_tb";
        update_song_box(match, focus, "tb");
    }
    // create a song box for each non-tb song in a focus group
}
