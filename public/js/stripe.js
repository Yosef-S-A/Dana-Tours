/* eslint-disable */

const bookBtn = document.getElementById('book-tour');

// const stripe = Stripe('pk_test_51KZyQyL4sHmrSopqwOffK1fhyHPqRgYUbBVzfpfmx6YSrppHqfE540Jf38Ntz6ChqbE2JZb4BThyTDCRP9W6z2io0031WZbZD7');
var stripe = Stripe('pk_test_51KZyQyL4sHmrSopqwOffK1fhyHPqRgYUbBVzfpfmx6YSrppHqfE540Jf38Ntz6ChqbE2JZb4BThyTDCRP9W6z2io0031WZbZD7');

const bookTour = async tourId => {
  try {
    // Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);