const errorHandler= (err, req,res,next)=>{
 let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

// MongoDB defines error codes.
//When MongoDB rejects an operation because of a duplicate value in a unique index, it returns an error with code:
//11000.  and since shortcode is unique so. 

// Mongoose receives that database error and gives it to your Node.js application as an Error object.
/*It will contain information roughly like:

{
  name: "MongoServerError",
  code: 11000,
  ...
} 
  So:

err.code

is 11000.*/
   if (err.code === 11000) {
    statusCode = 409;
    message = "Short code already exists";
  }
/*What's 11000?

MongoDB uses error code:

11000

for a duplicate key violation.

Our schema says:

unique: true

so MongoDB effectively says:

"You are trying to insert a value that already exists in this unique index." */


    res.status(statusCode).json({
        success: false,
        message,
        errors,


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