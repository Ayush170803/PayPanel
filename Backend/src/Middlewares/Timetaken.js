const Timetaken = (req,res,next)=>{
    const startTime = Date.now();
    next();
    const endTime = Date.now();
    console.log( `it took ${endTime-startTime} ms`);
}

module.exports = {Timetaken};