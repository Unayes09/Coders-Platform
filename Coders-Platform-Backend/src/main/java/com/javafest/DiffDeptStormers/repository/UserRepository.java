package com.javafest.DiffDeptStormers.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.javafest.DiffDeptStormers.model.User;

public interface UserRepository extends MongoRepository<User, String> {
	boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByEmail(String email);
}