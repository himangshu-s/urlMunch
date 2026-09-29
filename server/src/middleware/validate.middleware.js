import ApiError from "../utils/ApiError.js";

const validate = (schema) =>{ // we are making the middleware reusable , this time schema= createUrlSchema , it can be other scheam too for other use. 
    return (req, res, next)=>{
        const result = schema.safeParse(req.body);

        if(!result.success){
            const errors= result.error.issues.map((issue)=>({
                field:issue.path.join("."),
                message: issue.message,
            }));
            return next(new ApiError (400, "validation failed", errors));
        }


    req.body= result.data 
    next(); // handles tot he controllers.
    }
}

export default validate;
/*. Suppose the request is:

{
  "originalUrl": "https://youtube.com"
}. the schema.safeParse(req.body);  asks zod 
Does this req.body follow the rules defined in this schema?"

If valid:

{
  success: true,
  data: {
    originalUrl: "https://youtube.com"
  }
}

If invalid:

{
  success: false,
  error: ...
}



There are two common approaches:

schema.parse(req.body);

If invalid, parse() throws an error.

Whereas:

schema.safeParse(req.body);

doesn't throw. It gives you:

{ success: true, data: ... }

or

{ success: false, error: ... }

For our middleware, safeParse() is convenient because we want to take the validation error and send it through our existing ApiError → errorHandler flow ourselves.

*/