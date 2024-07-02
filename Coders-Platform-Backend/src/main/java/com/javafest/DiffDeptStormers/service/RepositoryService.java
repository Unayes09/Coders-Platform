package com.javafest.DiffDeptStormers.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.javafest.DiffDeptStormers.model.Repository;
import com.javafest.DiffDeptStormers.repository.RepositoryRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RepositoryService {

    @Autowired
    private RepositoryRepository repositoryRepository;

    public Repository saveRepository(Repository repository) {
        return repositoryRepository.save(repository);
    }
    
    public Repository updateRepository(String repoId, Repository updatedRepository) {
        Optional<Repository> existingRepoOptional = repositoryRepository.findById(repoId);
        if (existingRepoOptional.isPresent()) {
            Repository existingRepo = existingRepoOptional.get();
            existingRepo.setRepoName(updatedRepository.getRepoName());
            existingRepo.setRepoDescription(updatedRepository.getRepoDescription());
            existingRepo.setRepoTopicTags(updatedRepository.getRepoTopicTags());
            existingRepo.setPublic(updatedRepository.isPublic()); // Ensure correct setter is used
            return repositoryRepository.save(existingRepo);
        } else {
        	throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Repository not found with id: " + repoId);
        }
    }

    public List<Repository> getAllPublicRepositories() {
        return repositoryRepository.findByIsPublicTrue();
    }

    public List<Repository> searchPublicRepositories(String query) {
        return repositoryRepository.findByRepoTopicTagsIgnoreCaseContainingOrRepoNameIgnoreCaseContainingAndIsPublicTrue(query, query);
    }

    public Optional<Repository> findRepositoryById(String repoId) {
        return repositoryRepository.findById(repoId);
    }

    public void deleteRepositoryById(String repoId) {
        repositoryRepository.deleteById(repoId);
    }
}
