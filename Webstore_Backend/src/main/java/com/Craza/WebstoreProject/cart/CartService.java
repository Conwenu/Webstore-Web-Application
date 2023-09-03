package com.Craza.WebstoreProject.cart;

import com.Craza.WebstoreProject.product.Product;
import com.Craza.WebstoreProject.product.ProductRepository;
import com.Craza.WebstoreProject.product.ProductService;
import com.Craza.WebstoreProject.user.User;
import com.Craza.WebstoreProject.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CartService {
    private final UserRepository userRepository;
    private final ProductService productService;
    private final ProductRepository productRepository;
    public Optional<User> findById(Long id)
    {
        return userRepository.findById(id);
    }
    public void addToCart(CartRequest cartRequest)
    {
        Optional<User> user = findById(cartRequest.getCreatorId());
        Map<Long,Integer> cart  = user.get().getBasket();
        Long prodId = cartRequest.getProductId();
        if(productRepository.findById(prodId).isPresent() && !this.isProductInCart(cartRequest.getCreatorId(), cartRequest.getProductId()))
        {
            int quantity = cartRequest.getQuantity();
            cart.put(prodId,quantity);
            userRepository.save(user.get());
        }
    }

    public void removeFromCart(CartRequest cartRequest)
    {
        Optional<User> user = findById(cartRequest.getCreatorId());
        Long prodId = cartRequest.getProductId();
        if(productRepository.findById(prodId).isPresent())
        {
            user.get().getBasket().remove(prodId);
            userRepository.save(user.get());
        }
    }

    public void removeFromCartWithId(Long productId, Long userId)
    {
        Optional<User> user = findById(userId);
        user.ifPresent(value -> value.getBasket().remove(productId));
        userRepository.save(user.get());
    }

    public List<CartResponse> getCartFromUser(Long userId)
    {
        Optional<User> user = findById(userId);
        Map<Long,Integer> tempCart = user.get().getBasket();
        List<CartResponse> cartResponseList = new ArrayList<>();
        for(Long id : tempCart.keySet())
        {
            Product tempProduct = productService.getProduct(id);
            if(tempProduct == null)
            {
                continue;
            }
            CartResponse cartResponse = new CartResponse();
            cartResponse.setProductId(tempProduct.getId());
            cartResponse.setCreatorId(tempProduct.getCreatorId());
            cartResponse.setName(tempProduct.getName());
            cartResponse.setPrice(tempProduct.getPrice());
            cartResponse.setDescription(tempProduct.getDescription());
            cartResponse.setImageId(tempProduct.getImageId());
            cartResponse.setImageUrl(tempProduct.getImageUrl());
            cartResponse.setTotalStock(tempProduct.getTotalStock());
            cartResponse.setQuantity(tempCart.get(id));
            cartResponseList.add(cartResponse);
        }
        return cartResponseList;
    }
    public Boolean isProductInCart(Long userId,Long productId)
    {
        Optional<User> user = findById(userId);
        return user.get().getBasket().containsKey(productId);

    }

    public void emptyCart(Long userId)
    {
        Optional<User> user = findById(userId);
        user.get().getBasket().clear();
        userRepository.save(user.get());
    }

    public void updateCart(CartRequest cartRequest)
    {
        Optional<User> user = findById(cartRequest.getCreatorId());
        Long prodId = cartRequest.getProductId();
        int newQuantity = cartRequest.getQuantity();
        Product tempProduct = productService.getProduct(prodId);
        if(tempProduct.getTotalStock() < newQuantity)
        {
            newQuantity = tempProduct.getTotalStock();
        } else if (newQuantity == 0) {
            newQuantity = 1;
        }
        user.get().getBasket().put(prodId,newQuantity);
        userRepository.save(user.get());
    }

    public double getTotalPriceFromCart(Long userId)
    {
        Optional<User> user = findById(userId);
        Map<Long,Integer> tempCart = user.get().getBasket();
        double totalPrice = 0.0;
        for(Long id : tempCart.keySet())
        {
            Product tempProduct = productService.getProduct(id);
            if(tempProduct == null)
            {
                continue;
            }
            totalPrice += (tempProduct.getPrice() * tempCart.get(id));
        }
        return totalPrice;
    }

}
