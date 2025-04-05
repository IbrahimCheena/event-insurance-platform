import { useState, useRef, useEffect } from "react";
import { auth } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, DollarSign, Printer } from 'lucide-react';

export default function QuoteForm() {
  const [form, setForm] = useState({
    event_type: "",
    event_date: "",
    location: "",
    attendees: "",
  });

  const [eventTypes, setEventTypes] = useState([]);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const quoteRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login to get a quote");
        navigate("/login");
        return;
      }

      const token = await user.getIdToken();
      const res = await axios.post("http://localhost:5000/api/quotes", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuote({
        ...form,
        quote_amount: res.data.quote_amount,
        date_generated: new Date().toISOString(),
      });

      if (quoteRef.current) {
        quoteRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      console.error("Quote error:", err);
      alert("Failed to get quote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const user = auth.currentUser;
        const token = await user.getIdToken();
        const res = await axios.get("http://localhost:5000/api/event-types", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEventTypes(res.data.event_types);
      } catch (error) {
        console.error("Failed to fetch event types:", error);
      }
    };

    fetchEventTypes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Get a Quote</h1>
          <p className="mt-1 text-sm text-gray-600">
            Fill in your event details to receive an instant quote
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                <div className="flex items-center justify-center px-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="event_type"
                  name="event_type"
                  value={form.event_type}
                  onChange={handleChange}
                  className="block w-full py-2 pr-3 border-0 focus:ring-0 focus:outline-none"
                  required
                >
                  <option value="">Select event type</option>
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                <div className="flex items-center justify-center px-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={form.event_date}
                  onChange={handleChange}
                  className="block w-full py-2 pr-3 border-0 focus:ring-0 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Event Location
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                <div className="flex items-center justify-center px-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="block w-full py-2 pr-3 border-0 focus:ring-0 focus:outline-none"
                  placeholder="Enter event location"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Attendees
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
                <div className="flex items-center justify-center px-3">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="attendees"
                  name="attendees"
                  value={form.attendees}
                  onChange={handleChange}
                  min="1"
                  className="block w-full py-2 pr-3 border-0 focus:ring-0 focus:outline-none"
                  placeholder="Enter number of attendees"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-base font-medium text-white ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Quote...
                </>
              ) : (
                <>
                  <DollarSign className="h-5 w-5 mr-2" />
                  Get Quote
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {quote && (
        <div
          ref={quoteRef}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Quote</h2>
              <p className="mt-1 text-sm text-gray-600">
                Generated on {new Date(quote.date_generated).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Quote
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
                <dl className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <dt className="text-sm font-medium text-gray-500 w-24">Type:</dt>
                    <dd className="text-sm text-gray-900">{quote.event_type}</dd>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <dt className="text-sm font-medium text-gray-500 w-24">Date:</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(quote.event_date).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <dt className="text-sm font-medium text-gray-500 w-24">Location:</dt>
                    <dd className="text-sm text-gray-900">{quote.location}</dd>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-2" />
                    <dt className="text-sm font-medium text-gray-500 w-24">Attendees:</dt>
                    <dd className="text-sm text-gray-900">{quote.attendees}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Quote Summary</h3>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-indigo-600">
                    ${quote.quote_amount}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    This quote is valid for 30 days
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      // Handle purchase flow
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Purchase Insurance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
