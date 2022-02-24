const Tour = require("../models/tourModel");

// GET ALL TOURS
exports.getAllTours = async (req, res) => {
  try {
    // Building Query
    
    // FILTERING
    // =========
    const queryObj = {...req.query};
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>  `$${match}`);
    console.log(JSON.parse(queryStr));

    const query = Tour.find(JSON.parse(queryStr));

    console.log(req.query);
    
    // SORTING
    // =======
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy)
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt');
    }

    const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      }
    });
  } catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};

// GET TOUR BY ID
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// POST NEW TOUR
exports.createTour = async (req, res) => {
  try{
      const newTour = await Tour.create(req.body);

      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

// UPDATE TOUR
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true
    })
    res.status(200).json({
        status: "success",
        data: {
          tour
        },
      });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// DELETE TOUR
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete (req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
