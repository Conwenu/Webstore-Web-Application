package com.Craza.WebstoreProject.product;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;
    @PostMapping("/createProduct")
    public String createProduct(@RequestBody ProductRequest request)
    {
        return productService.saveProduct(request);

    }

    @GetMapping("/error")
    public String idk()
    {
        return "Erm Something Went Wrong Bro.";
    }

    @GetMapping("/product/{id}")
    public Product showProduct(@PathVariable Long id)
    {
        return productService.getProduct(id);
    }
    @GetMapping("/products")
    public ResponseEntity<List<Product>> showProducts()
    {
        return new ResponseEntity<List<Product>>((List<Product>) productService.getProducts(), HttpStatus.OK);

    }

    @GetMapping("/products/user/{creatorId}")
    public ResponseEntity<?> getProductsByCreatorId(@PathVariable Long creatorId)
    {
        return new ResponseEntity<>(productService.getProductsByCreatorId(creatorId),HttpStatus.OK);
    }

    @DeleteMapping("/deleteProduct/{id}")
    public String deleteProduct (@PathVariable("id") Long id)
    {
        productService.deleteProduct(id);
        return "Deleted";
    }

    @PutMapping("/editProduct/{id}")
    public String editProduct(@PathVariable("id") Long id,@RequestBody ProductRequest request)
    {
        return productService.editProduct(id,request);
    }

    @PostMapping("/rateProduct/{id}")
    public ResponseEntity<?> addRating(@PathVariable("id") Long id, @RequestBody ProductRatingRequest request)
    {
        return new ResponseEntity<>(productService.addRating(id,request),HttpStatus.OK);
    }

    @PostMapping("/unrateProduct/{id}")
    public ResponseEntity<?> removeRating(@PathVariable("id") Long id, @RequestBody ProductRatingRequest request)
    {
        return new ResponseEntity<>(productService.removeRating(id,request),HttpStatus.OK);
    }
    @GetMapping("/getRating/{productId}")
    public ResponseEntity<?> getRating(@PathVariable("productId") Long productId)
    {
        return new ResponseEntity<>(productService.calculateRating(productId),HttpStatus.OK);
    }

    @GetMapping("/getRatingsFromUser/{id}")
    public ResponseEntity<?> removeRating(@PathVariable("id") Long id)
    {
        return new ResponseEntity<>(productService.getRatingsFromUser(id),HttpStatus.OK);
    }




}
