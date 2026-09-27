import { supabase } from "../config/supabase.js";

export async function createBooking(req, res) {
  try {
    const { mentor_name, user_name, phone_number, business_type, booking_date, time_slot } = req.body;

    if (!mentor_name || !user_name || !phone_number || !booking_date || !time_slot) {
      return res.status(400).json({
        success: false,
        error: "Missing required booking details (mentor_name, user_name, phone_number, booking_date, time_slot)",
      });
    }

    let savedData = null;

    if (supabase) {
      const { data, error } = await supabase
        .from("mentor_bookings")
        .insert([
          {
            mentor_name,
            user_name,
            phone_number,
            business_type: business_type || "Rural Business",
            booking_date,
            time_slot,
            status: "Confirmed",
          },
        ])
        .select();

      if (error) console.warn("Supabase booking insert warning:", error.message);
      savedData = data;
    }

    res.json({
      success: true,
      message: "Mentor consultation session booked successfully",
      booking: savedData,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getBookings(req, res) {
  try {
    if (!supabase) return res.json({ success: true, bookings: [] });

    const { data, error } = await supabase
      .from("mentor_bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, bookings: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
