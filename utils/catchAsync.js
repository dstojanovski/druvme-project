// The error handling function only implement on GetAllTours and GetTour for example.
module.exports = fn => {
    return (req, res, next) => {
 // This is async function and in the async function if we have a error tha promise is rejected.
  fn (req, res, next).catch(err => next(err));
 }
}