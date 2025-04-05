import { useEffect, useState } from "react";
import { auth } from "../firebase";
import axios from "axios";
import { FileText, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfileAndQuotes = async () => {
      try {
        const user = auth.currentUser;
        const token = await user.getIdToken();

        const [resProfile, resQuotes] = await Promise.all([
          axios.get("http://localhost:5000/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/quotes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfile(resProfile.data.user);
        
        // Sort quotes by event date (earliest first)
        const sortedQuotes = resQuotes.data.quotes.sort((a, b) => 
          new Date(a.event_date) - new Date(b.event_date)
        );
        setQuotes(sortedQuotes);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndQuotes();
  }, []);

  // Find the next upcoming event (the first event with date >= today)
  const getNextEvent = () => {
    if (!quotes.length) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = quotes.filter(q => new Date(q.event_date) >= today);
    return upcomingEvents.length > 0 ? upcomingEvents[0] : quotes[0];
  };

  const nextEvent = getNextEvent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile.first_name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your insurance quotes and profile information
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quotes</p>
              <p className="text-2xl font-semibold text-gray-900">{quotes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Latest Quote</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${quotes[0]?.quote_amount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Event</p>
              <p className="text-2xl font-semibold text-gray-900">
                {nextEvent ? format(new Date(nextEvent.event_date), 'MMM d') : 'No events'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quotes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold">Your Events</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {quotes.length > 0 ? (
            quotes.map((quote, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-wrap gap-6 justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(quote.event_date), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{quote.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{quote.attendees} attendees</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Quote Amount</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${quote.quote_amount}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {quote.event_type}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No quotes yet. Get started by requesting your first quote!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}