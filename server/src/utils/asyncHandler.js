const asyncHandler= (requestHandler) =>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch(next);
        // catch(next) is basically catch(error => next(error))
    }
}

export default asyncHandler;