const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1486333",
  key: "a8353953e340424e9ec5",
  secret: "91bbe43e77cb25fe7777",
  cluster: "ap2",
  useTLS: true
});

router.get('/',(req,res)=>{
    Vote.find().then(votes => {
        return res.json({ success: true, votes: votes})
    });
});

router.post('/',(req,res)=>{

    const newVote = {
        candidate: req.body.candidate,
        points: 1
    }

    new Vote(newVote).save().then(vote => {             //So bascially here we are saving the newVote as Vote model and then the resposne from it is used as promise to trigger the pusher.
        pusher.trigger("poll-app", "poll-vote", {
            points: parseInt(vote.points),         //As vote.points is string so we are converting it into integer
            candidate: vote.candidate
        });

        // let channel = pusher.subscribe('poll-app');             //      
        // channel.bind('pusher:subscription_count', (data) => {   //Same code at above is not working but when we write here it is working
        //     console.log(data.subscription_count);               //    
        // });
        return res.json({ success:true, message: "Thank you for voting"});
    });    
})

module.exports = router;