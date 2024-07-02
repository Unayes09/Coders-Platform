package com.javafest.DiffDeptStormers.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.javafest.DiffDeptStormers.model.Repository;

import java.util.List;

public interface RepositoryRepository extends MongoRepository<Repository, String> {
    List<Repository> findByIsPublicTrue();
    List<Repository> findByRepoTopicTagsIgnoreCaseContainingOrRepoNameIgnoreCaseContainingAndIsPublicTrue(String tag, String name);
}
