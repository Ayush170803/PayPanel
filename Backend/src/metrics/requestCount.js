const client = require('prom-client');

const requestCounter = new client.Counter({
    name:"http_requests_total",
    help:"Total no. of http requests",
    labelNames:['method','route','status_code'] 
})

const activeUser = new client.Gauge({
    name:"active_users",
    help:"Total no. of active requests",
    labelNames:['method','route']
})
const requestDurationCounter = new client.Histogram({
    name:"request_durations",
    help:"duration of http requests in ms",
    labelNames:['method','route','code'],
    buckets:[0.1,5,15,50,100,300,500,1000,3000,5000]
})
 module.exports={requestCounter,activeUser,requestDurationCounter};