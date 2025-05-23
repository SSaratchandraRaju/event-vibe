import React, { useState, useRef, useEffect } from 'react';
import { Timer, ChevronDown, Calendar, X } from 'lucide-react';

const DEFAULT_EVENTS = [
  {
    id: 1,
    name: "College Fest 2025",
    description: "Join us for a one-of-a-kind music and arts festival that promises to electrify your senses! Featuring top-tier artists, stunning visual performances, and a vibrant atmosphere, College Fest is where music meets creativity. Don’t miss out on the ultimate celebration of sound and color!",
    date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "TechSummit 2024",
    description: "The future of technology is here! TechSummit brings together innovators, entrepreneurs, and experts from around the world for a day full of cutting-edge insights, workshops, and networking opportunities. Whether you're a startup enthusiast or a tech veteran, this event is your gateway to the latest trends in the industry.",
    date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), 
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Get Together",
    description: "Dress to impress and celebrate an unforgettable night of elegance, glamour, and entertainment. The Get Together brings together celebrities, philanthropists, and influencers for an evening filled with live performances, fine dining, and a red-carpet experience. A night to remember, supporting great causes and unforgettable moments!",
    date: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), 
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80"
  }
];

function App() {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isEventLive, setIsEventLive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDate, setEditDate] = useState('');  // Holds the edited date as a string
  const [isAddingEvent, setIsAddingEvent] = useState(false);  // State to toggle "Add Event" form visibility
  const [newEventName, setNewEventName] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventImage, setNewEventImage] = useState<File | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null); // Ref for date input field to control focus

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +selectedEvent.date - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
        setIsEventLive(false);
      } else {
        setIsEventLive(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [selectedEvent]);

  // Handle the date change when user submits
  const handleDateChange = (newDate: string) => {
    const updatedEvents = events.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, date: new Date(newDate) }  // Update the event with the new date
        : event
    );
    setEvents(updatedEvents);
    const updatedEvent = updatedEvents.find(event => event.id === selectedEvent.id)!;
    setSelectedEvent(updatedEvent);  // Update selected event to reflect new date
    setIsEditingDate(false);  // Close the date editor
  };

  // Handle adding a new event
  const handleAddEvent = () => {
    const newEvent = {
      id: events.length + 1,  // New ID for the event
      name: newEventName,
      description: newEventDescription,
      date: new Date(newEventDate),
      image: newEventImage ? URL.createObjectURL(newEventImage) : "https://via.placeholder.com/400"  // Use uploaded image or placeholder
    };

    setEvents([...events, newEvent]);
    setIsAddingEvent(false);  // Close the "Add Event" form
    setNewEventName('');
    setNewEventDescription('');
    setNewEventDate('');
    setNewEventImage(null);
  };

  // TimeUnit component to display days, hours, minutes, seconds
  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center p-4 bg-white bg-opacity-95 rounded-lg shadow-lg mx-2 min-w-[120px] transform transition-all hover:scale-105">
      <span className="text-4xl md:text-5xl font-bold text-gray-800 font-mono">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-sm uppercase tracking-wider text-gray-600 mt-2">{label}</span>
    </div>
  );

  // DateEditor component for editing event date
  const DateEditor = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Change Event Date</h3>
          <button
            onClick={() => setIsEditingDate(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          ref={dateInputRef}  // Attach the ref to the date input field
          type="datetime-local"
          className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={editDate || new Date(selectedEvent.date.getTime() - selectedEvent.date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)} // Format date correctly
          onChange={(e) => setEditDate(e.target.value)}  // Update the editDate state when user selects new date
          onFocus={() => {} }  // Prevent calendar from closing on focus
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditingDate(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDateChange(editDate)}  // Call handleDateChange when save button is clicked
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  // EventSelector component for selecting events from dropdown
  const EventSelector = () => (
    <div className="relative mb-8">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-full max-w-md mx-auto px-4 py-2 bg-white bg-opacity-10 rounded-lg text-white hover:bg-opacity-20 transition-all duration-300"
      >
        <span className="flex items-center">
          <Timer className="w-5 h-5 mr-2" />
          {selectedEvent.name}
        </span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden z-10">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => {
                setSelectedEvent(event);
                setIsDropdownOpen(false);  // Close dropdown after selecting event
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-200 ${
                selectedEvent.id === event.id ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <div className="font-semibold">{event.name}</div>
              <div className="text-sm text-gray-500">
                {event.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div 
        className="w-full max-w-4xl mx-auto text-center transition-all duration-700"
        style={{
          backgroundImage: `url(${selectedEvent.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '3rem',
          borderRadius: '1rem',
        }}
      >
        <div className="backdrop-blur-sm bg-black bg-opacity-50 p-8 rounded-xl">
          <EventSelector />
          
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{selectedEvent.name}</h1>
          </div>
          
          <p className="text-xl text-gray-300 mb-8 italic">{selectedEvent.description}</p>

          <button
            onClick={() => setIsEditingDate(true)}  // Open DateEditor to change date
            className="mb-8 flex items-center justify-center mx-auto text-white bg-white bg-opacity-10 hover:bg-opacity-20 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <Calendar className="w-5 h-5 mr-2" />
            <span>
              {selectedEvent.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </button>

          {!isEventLive ? (
            <>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <TimeUnit value={timeLeft.days} label="Days" />
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <TimeUnit value={timeLeft.minutes} label="Minutes" />
                <TimeUnit value={timeLeft.seconds} label="Seconds" />
              </div>

              <div className="relative w-full h-1 bg-gray-700 rounded-full mb-8">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold to-amber-500 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${(1 - (+selectedEvent.date - +new Date()) / (90 * 24 * 60 * 60 * 1000)) * 100}%`
                  }}
                />
              </div>

              <button
                onClick={() => setIsAddingEvent(true)}  // Toggle "Add Event" form visibility
                className="px-8 py-4 text-lg text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
              >
                Add New Event
              </button>

              {/* "Add Event" form */}
        {isAddingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Event</h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Event Name"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Event Description"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <input
                  type="datetime-local"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewEventImage(e.target.files?.[0] ?? null)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddingEvent(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
            </>
          ) : (
            <p className="text-2xl text-white font-semibold">Event is Live!</p>
          )}
        </div>
      </div>



      {isEditingDate && <DateEditor />}
    </div>
  );
}

export default App;
