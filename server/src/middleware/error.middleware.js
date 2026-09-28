const errorHandler= (err, req,res,next)=>{
    const statusCode = err.statusCode || 500;
   
    res.status(statusCode).json({
        success: false,
        message:err.message || "Internal server error",
        errors:err.errors || [],


    })
}

export default errorHandler;

// this is the moiddleware that is sending the error as a response to the client.
/*. ApiError is only a object that we call in the controllers each time we throw an error , it doesn;t send the error or the error response tot he clinet. 

// look , we haven;t created any connecttion betweeen ApiError and error middleware , to understand this= 
as sson as an error thorws insdie the asyncHanlder , catch(next) triggered [catch(next) is basically catch(error => next(error))]
 now the express goes tot he error middleware and trigger it and error sent. 
 // express knows it by its 4 parameters , usually middlewares have 3 parametere, error middleware have 4 parameters, (err, req,res,next)




 Conceptually:

next()
  ↓
continue through normal middleware

next(error)
  ↓
skip normal middleware
  ↓
find error-handling middleware
  ↓
(err, req, res, next)

So if you have:

app.use(logger);
app.use(auth);
app.use(errorHandler);

and an error occurs:

Request
   ↓
logger       ← skipped after error
   ↓
auth         ← skipped after error
   ↓
errorHandler ← executed
*/