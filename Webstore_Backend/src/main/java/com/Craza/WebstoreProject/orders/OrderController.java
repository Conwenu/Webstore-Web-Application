package com.Craza.WebstoreProject.orders;

import com.Craza.WebstoreProject.product.ProductService;
import com.Craza.WebstoreProject.user.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final ProductService productService;
    @PostMapping("/handleOrderFromCart/{id}")
    public ResponseEntity<?> handleOrderFromCart(@PathVariable Long id) throws MessagingException, UnsupportedEncodingException {
        if(userRepository.findById(id).get().getBasket().isEmpty())
        {
            return new ResponseEntity<>("Your cart is empty, please add an item to your cart to purchase it.",HttpStatus.OK);
        }
        return new ResponseEntity<>(orderService.handleOrderFromCart(id), HttpStatus.OK);
    }

    @PostMapping("/handleOrderFromItem")
    public ResponseEntity<?> handleOrderFromItem(@RequestBody OrderRequestForItem orderRequestForItem) throws MessagingException, UnsupportedEncodingException {
        if(productService.getProduct(orderRequestForItem.getProductId()) == null)
        {
            return new ResponseEntity<>("This item no longer exists, we apologize for the inconvenience", HttpStatus.OK);
        }
        if(productService.getProduct(orderRequestForItem.getProductId()).getTotalStock() < 1)
        {
            return new ResponseEntity<>("This item is no longer in stock, please try again at a later date.", HttpStatus.OK);
        }
        return new ResponseEntity<>(orderService.handleOrderFromItem(orderRequestForItem), HttpStatus.OK);
    }

    @GetMapping("/getOrderFromId/{orderId}")
    public ResponseEntity<?> getOrderFromId(@PathVariable UUID orderId)
    {
        return new ResponseEntity<>(orderService.getOrderById(orderId),HttpStatus.OK);
    }

    @GetMapping("/getOrdersFromUser/{userId}")
    public ResponseEntity<?> getOrdersFromUser(@PathVariable Long userId)
    {
        return new ResponseEntity<>(orderService.getOrdersFromUser(userId),HttpStatus.OK);
    }

}
