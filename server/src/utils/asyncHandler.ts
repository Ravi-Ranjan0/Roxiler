import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (requestHandler: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      // Enhance error with request context in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`[AsyncHandler] Error in ${req.method} ${req.path}:`, err);
        err.request = {
          method: req.method,
          path: req.path,
          params: req.params,
          query: req.query,
          body: req.body
        };
      }
      next(err);
    });
  };
};

export { asyncHandler };