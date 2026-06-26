package com.url.url_shortner.controller;

import com.url.url_shortner.model.Url;
import com.url.url_shortner.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UrlController {

    @Autowired
    private UrlService urlService;

    @PostMapping("/api/shorten")
    public ResponseEntity<Map<String, Object>> shortenUrl(@RequestBody Map<String, String> request) {
        String originalUrl = request.get("url");

        Url url = urlService.shortenUrl(originalUrl);

        Map<String, Object> response = new HashMap<>();
        response.put("shortCode", url.getShortCode());
        response.put("originalUrl", url.getOriginalUrl());
        response.put("shortUrl", "http://localhost:8081/" + url.getShortCode());
        response.put("clickCount", url.getClickCount());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{code}")
    public ResponseEntity<Void> redirect(@PathVariable String code) {
        Url url = urlService.getByShortCode(code);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", url.getOriginalUrl());

        return ResponseEntity.status(HttpStatus.FOUND).headers(headers).build();
    }

}