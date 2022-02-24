const Tour = require("../models/tourModel");

// GET ALL TOURS
exports.getAllTours = async (req, res) => {
  try {
    // Building Query
    
    // FILTERING
    // usage: uri?field_1[filter]=value_1
    const queryObj = {...req.query};
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>  `$${match}`);
    console.log(JSON.parse(queryStr));

    const query = Tour.find(JSON.parse(queryStr));

    console.log(req.query);
    
    // SORTING
    // usage: uri?sort=field_1,field_2
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy)
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt');
    }

    // FIELD LIMITING
    // usage: uri?fields=field_1,field_2
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select ('-__v');
    }

    // PAGINATION
    // usage: uri?page=page_num&limit=item_per_page
    const  page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip =(page - 1) * limit;


    query  = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error ("This is page does not exist");
    }

    // EXECUTE QUERY
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
