const form = document.getElementById('vote-form');
const subCount = document.getElementById('subscriberCount');
const totalSub = document.getElementById('totalSub');

//Form submit event
form.addEventListener('submit', e => {
    const choice = document.querySelector('input[name=candidate]:checked').value;
    const data = {candidate: choice};

    fetch('http://localhost:3000/poll',{
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type' : 'application/json'   //Adding new header to the response
        })
    }).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));

    e.preventDefault();
});

//We are using GET request to fetch all the data in /poll GET request.
fetch('http://localhost:3000/poll').then(res => res.json()).then(data =>{
    const votes = data.votes;
    const totalVotes = votes.length;  //To get the total votes casted
    

    // Count vote points - accumalator/current 
    // Calculate points individually for each candidate
    const voteCounts = votes.reduce((acc, vote) => (acc[vote.candidate] = (acc[vote.candidate] || 0) + parseInt(vote.points) , acc), {} );


    //Canvasjs event

    let dataPoints = [
    { label: 'Muller', y: voteCounts.Muller},
    { label: 'Tim', y: voteCounts.Tim},
    { label: 'Brad', y: voteCounts.Brad},
    { label: 'Kevin', y: voteCounts.Kevin}
    ];

    const chartContainer = document.querySelector('#chartContainer');

    if(chartContainer){
        const chart = new CanvasJS.Chart('chartContainer' , {  //We are not definig CanvasJS here because we are using its cdn in the index.html file
            animationEnabled: true,
            theme: 'theme1',
            title: {
                text: `Total Votes ${totalVotes}`
            },

            data: [
                {
                    type: 'column',
                    dataPoints: dataPoints
                }
            ]
        });
        chart.render();

        //Taken from the pusher dashboard. This is used to detch the data from poll.js file and update the chart
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        var pusher = new Pusher('a8353953e340424e9ec5', {   //We are not definig Pusher here because we are using its cdn in the index.html file
            cluster: 'ap2'
        });

        var channel = pusher.subscribe('poll-app');
        channel.bind('poll-vote', function(data) {    //This data is coming from poll.js
        dataPoints = dataPoints.map(x =>{
            if(x.label == data.candidate){
                x.y +=data.points;
                return x;            //We are returning x so that the x retains its value. Otherwise x will have no value
            }
            else{
                return x;
            }
        });

        chart.render();
        });
    }                
    channel.bind('pusher:subscription_count', (data) => {   
        totalSub.textContent = data.subscription_count;
        //console.log(data.subscription_count);             
    });
 });
