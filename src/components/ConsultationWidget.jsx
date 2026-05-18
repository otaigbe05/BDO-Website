import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { isDateUnavailable } from '@/lib/holidays';

const ConsultationWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  // Form states
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [email, setEmail] = useState('');

  // Listen for external open requests
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-consultation-modal', handleOpen);
    return () => window.removeEventListener('open-consultation-modal', handleOpen);
  }, []);

  // Generate Time Slots (09:00 to 17:00)
  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM"
  ];

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a date for your consultation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsOpen(false);
    
    // Simulating email routing behavior
    console.log(`Sending consultation request to info@bdoanalyticssolutions.com for ${email}`);

    toast({
      title: "Consultation Request Sent! 📨",
      description: `Your request has been routed to info@bdoanalyticssolutions.com. We'll confirm your appointment for ${format(date, 'MMMM do')} at ${time} shortly!`,
      duration: 6000,
    });

    // Reset form after slight delay
    setTimeout(() => {
      setDate(null);
      setTime('');
      setEmail('');
    }, 500);
  };

  // Calculate disabled dates
  const disabledDates = [
    (date) => isDateUnavailable(date), // Weekends & Holidays logic
    { before: new Date() } // Disable past dates
  ];

  return (
    <>
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity text-center shadow-lg pointer-events-none">
          Schedule Free Call
        </div>
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl flex items-center justify-center transition-transform hover:scale-110 focus:scale-110"
          aria-label="Schedule Free Consultation"
        >
          <CalendarIcon className="w-6 h-6 text-white" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Schedule Consultation</h3>
                  <p className="text-blue-100 text-sm">Free 30-minute strategy session</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleSchedule} className="space-y-5">
                  
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Select Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 border-slate-200",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date (Weekdays Only)</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={disabledDates}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Time Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Preferred Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={cn(
                            "px-2 py-2 text-sm rounded-md border transition-all",
                            time === slot 
                              ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                              : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                   <div className="space-y-2">
                    <label htmlFor="widget-email" className="block text-sm font-medium text-slate-700">Email Address</label>
                    <input 
                      id="widget-email"
                      type="email" 
                      required 
                      placeholder="doctor@clinic.com"
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">Request will be sent to info@bdoanalyticssolutions.com</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold shadow-lg"
                    disabled={!date || !time || !email}
                  >
                    Confirm Booking
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConsultationWidget;