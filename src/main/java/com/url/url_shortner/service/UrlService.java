package com.url.url_shortner.service;

import com.url.url_shortner.model.Url;
import com.url.url_shortner.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UrlService {

    private static final String CHARS =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    @Autowired
    private UrlRepository urlRepository;

    public Url shortenUrl(String originalUrl) {
        Optional<Url> existing = urlRepository.findByOriginalUrl(originalUrl);
        if (existing.isPresent()) {
            return existing.get();
        }

        Url url = new Url();
        url.setOriginalUrl(originalUrl);
        Url savedUrl = urlRepository.save(url);

        String shortCode = encode(savedUrl.getId());
        savedUrl.setShortCode(shortCode);

        return urlRepository.save(savedUrl);
    }

    public Url getByShortCode(String shortCode) {
        Optional<Url> url = urlRepository.findByShortCode(shortCode);
        if (url.isEmpty()) {
            throw new RuntimeException("Short URL not found: " + shortCode);
        }

        Url foundUrl = url.get();
        foundUrl.setClickCount(foundUrl.getClickCount() + 1);
        return urlRepository.save(foundUrl);
    }

    private String encode(long id) {
        StringBuilder sb = new StringBuilder();
        while (id > 0) {
            sb.append(CHARS.charAt((int) (id % 62)));
            id /= 62;
        }
        return sb.reverse().toString();
    }

}