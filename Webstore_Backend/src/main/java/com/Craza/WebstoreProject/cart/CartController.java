package com.Craza.WebstoreProject.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
@RestController
public class CartController {
    private final CartService cartService;
    @PostMapping("/addToCart")
    public ResponseEntity<?> addToCart(@RequestBody CartRequest cartRequest)
    {
        cartService.addToCart(cartRequest);
        return new ResponseEntity<>("Added To Cart",HttpStatus.OK);
    }

    @PostMapping("/removeFromCart")
    public ResponseEntity<?> removeFromCart(@RequestBody CartRequest cartRequest)
    {
        cartService.removeFromCart(cartRequest);
        return new ResponseEntity<>("Removed From Cart",HttpStatus.OK);
    }

    @GetMapping("/getCartFromUser/{userId}")
    public ResponseEntity<?> getCartFromUser(@PathVariable("userId") Long userId)
    {
        return new ResponseEntity<List<CartResponse>>(cartService.getCartFromUser(userId), HttpStatus.OK);
    }

    @GetMapping("/isProductInCart/{userId}/{productId}")
    public ResponseEntity<Boolean> isProductInCart(@PathVariable("userId") Long userId, @PathVariable("productId") Long productId)
    {
        return new ResponseEntity<>(cartService.isProductInCart(userId,productId), HttpStatus.OK);
    }

    @GetMapping("/getTotalPriceFromCart/{userId}")
    public ResponseEntity<?> getTotalPriceFromCart(@PathVariable("userId") Long userId)
    {
        return new ResponseEntity<>(cartService.getTotalPriceFromCart(userId),HttpStatus.OK);
    }

    @PutMapping("/emptyCart/{userId}")
    public ResponseEntity<String> emptyCart(@PathVariable("userId") Long userId)
    {
        cartService.emptyCart(userId);
        return new ResponseEntity<>("Emptied Cart", HttpStatus.OK);
    }

    @PutMapping("/updateCart")
    public ResponseEntity<?> editCart(@RequestBody CartRequest cartRequest)
    {
        cartService.updateCart(cartRequest);
        return new ResponseEntity<>("Cart Updated",HttpStatus.OK);
    }


}
