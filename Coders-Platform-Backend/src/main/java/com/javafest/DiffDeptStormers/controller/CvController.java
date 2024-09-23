package com.javafest.DiffDeptStormers.controller;

import com.javafest.DiffDeptStormers.model.*;
import com.javafest.DiffDeptStormers.model.cv.*;
import com.javafest.DiffDeptStormers.service.MongoCvService;
import com.javafest.DiffDeptStormers.service.MongoUserService;
import com.javafest.DiffDeptStormers.util.JwtUtil;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins="*")
@RestController
@RequestMapping("/api/cv")
public class CvController {

    @Autowired
    private MongoCvService cvService;

    @Autowired
    private MongoUserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    private ResponseEntity<?> validateToken(String token) {
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("{\"message\": \"Invalid token\"}");
        }
        return null;
    }

    private String getEmailFromToken(String token) {
        return jwtUtil.getEmailFromToken(token);
    }

    private boolean isAuthorized(String token, String ownerEmail) {
        String email = getEmailFromToken(token);
        User user = userService.findByEmail(email);
        return user != null && user.getEmail().equals(ownerEmail);
    }

    // POST APIs

    @PostMapping("/personal")
    public ResponseEntity<?> createPersonal(@RequestBody CVPersonal personal, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null){return validationResponse;}

            if (!isAuthorized(token, personal.getEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            CVPersonal createdPersonal = cvService.createPersonal(personal);
            return ResponseEntity.ok(createdPersonal);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @PostMapping("/project")
    public ResponseEntity<?> createProject(@RequestBody ProjectSkill project, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, project.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            ProjectSkill createdProject = cvService.createProject(project);
            return ResponseEntity.ok(createdProject);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @PostMapping("/technology")
    public ResponseEntity<?> createTechnology(@RequestBody TechnologySkill techSkill, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, techSkill.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            TechnologySkill createdTechSkill = cvService.createTechnology(techSkill);
            return ResponseEntity.ok(createdTechSkill);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @PostMapping("/achievement")
    public ResponseEntity<?> createAchievement(@RequestBody AchievementSkill achievement, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, achievement.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            AchievementSkill createdAchievement = cvService.createAchievement(achievement);
            return ResponseEntity.ok(createdAchievement);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @PostMapping("/experience")
    public ResponseEntity<?> createExperience(@RequestBody ExperienceSkill experience, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, experience.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            ExperienceSkill createdExperience = cvService.createExperience(experience);
            return ResponseEntity.ok(createdExperience);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    // PUT APIs (Update)

    @PutMapping("/personal")
    public ResponseEntity<?> updatePersonal(@RequestParam String email, @RequestBody CVPersonal personal, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, personal.getEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            cvService.updatePersonal(email,personal);
            return ResponseEntity.ok(personal);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @PutMapping("/project")
    public ResponseEntity<?> updateProject(@RequestParam String Id, @RequestBody ProjectSkill project, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, project.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            cvService.updateProject(Id,project);
            return ResponseEntity.ok(project);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @PutMapping("/technology")
    public ResponseEntity<?> updateTechnology(@RequestParam String Id, @RequestBody TechnologySkill techSkill, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, techSkill.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            cvService.updateTechnologySkill(Id,techSkill);
            return ResponseEntity.ok(techSkill);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @PutMapping("/achievement")
    public ResponseEntity<?> updateAchievement(@RequestParam String Id, @RequestBody AchievementSkill achievement, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, achievement.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            cvService.updateAchievementSkill(Id, achievement);
            return ResponseEntity.ok(achievement);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @PutMapping("/experience")
    public ResponseEntity<?> updateExperience(@RequestParam String Id, @RequestBody ExperienceSkill experience, @RequestParam String token) {
        try {
            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, experience.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            cvService.updateExperienceSkill(Id,experience);
            return ResponseEntity.ok(experience);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    // DELETE APIs

    @DeleteMapping("/project/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable String id, @RequestParam String token) {
        try {
            ProjectSkill project = cvService.getProjectById(id);
            if (project == null) {
                return ResponseEntity.status(404).body("{\"message\": \"Not found\"}");
            }

            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, project.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            cvService.deleteProject(id);
            return ResponseEntity.ok("{\"message\": \"Deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @DeleteMapping("/technology/{id}")
    public ResponseEntity<?> deleteTechnology(@PathVariable String id, @RequestParam String token) {
        try {
            TechnologySkill techSkill = cvService.getTechnologyById(id);
            if (techSkill == null) {
                return ResponseEntity.status(404).body("{\"message\": \"Not found\"}");
            }

            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, techSkill.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            cvService.deleteTechnology(id);
            return ResponseEntity.ok("{\"message\": \"Deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @DeleteMapping("/achievement/{id}")
    public ResponseEntity<?> deleteAchievement(@PathVariable String id, @RequestParam String token) {
        try {
            AchievementSkill achievement = cvService.getAchievementById(id);
            if (achievement == null) {
                return ResponseEntity.status(404).body("{\"message\": \"Not found\"}");
            }

            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, achievement.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            cvService.deleteAchievement(id);
            return ResponseEntity.ok("{\"message\": \"Deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable String id, @RequestParam String token) {
        try {
            ExperienceSkill experience = cvService.getExperienceById(id);
            if (experience == null) {
                return ResponseEntity.status(404).body("{\"message\": \"Not found\"}");
            }

            ResponseEntity<?> validationResponse = validateToken(token);
            if (validationResponse != null) {return validationResponse;}

            if (!isAuthorized(token, experience.getUserEmail())) {
                return ResponseEntity.status(403).body("{\"message\": \"Unauthorized\"}");
            }

            cvService.deleteExperience(id);
            return ResponseEntity.ok("{\"message\": \"Deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }

    // GET API

    @GetMapping("/getByEmail")
    public ResponseEntity<?> getByEmail(@RequestParam String email) {
        try {
        	List<List<Object>> personal = cvService.getAllDataByEmail(email);
            if (personal == null) {
                return ResponseEntity.status(404).body("{\"message\": \"Not found\"}");
            }
            return ResponseEntity.ok(personal);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"message\": \"Internal server error\"}");
        }
    }
}
