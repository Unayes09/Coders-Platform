package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.Event;
import com.javafest.DiffDeptStormers.util.JwtUtil;
import com.javafest.DiffDeptStormers.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;
    
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event createdEvent = eventService.createEvent(event);
        return ResponseEntity.ok(createdEvent);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    @PostMapping("/interested/{eventId}")
    public ResponseEntity<Event> markInterested(@PathVariable String eventId, @RequestParam String email) {
        Event updatedEvent = eventService.markInterested(eventId, email);
        return ResponseEntity.ok(updatedEvent);
    }
    
    // API to unmark interest in an event
    @PostMapping("/uninterested/{eventId}")
    public ResponseEntity<Event> unmarkInterested(@PathVariable String eventId, @RequestParam String email) {
        Event updatedEvent = eventService.unmarkInterested(eventId, email);
        return ResponseEntity.ok(updatedEvent);
    }

    @GetMapping("/interestedCount/{eventId}")
    public ResponseEntity<Integer> getInterestedCount(@PathVariable String eventId) {
        Event event = eventService.getEventById(eventId);
        if (event != null) {
            return ResponseEntity.ok(event.getInterestedCount().intValue());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete event API
    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<String> deleteEvent(@PathVariable String eventId, @RequestParam String token) {
    	//System.out.println("cont");
        String emailFromToken = jwtUtil.getEmailFromToken(token); 
        Event event = eventService.getEventById(eventId);

        if (event != null && event.getEmail().equals(emailFromToken)) {
            eventService.deleteEvent(eventId);
            return ResponseEntity.ok("Event deleted successfully.");
        } else {
            return ResponseEntity.status(403).body("Unauthorized action.");
        }
    }

    // API to get all events by a user's email
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Event>> getAllEventsByUser(@PathVariable String email) {
        List<Event> events = eventService.getAllEventsByUser(email);
        return ResponseEntity.ok(events);
    }
}
