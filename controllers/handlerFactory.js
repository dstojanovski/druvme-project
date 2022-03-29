const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.deleteOne = Model => catchAsync( async (req, res, next) => {

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc){
        return next (new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
    status: "The doc was deleted successfully",

    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    // Update the tour and returs options like NEW -> return the update tour and runValidators-> run the validators again on the model.
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true,
    });

    if (!doc){
        return next (new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'Updated doc',
        data: {
             data: doc,
        }
    });
});
