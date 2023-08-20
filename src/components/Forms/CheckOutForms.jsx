import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "./CheckOutForms.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { ImSpinner9 } from "react-icons/im";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ closeModal, bookingInfo }) => {
  const { user } = useContext(AuthContext);
  const [axiosSecure] = useAxiosSecure();
  const stripe = useStripe();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const elements = useElements();
  const [cardError, setCardError] = useState();
  const [paymentIntent, setPaymentIntent] = useState("");

  // Get Payment Intent From Backend
  useEffect(() => {
    if (bookingInfo?.price) {
      axiosSecure
        .post("/payment/create-payment-intent", {
          price: bookingInfo?.price,
        })
        .then((data) => {
          setPaymentIntent(data.data.clientSecret);
        })
        .catch((err) => {
          // Catch Errors for Get Payment Intent From Backend
          const errorData = err.response.data;
          if (errorData.status === "fail") {
            setCardError(errorData.message);
          } else if (errorData.status === "error") {
            setCardError(errorData.message);
          } else {
            setCardError(err.message);
          }
        });
    }
  }, [bookingInfo, axiosSecure]);

  // Handle Card Submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      return;
    }

    setProcessing(true);
    // Confirm The Payment
    const { paymentIntent: payIntent, error: confirmError } =
      await stripe.confirmCardPayment(paymentIntent, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.displayName || "unknown",
            email: user?.email || "anonymous",
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
    } else {
      // Save to database
      if (payIntent.status === "succeeded") {
        const paymentInfo = {
          ...bookingInfo,
          transactionId: payIntent.id,
          date: new Date(),
        };

        // Send Booking Information With Payment to Database
        axiosSecure
          .post("/bookings", paymentInfo)
          .then((data) => {
            toast.success(data.data.message);

            // Update the Room Booked Status
            axiosSecure
              .patch(`/rooms/status/${paymentInfo.roomId}`, {
                status: true,
              })
              .then((data) => {
                toast.success(data.data.message);
                setProcessing(false);
                closeModal();
                navigate("/dashboard/my-bookings");
              })
              .catch((err) => {
                // Catch Errors for Update the Room Booked Status
                const errorData = err?.response?.data;
                if (errorData.status === "fail") {
                  toast.error(errorData.message);
                } else if (errorData.status === "error") {
                  toast.error(errorData.message);
                } else {
                  toast.error(err.message);
                }
              });
          })
          .catch((err) => {
            // Catch Errors for Send Booking Information to Database
            const errorData = err.response.data;
            if (errorData.status === "fail") {
              toast.error(errorData.message);
            } else if (errorData.status === "error") {
              toast.error(errorData.message);
            } else {
              toast.error(err.message);
            }
          });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {cardError && <p className="text-red-600 ml-8">{cardError}</p>}
      <hr className="mt-8 " />
      <div className="flex mt-2 justify-around">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          onClick={closeModal}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          disabled={!stripe || !paymentIntent || processing}
        >
          {processing ? (
            <ImSpinner9 className="m-auto animate-spin" />
          ) : (
            `Pay ${bookingInfo.price}$`
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
