const form = document.getElementById('vote-form');

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

//Canvasjs event

let dataPoints = [
    { label: 'Muller', y: 0},
    { label: 'Tim', y: 0},
    { label: 'Brad', y: 0},
    { label: 'Kevin', y: 0}
];

const chartContainer = document.querySelector('#chartContainer');

if(chartContainer){
    const chart = new CanvasJS.Chart('chartContainer' , {  //We are not definig CanvasJS here because we are using its cdn in the index.html file
        animationEnabled: true,
        theme: 'theme1',
        title: {
            text: 'Election Results'
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