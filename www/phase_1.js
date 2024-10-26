function determineSong(songID)
{
    let rng = Math.floor(Math.random() * 8);

    switch(rng)
    {
        case 0:
            player1Ban(songID);
            break;

        case 1:
            player2Ban(songID);
            break;

        case 2:
            player1Pick(songID);
            break;

        case 3:
            player2Pick(songID);
            break;

        case 4:
            player1Win(songID);
            break;

        case 5:
            player2Win(songID);
            break;

        case 6:
            player1Steal(songID);
            break;

        case 7:
            player2Steal(songID);
            break;
        
        default:
            break;
    }
}

function player1Ban(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'linear-gradient(to bottom right, transparent 49%, #e91e63 50%, transparent 51%)';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#e91e6344';

    button.style.color = '#FFFFFF44';
}

function player2Ban(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'linear-gradient(to bottom right, transparent 49%, #03a9f4 50%, transparent 51%)';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#03a9f444';

    button.style.color = '#FFFFFF44';
}

function player1Pick(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#e91e63';
    box.style.backgroundColor = '#e91e6344';

    button.style.color = '#FFFFFF';
}

function player2Pick(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#03a9f4';
    box.style.backgroundColor = '#03a9f444';
    
    button.style.color = '#FFFFFF';
}

function player1Win(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#e91e63';
    box.style.backgroundColor = '#e91e6344';

    button.style.color = '#e91e63';
}

function player2Win(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#03a9f4';
    box.style.backgroundColor = '#03a9f444';

    button.style.color = '#03a9f4';
}

function player1Steal(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#03a9f4';
    box.style.backgroundColor = '#03a9f444';

    button.style.color = '#e91e63';
}

function player2Steal(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#e91e63';
    box.style.backgroundColor = '#e91e6344';

    button.style.color = '#03a9f4';
}

function predictedTiebreaker(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#FFFFFF44';
    box.style.backgroundColor = '#FFFFFF44';
    
    button.style.color = '#FFFFFF';
}

function tiebreakerPick(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#e6e619';
    box.style.backgroundColor = '#e6e61944';
    box.style.animationName = 'tiebreak-pulse';
    box.style.animationDuration = '1.3s';
    box.style.animationIterationCount = 'infinite';
    
    button.style.color = '#FFFFFF';
}

function player1Tiebreaker(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#e6e619';
    box.style.backgroundColor = '#e6e61944';

    button.style.color = '#e91e63';
}

function player2Tiebreaker(songID)
{
    let button = document.getElementById(songID);
    let box = document.getElementById(songID + "box");

    box.style.background = 'transparent';
    box.style.outlineStyle = 'solid';
    box.style.outlineColor = '#e6e619';
    box.style.backgroundColor = '#e6e61944';

    button.style.color = '#03a9f4';
}