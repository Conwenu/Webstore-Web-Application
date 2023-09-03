package com.Craza.WebstoreProject.product;


import com.Craza.WebstoreProject.reviews.ReviewService;
import com.Craza.WebstoreProject.user.User;
import com.Craza.WebstoreProject.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductService  {
    private final ProductRepository productRepository;
    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public Iterable<Product> getProducts() {
        return productRepository.findAll();
    }
    public Product getProduct(Long id) {
        return productRepository.findById(id).orElse(null);
    }
    public void deleteProduct(Long id) {
        reviewService.deleteAllReviewsFromProduct(id);
        productRepository.deleteById(id);
    }
    public Iterable<Product> getProductsByCreatorId(Long creatorId){return productRepository.findAllByCreatorId(creatorId);}


    public String saveProduct(ProductRequest request)
    {
        Product productToSave = new Product();
        Optional<User> user = userRepository.findById(request.getCreatorId());
        if(user.isPresent())
        {

            productToSave.setCreatorFirstName(user.get().getFirstName());
            productToSave.setCreatorLastName(user.get().getLastName());
            if(request.getName() == null || request.getName().isEmpty())
            {
                productToSave.setName("No Description Given");
            }
            else
            {
                productToSave.setName(request.getName());
            }
            if(request.getDescription() == null || request.getDescription().isEmpty())
            {
                productToSave.setDescription("No Description Given");
            }
            else
            {
                productToSave.setDescription(request.getDescription());
            }
            if(request.getImageUrl() == null || request.getImageUrl().isEmpty())
            {
                productToSave.setImageUrl("https://stonegatesl.com/wp-content/uploads/2021/04/placeholder.jpg");
            }
            else
            {
                productToSave.setImageUrl(request.getImageUrl());
            }

            productToSave.setPrice(request.getPrice());
            productToSave.setTotalStock(request.getTotalStock());
            productToSave.setImageName(request.getImageName());
            productToSave.setImageId(request.getImageId());
            productToSave.setCreatorId(request.getCreatorId());
            productToSave.setRatings(new HashMap<>());
            productRepository.save(productToSave);
            return "Saved";
        }
        return "User Does Not Exist? Product Cannot Be Saved.";

    }

    public String editProduct(Long id, ProductRequest request)
    {
        Product productToEdit = getProduct(id);
        if(productToEdit == null)
        {
            return "Product Does Not Currently Exist? Product cannot be edited.";
        }
            productToEdit.setName(request.getName());
            if(request.getName() == null || request.getName().isEmpty())
            {
                productToEdit.setName("No Description Given");
            }
            else
            {
                productToEdit.setName(request.getName());
            }
            if(request.getDescription() == null || request.getDescription().isEmpty())
            {
                productToEdit.setDescription("No Description Given");
            }
            else
            {
                productToEdit.setDescription(request.getDescription());
            }
            if(request.getImageUrl() == null)
            {
                productToEdit.setImageUrl(productToEdit.getImageUrl());
            }
            else
            {
                productToEdit.setImageUrl(request.getImageUrl());
            }
            productToEdit.setPrice(request.getPrice());
            productToEdit.setTotalStock(request.getTotalStock());
            productToEdit.setImageName(request.getImageName());
            productToEdit.setImageId(request.getImageId());
            productRepository.save(productToEdit);
            return "Edited";


    }

    public void deleteAllProductsFromUser(Long userId)
    {
        Iterable<Product> products = getProductsByCreatorId(userId);
        for(Product product : products)
        {
            reviewService.deleteAllReviewsFromProduct(product.getId());
            this.deleteProduct(product.getId());
        }
    }

    public String addRating(Long userId, ProductRatingRequest productReviewRequest)
    {
        Long productId = productReviewRequest.getProductId();
        Product product = this.getProduct(productId);
        if(product == null) {return "This product no longer exists";}
        if(!userRepository.findById(userId).isPresent()){return "This user does not or no longer exists";}
        int ratingValue = productReviewRequest.getRating();
        if(ratingValue> 100)
        {
            ratingValue = 100;
        } else if (ratingValue < 0) {
            ratingValue = 0;
        }
        product.getRatings().put(userId, ratingValue);
        productRepository.save(product);
        return "Added Rating";
    }

    public String removeRating(Long userId, ProductRatingRequest productReviewRequest)
    {
        Long productId = productReviewRequest.getProductId();
        Product product = this.getProduct(productId);
        if(product == null) {return "This product no longer exists";}
        product.getRatings().remove(userId);
        productRepository.save(product);
        return "Deleted Rating";
    }

    public void removeUserRatingFromProduct(Long userId, Long productId)
    {
        Product product = this.getProduct(productId);
        product.getRatings().remove(userId);
        productRepository.save(product);
    }
    public int calculateRating(Long productId)
    {
        Product product = this.getProduct(productId);
        if(product == null)
        {
            return 0;
        }
        int a = product.getRatings().size();
        int sum = 0;
        for(Long id : product.getRatings().keySet())
        {
            sum += product.getRatings().get(id);
        }
        double percent = (double)sum / a;
        return ((int) Math.round(percent));
    }

    public void deleteRatingsFromUser(Long userId)
    {
        Iterable<Product> products = getProductsByCreatorId(userId);
        for(Product product : products)
        {
            if(product == null){continue;}
            this.removeUserRatingFromProduct(userId,product.getId());
            productRepository.save(product);
        }
    }

    public Iterable<ProductRatingResponse> getRatingsFromUser(Long userId)
    {
        List<ProductRatingResponse> check = new ArrayList<>();
        Iterable<Product> products = getProducts();

        for(Product product : products)
        {

            if(product.getRatings().containsKey(userId))
            {
                ProductRatingResponse productRatingResponse = new ProductRatingResponse();
                productRatingResponse.setProductId(product.getId());
                productRatingResponse.setProductName(product.getName());
                productRatingResponse.setProductImage(product.getImageUrl());
                productRatingResponse.setRating(product.getRatings().get(userId));
                check.add(productRatingResponse);
            }
        }
        return check;
    }





}
