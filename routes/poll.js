const express = require('express');
const router = express.Router();

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1486333",
  key: "a8353953e340424e9ec5",
  secret: "91bbe43e77cb25fe7777",
  cluster: "ap2",
  useTLS: true
});

router.get('/',(req,res)=>{
    res.send('POLL');
});

router.post('/',(req,res)=>{
    pusher.trigger("poll-app", "poll-vote", {
        points: 1,
        candidate: req.body.candidate
    });

    return res.json({ success:true, message: "Thank you for voting"})
    
})

module.exports = router;