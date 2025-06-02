const { requestCounter,activeUser,requestDurationCounter} = require("./requestCount")

const metricsMiddleware = (req,res,next)=>
{
    const startTime=Date.now();
      const routePath = req.route?.path || req.originalUrl.split('?')[0];

       activeUser.inc({
            method: req.method,
            route: routePath
        })
 
    res.on('finish',()=>{
        const endTime = Date.now();  
        console.log(`Request took ${endTime - startTime}ms`);
        
        requestDurationCounter.observe({
            method:req.method,
            route:routePath,
            code:res.statusCode
        },endTime-startTime)
        
        requestCounter.inc({
            method: req.method,
            route: routePath,
            status_code: res.statusCode
        })

        activeUser.dec({
            method: req.method,
            route: routePath
        })

    })
    next();
}

module.exports={metricsMiddleware}